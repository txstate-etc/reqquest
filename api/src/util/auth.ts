import { AuthorizedServiceSync, Context, MockContext } from '@txstate-mws/graphql-server'
import { FastifyRequest } from 'fastify'
import { Cache, isNotBlank, unique } from 'txstate-utils'
import { AccessUser, appConfig, AccessDatabase, AccessTag, AccessRoleServiceInternal } from '../internal.js'

type RoleLookup = Record<string, Record<string, Record<string, Record<string, boolean>>>>

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

  private roleMatches (roleLookup: RoleLookup, allow: boolean, subjectType: string, control: string, subject: string, tags?: string[]) {
    const controlLookup = roleLookup[subjectType]?.[control]
    if (!controlLookup) return false
    if (tags?.length && tags.some(t => controlLookup[subject]?.[t] === allow || controlLookup['all'][t] === allow)) return true
    if (controlLookup[subject]?.['all'] === allow) return true
    if (controlLookup['all']?.['all'] === allow) return true
    return false
  }

  hasControl (subjectType: string, control: string, subject?: string, tags?: AccessTag[]) {
    const tagsList = tags?.map(t => JSON.stringify([t.category, t.tag]))
    for (const roleLookup of this.ctx.authInfo.roleLookups) {
      // if role has a deny, this role does not permit the control, go to the next role
      if (this.roleMatches(roleLookup, false, subjectType, control, subject ?? 'all', tagsList)) continue
      // if role has an allow, this role permits the control, since roles are OR'd, we can stop looking
      if (this.roleMatches(roleLookup, true, subjectType, control, subject ?? 'all', tagsList)) return true
    }
    return false
  }
}

export interface AuthInfo {
  user?: AccessUser
  roleLookups: RoleLookup[]
}

const allGroupCache = new Cache(async () => {
  const roles = await AccessDatabase.getAccessRoles()
  return unique((await AccessDatabase.getGroupsByRoleIds(roles.map(r => r.id))).map(g => g.value)) // get all groups
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

  /**
   * {
   *   Prompt: {
   *     all: {
   *       all: {
   *         view: true
   *       }
   *     },
   *     have_yard_prompt: {
   *       all: {
   *         view: true
   *       },
   *       texas: {
   *         view: false
   *       }
   *     }
   *   }
   * }
   */

  const roleLookups: RoleLookup[] = []
  for (const role of roles) {
    const mergedPerRole: RoleLookup = {}
    for (const grant of role.loadedGrants) {
      mergedPerRole[grant.subjectType] ??= {}
      for (const control of grant.loadedControls) {
        mergedPerRole[grant.subjectType][control.name] ??= {}
        for (const subject of grant.loadedSubjects ?? [{ id: 'all' }]) {
          mergedPerRole[grant.subjectType][control.name][subject.id] ??= {}
          for (const tag of control.loadedTags ?? [{ tag: 'all' }]) {
            const tagid = tag.tag === 'all' ? 'all' : JSON.stringify([tag.category, tag.tag])
            mergedPerRole[grant.subjectType][control.name][subject.id][tagid] &&= grant.allow
          }
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
