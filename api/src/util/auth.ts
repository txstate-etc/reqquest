import { AuthorizedServiceSync, Context, MockContext } from '@txstate-mws/graphql-server'
import { FastifyRequest } from 'fastify'
import { Cache, isNotBlank } from 'txstate-utils'
import { AccessUser, appConfig, AccessDatabase, AccessRoleServiceInternal, getAcceptancePeriodIds, ReqquestUser, PaginationInfoShared, Pagination, PaginationWithCursor, getNonBlockingWorkflowPeriodIds } from '../internal.js'
import { sleep } from 'txstate-utils'

type RoleLookup = Record<string, Record<string, Record<number, Record<string, Set<string>>>>>

export abstract class AuthService<ObjType, RedactedType = ObjType> extends AuthorizedServiceSync<{ sub?: string, client_id?: string }, ObjType, RedactedType> {
  declare ctx: RQContext

  isCurrentUser (login: string) {
    return this.login === login
  }

  isAcceptancePeriod (periodId: string) {
    return this.ctx.authInfo.acceptancePeriods.has(periodId)
  }

  isNonBlockingWorkflowPeriod (periodId: string) {
    return this.ctx.authInfo.nonBlockingPeriods.has(periodId)
  }

  protected get login () {
    return this.ctx.login
  }

  protected get user () {
    return this.ctx.authInfo.user
  }

  protected get impersonationUser () {
    return this.ctx.authInfo.impersonationUser
  }

  async lookupUser (login: string) {
    return await lookupUser(login)
  }

  private roleMatches (roleLookup: RoleLookup, allow: boolean, controlGroup: string, control: string, tags?: Record<string, string[]>) {
    const controlLookup = roleLookup[controlGroup]?.[control]?.[Number(allow)]
    if (!controlLookup) return false
    for (const tagCategory of Object.keys(controlLookup)) {
      const tagSet = controlLookup[tagCategory]
      if (tagSet?.size && !tags?.[tagCategory]?.some(t => tagSet.has(t))) return false
    }
    return true
  }

  /**
   * Primary function to check if the user has a specific control on a control group.
   */
  hasControl (controlGroup: string, control: string, tags?: Record<string, string[]>) {
    for (const roleLookup of this.ctx.authInfo.roleLookups) {
      // if role has a deny, this role does not permit the control, go to the next role
      if (this.roleMatches(roleLookup, false, controlGroup, control, tags)) continue
      // if role has an allow, this role permits the control, since roles are OR'd, we can stop looking
      if (this.roleMatches(roleLookup, true, controlGroup, control, tags)) return true
    }
    return false
  }

  /**
   * Returns true if the user has any role that grants the control on any set of tags. Has
   * a slight weakness in that if a role grants on some tags and then denies all the same
   * tags, it will still return true.
   */
  hasAnyControl (controlGroup: string, control: string) {
    for (const roleLookup of this.ctx.authInfo.roleLookups) {
      const controlLookup = roleLookup[controlGroup]?.[control]
      // if we have any allow, and we don't have a global deny, we have the control
      if (controlLookup?.[1] && (controlLookup?.[0] == null || Object.keys(controlLookup[0]).length)) return true
    }
    return false
  }
}

export interface AuthInfo {
  user?: AccessUser
  impersonationUser?: AccessUser
  roleLookups: RoleLookup[]
  acceptancePeriods: Set<string>
  nonBlockingPeriods: Set<string>
}

const allGroupCache = new Cache(async () => {
  return await AccessDatabase.getAllGroups()
}, { freshseconds: 30, staleseconds: 28800 }) // 30 seconds, 8 hours

async function lookupUser (login: string): Promise<ReqquestUser | undefined> {
  try {
    const groups = await allGroupCache.get()
    const user = (await appConfig.userLookups.byLogins([login], Array.from(new Set(groups.map(g => g.groupName)))))[0]
    // Save user's remote information (e.g. category indexes) upon user lookups and logins
    await AccessDatabase.upsertAccessUser(user)
    return user
  } catch (e: any) {
    console.error('Error looking up user info for login', login, e)
    // we're going to try to fall back to our local copy if the remote user provider
    // is temporarily offline
    const [dbUser] = await AccessDatabase.getAccessUsers({ logins: [login] })
    if (!dbUser) return undefined
    const [groups, otherIdentifiers] = await Promise.all([
      AccessDatabase.getGroupsByUserIds([dbUser.internalId]),
      AccessDatabase.getOtherIdentifiersByUserIds([dbUser.internalId])
    ])
    return dbUser
      ? {
        login: dbUser.login,
        fullname: dbUser.fullname,
        groups: groups.map(g => g.value),
        otherIdentifiers: otherIdentifiers.map(oi => ({ label: oi.label, value: oi.id }))
      }
      : undefined
  }
}

const userCache = new Cache(async (login: string, ctx: Context) => {
  const userInfo = await lookupUser(login)
  if (!userInfo) return undefined
  const user = await AccessDatabase.upsertAccessUser(userInfo)
  return user
}, { freshseconds: 30, staleseconds: 28800 }) // 30 seconds, 8 hours

