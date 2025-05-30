import { AuthorizedServiceSync, Context, MockContext } from '@txstate-mws/graphql-server'
import { FastifyRequest } from 'fastify'
import { Cache, isNotBlank } from 'txstate-utils'
import { AccessUser, appConfig, AccessDatabase, AccessRoleServiceInternal } from '../internal.js'

interface GrantCategoryRecord {
  allow: boolean
  tags: Set<string>
}

type RoleLookup = Record<string, Record<string, Record<number, Record<string, Set<string>>>>>

export abstract class AuthService<ObjType, RedactedType = ObjType> extends AuthorizedServiceSync<{ sub?: string, client_id?: string }, ObjType, RedactedType> {
  declare ctx: RQContext

  isCurrentUser (login: string) {
    return this.login === login
  }

  protected get login () {
    return this.ctx.login
  }

  protected get user () {
    return this.ctx.authInfo.user
  }

  private roleMatches (roleLookup: RoleLookup, allow: boolean, subjectType: string, control: string, tags?: Record<string, string[]>) {
    const controlLookup = roleLookup[subjectType]?.[control]?.[Number(allow)]
    if (!controlLookup) return false
    for (const tagCategory of Object.keys(controlLookup)) {
      const tagSet = controlLookup[tagCategory]
      if (tagSet?.size && !tags?.[tagCategory]?.some(t => tagSet.has(t))) return false
    }
    return true
  }

  /**
   * Primary function to check if the user has a specific control on a subject type.
   */
  hasControl (subjectType: string, control: string, tags?: Record<string, string[]>) {
    for (const roleLookup of this.ctx.authInfo.roleLookups) {
      // if role has a deny, this role does not permit the control, go to the next role
      if (this.roleMatches(roleLookup, false, subjectType, control, tags)) continue
      // if role has an allow, this role permits the control, since roles are OR'd, we can stop looking
      if (this.roleMatches(roleLookup, true, subjectType, control, tags)) return true
    }
    return false
  }

  /**
   * Returns true if the user has any role that grants the control on any set of tags. Has
   * a slight weakness in that if a role grants on some tags and then denies all the same
   * tags, it will still return true.
   */
  hasAnyControl (subjectType: string, control: string) {
    for (const roleLookup of this.ctx.authInfo.roleLookups) {
      const controlLookup = roleLookup[subjectType]?.[control]
      // if we have any allow, and we don't have a global deny, we have the control
      if (controlLookup?.[1] && (controlLookup?.[0] == null || Object.keys(controlLookup[0]).length)) return true
    }
    return false
  }
}

export interface AuthInfo {
  user?: AccessUser
  roleLookups: RoleLookup[]
}

const allGroupCache = new Cache(async () => {
  return await AccessDatabase.getAllGroups()
}, { freshseconds: 30, staleseconds: 28800 }) // 30 seconds, 8 hours

const userCache = new Cache(async (login: string, ctx: Context) => {
  const groups = await allGroupCache.get()
  const userInfo = (await appConfig.userLookups.byLogins([login], groups))[0] // get user info from motion
  if (!userInfo) return undefined
  const user = await AccessDatabase.upsertAccessUser(userInfo)
  return user
}, { freshseconds: 30, staleseconds: 28800 }) // 30 seconds, 8 hours

const authCache = new Cache(async (login: string, ctx: Context) => {
  const user = await userCache.get(login, ctx)
  if (!user) return { user: undefined, roleLookups: [] }
  const scopes = new Set<string>(isNotBlank(ctx.auth?.scope) ? ctx.auth.scope.split(' ') : [])
  const roles = (await ctx.svc(AccessRoleServiceInternal).findAccessRolesByUserId(user.internalId)).filter(r => (r.scope == null && scopes.size === 0) || scopes.has(r.scope ?? ''))

  // load up all the roles with their grants, grants with their controls, etc
  await Promise.all(roles.map(role => role.load(ctx)))

  const roleLookups: RoleLookup[] = []
  for (const role of roles) {
    const mergedPerRole: RoleLookup = {}
    for (const grant of role.loadedGrants) {
      mergedPerRole[grant.subjectType.name] ??= {}
      for (const control of grant.loadedControls) {
        mergedPerRole[grant.subjectType.name][control] ??= {}
        mergedPerRole[grant.subjectType.name][control][Number(grant.allow)] ??= {}
        for (const tag of grant.loadedTags) {
          mergedPerRole[grant.subjectType.name][control][Number(grant.allow)][tag.category] ??= new Set()
          mergedPerRole[grant.subjectType.name][control][Number(grant.allow)][tag.category].add(tag.tag)
        }
      }
    }
    roleLookups.push(mergedPerRole)
  }
  return { user, roleLookups }
}, { freshseconds: 30, staleseconds: 300 }) // 1 minute, 5 minutes

export interface RQContext extends Context {
  authInfo: AuthInfo
  login: string

  waitForAuth: () => Promise<void>
}

export type RQContextClass = typeof Context & (new (req: FastifyRequest) => RQContext)
export type RQMockContextClass = typeof Context & (new (claims: any) => RQContext)

export function rqContextMixin (Ctx: typeof Context): RQContextClass {
  return class extends Ctx {
    authInfo!: AuthInfo

    get login () {
      return this.auth?.sub ?? this.auth?.client_id ?? 'anonymous'
    }

    async waitForAuth () {
      await super.waitForAuth()
      this.authInfo = await authCache.get(this.login, this)
    }
  }
}

export const DGMockContext = rqContextMixin(MockContext as any) as RQMockContextClass