const acceptancePeriodsCache = new Cache(async () => {
  return await getAcceptancePeriodIds()
})
const nonBlockingWorkflowPeriodsCache = new Cache(async () => {
  return await getNonBlockingWorkflowPeriodIds()
})

const authCache = new Cache(async (login: string, ctx: Context) => {
  const acceptancePeriodPromise = acceptancePeriodsCache.get()
  const nonBlockingPeriodPromise = nonBlockingWorkflowPeriodsCache.get()
  const user = await userCache.get(login, ctx)
  if (!user) return { user: undefined, roleLookups: [], acceptancePeriods: await acceptancePeriodPromise, nonBlockingPeriods: await nonBlockingPeriodPromise }
  const scopes = new Set<string>(isNotBlank(ctx.auth?.scope) ? ctx.auth.scope.split(' ') : [])
  const roles = (await ctx.svc(AccessRoleServiceInternal).findAccessRolesByUserId(user.internalId)).filter(r => (r.scope == null && scopes.size === 0) || scopes.has(r.scope ?? ''))
  // load up all the roles with their grants, grants with their controls, etc
  await Promise.all(roles.map(role => role.load(ctx)))

  const roleLookups: RoleLookup[] = []
  for (const role of roles) {
    const mergedPerRole: RoleLookup = {}
    for (const grant of role.loadedGrants) {
      mergedPerRole[grant.controlGroup.name] ??= {}
      for (const control of grant.loadedControls) {
        mergedPerRole[grant.controlGroup.name][control] ??= {}
        mergedPerRole[grant.controlGroup.name][control][Number(grant.allow)] ??= {}
        for (const tag of grant.loadedTags) {
          mergedPerRole[grant.controlGroup.name][control][Number(grant.allow)][tag.category] ??= new Set()
          mergedPerRole[grant.controlGroup.name][control][Number(grant.allow)][tag.category].add(tag.tag)
        }
      }
    }
    roleLookups.push(mergedPerRole)
  }
  return { user, roleLookups, acceptancePeriods: await acceptancePeriodPromise, nonBlockingPeriods: await nonBlockingPeriodPromise }
}, { freshseconds: 30, staleseconds: 300 }) // 1 minute, 5 minutes

export interface RQContext extends Context {
  authInfo: AuthInfo
  login: string

  waitForAuth: () => Promise<void>

  executePaginated: <T, P extends PaginationInfoShared> (queryType: string, paged: Pagination | PaginationWithCursor | undefined, pageInfo: P, work: (pageInfo: P) => Promise<T> | T) => Promise<T | undefined>

  getPaginationInfo: <P extends PaginationInfoShared = PaginationInfoShared> (queryType: string) => Promise<P | undefined>
}

export type RQContextClass = typeof Context & (new (req: FastifyRequest) => RQContext)
export type RQMockContextClass = typeof Context & (new (claims: any) => RQContext)

export function rqContextMixin (Ctx: typeof Context): RQContextClass {
  return class extends Ctx {
    // AuthN
    authInfo!: AuthInfo

    get login () {
      return this.auth?.username
    }

    async waitForAuth () {
      await super.waitForAuth()
      if (!this.login) return
      this.authInfo = await authCache.get(this.login, this)
      this.authInfo.impersonationUser = this.auth?.impersonatedBy ? await userCache.get(this.auth.impersonatedBy, this) : undefined
    }

    // Pagination
    protected paginationPromises: Record<string, Promise<PaginationInfoShared>> = {}
    protected allPaginationPromises: Record<string, Promise<PaginationInfoShared>> = {}

    async executePaginated <T, P extends PaginationInfoShared> (queryType: string, paged: Pagination | PaginationWithCursor | undefined, pageInfo: P, work: (pageInfo: P) => Promise<T> | T) {
      const paginationRequested = paged != null && (paged.page != null || ('cursor' in paged && paged.cursor != null))
      if (paginationRequested && this.paginationPromises[queryType] != null) throw new Error('Cannot execute more than one paginated request per top-level Query resolver.')
      if (!paged) (pageInfo as any).currentPage = 1
      else if (!('cursor' in paged)) (pageInfo as any).currentPage = paged.page ?? 1
      let ret: T | undefined
      const executePromise = new Promise<P>((resolve, reject) => {
        try {
          const result = work(pageInfo)
          if (result instanceof Promise) {
            result.then(r => {
              ret = r
              resolve(pageInfo)
            }).catch(reject)
          } else {
            ret = result
            resolve(pageInfo)
          }
        } catch (e) {
          reject(e)
        }
      })
      if (paginationRequested) this.paginationPromises[queryType] = executePromise
      else this.allPaginationPromises[queryType] = executePromise
      await executePromise
      return ret
    }

    async getPaginationInfo <P extends PaginationInfoShared = PaginationInfoShared> (queryType: string): Promise<P | undefined> {
      await sleep(1)
      return (await (this.paginationPromises[queryType] ?? this.allPaginationPromises[queryType])) as P
    }
  }
}

export const DGMockContext = rqContextMixin(MockContext as any) as RQMockContextClass
