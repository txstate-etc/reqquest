import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql'
import {
  Access, AccessUser, AccessUserFilter, AccessRole, AccessRoleFilter, AccessRoleValidatedResponse,
  RoleActions, AccessUserService, AccessRoleService, AccessRoleGrantCreate, AccessRoleGrant,
  AccessUserIdentifier, AccessRoleInput, AccessGrantControlTag, AccessControl, AccessSubjectType,
  AccessTag, AccessSubjectInstance, AccessSearchType, RQContext, subjectTypes,
  AccessGrantSubject
} from '../internal.js'
import { UnimplementedError, ValidatedResponse } from '@txstate-mws/graphql-server'
import { isBlank } from 'txstate-utils'

@Resolver(of => Access)
export class AccessResolver {
  @Query(returns => Access, { description: `
    This is the global access object. Each field represents a global permission
    like the ability to view the role management interface.
  ` })
  async access (@Ctx() ctx: RQContext) {
    return {}
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the role management UI.' })
  async viewRoleManagement (@Ctx() ctx: RQContext) {
    ctx.svc(AccessRoleService).mayViewRoleManagement()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to create new roles in the role management UI.' })
  async createRole (@Ctx() ctx: RQContext) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the period management UI.' })
  async viewPeriodManagement (@Ctx() ctx: RQContext) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to create new periods in the period management UI.' })
  async createPeriod (@Ctx() ctx: RQContext) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the reviewer dashboard.' })
  async viewReviewerInterface (@Ctx() ctx: RQContext) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the applicant dashboard.' })
  async viewApplicantDashboard (@Ctx() ctx: RQContext) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the app request list.' })
  async viewAppRequestList (@Ctx() ctx: RQContext) {
    throw new UnimplementedError()
  }
}

@Resolver(of => AccessRole)
export class AccessRoleResolver {
  @Query(returns => [AccessRole])
  async roles (@Ctx() ctx: RQContext, @Arg('filter', { nullable: true }) filter?: AccessRoleFilter) {
    return await ctx.svc(AccessRoleService).findAccessRole(filter)
  }

  @FieldResolver(returns => [String])
  async groups (@Ctx() ctx: RQContext, @Root() accessRole: AccessRole) {
    return await ctx.svc(AccessRoleService).getGroupsByRoleId(accessRole.id)
  }

  @FieldResolver(returns => [AccessRoleGrant])
  async grants (@Ctx() ctx: RQContext, @Root() accessRole: AccessRole) {
    return await ctx.svc(AccessRoleService).getGrantsByRoleId(accessRole.id)
  }

  @FieldResolver(returns => RoleActions)
  actions (@Root() accessRole: AccessRole) {
    return accessRole
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleCreate (@Ctx() ctx: RQContext,
    @Arg('role') role: AccessRoleInput,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean
  ) {
    return await ctx.svc(AccessRoleService).createAccessRole(role, validateOnly)
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleUpdate (@Ctx() ctx: RQContext,
    @Arg('roleId', type => ID) roleId: string,
    @Arg('role') role: AccessRoleInput,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean
  ) {
    return await ctx.svc(AccessRoleService).updateAccessRole(roleId, role, validateOnly)
  }

  @Mutation(returns => ValidatedResponse)
  async roleDelete (@Ctx() ctx: RQContext, @Arg('roleId', type => ID) roleId: string) {
    return await ctx.svc(AccessRoleService).deleteAccessRole(roleId)
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleAddGrant (@Ctx() ctx: RQContext, @Arg('roleId', type => ID) roleId: string,
    @Arg('grant') grant: AccessRoleGrantCreate,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean
  ) {
    return await ctx.svc(AccessRoleService).addAccessRoleGrant(roleId, grant, validateOnly)
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleUpdateGrant (@Ctx() ctx: RQContext, @Arg('grantId', type => ID) grantId: string,
    @Arg('grant') grant: AccessRoleGrantCreate,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean
  ) {
    return await ctx.svc(AccessRoleService).updateAccessRoleGrant(grantId, grant, validateOnly)
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleDeleteGrant (@Ctx() ctx: RQContext, @Arg('grantId', type => ID) grantId: string) {
    return await ctx.svc(AccessRoleService).deleteAccessRoleGrant(grantId)
  }
}

@Resolver(of => AccessGrantSubject)
export class AccessGrantSubjectResolver {
  @FieldResolver(returns => String, { description: 'A human readable name for the subject. May change without breaking existing grants.' })
  async name (@Ctx() ctx: RQContext, @Root() subject: AccessGrantSubject) {
    const def = subjectTypes[subject.subjectType]
    const instance = ('getInstance' in def) ? await def.getInstance(subject.id) : undefined
    return instance?.name ?? subject.id
  }
}

@Resolver(of => AccessGrantControlTag)
export class AccessGrantControlTagResolver {
  @FieldResolver(returns => String, { description: 'A human readable name for the tag. May change without breaking existing tag assignments.' })
  async name (@Ctx() ctx: RQContext, @Root() tag: AccessGrantControlTag) {
    const tags = await subjectTypes[tag.subjectType].controls[tag.control].getAllTags?.() ?? []
    const tagDef = tags.find(t => t.tag === tag.tag && t.category === tag.category)
    return tagDef?.name ?? tag.tag
  }

  @FieldResolver(returns => String)
  async categoryLabel (@Ctx() ctx: RQContext, @Root() tag: AccessGrantControlTag) {
    const tags = await subjectTypes[tag.subjectType].controls[tag.control].getAllTags?.() ?? []
    const tagDef = tags.find(t => t.tag === tag.tag && t.category === tag.category)
    return tagDef?.categoryLabel ?? tag.category
  }
}

@Resolver(of => RoleActions)
export class RoleActionsResolver {
  @FieldResolver(returns => Boolean)
  view (@Ctx() ctx: RQContext, @Root() role: AccessRole) {
    return ctx.svc(AccessRoleService).mayView(role)
  }

  @FieldResolver(returns => Boolean)
  update (@Ctx() ctx: RQContext, @Root() role: AccessRole) {
    return ctx.svc(AccessRoleService).mayUpdate(role)
  }

  @FieldResolver(returns => Boolean)
  delete (@Ctx() ctx: RQContext, @Root() role: AccessRole) {
    return ctx.svc(AccessRoleService).mayDelete(role)
  }
}

@Resolver(of => AccessUser)
export class AccessUserResolver {
  @Query(returns => [AccessUser])
  async accessUsers (@Ctx() ctx: RQContext, @Arg('filter', { nullable: true }) filter?: AccessUserFilter) {
    return await ctx.svc(AccessUserService).find(filter)
  }

  @FieldResolver(returns => [String])
  groups (@Ctx() ctx: RQContext, @Root() accessUser: AccessUser) {
    return ctx.svc(AccessUserService).getGroupsByUserId(accessUser.internalId)
  }

  @FieldResolver(returns => AccessRole)
  async roles (@Ctx() ctx: RQContext, @Root() accessUser: AccessUser) {
    return await ctx.svc(AccessRoleService).findAccessRolesByUserId(accessUser.internalId)
  }

  @FieldResolver(returns => [AccessUserIdentifier])
  async otherIdentifiers (@Ctx() ctx: RQContext, @Root() accessUser: AccessUser) {
    return await ctx.svc(AccessUserService).getOtherIdentifiers(accessUser.internalId)
  }
}

@Resolver(of => AccessSubjectType)
export class AccessSubjectTypeResolver {
  @Query(returns => [AccessSubjectType], { description: 'This is where you get information about the authorization system. Each grant will be associated with one of these subjectTypes and optionally a list of subject instances. The grant will also have a set of controls, and each control will have an optional set of tags. The tags are used to limit the scope of the grant.' })
  async subjectTypes (@Ctx() ctx: RQContext) {
    return Object.keys(subjectTypes).map(name => new AccessSubjectType(name))
  }

  @FieldResolver(returns => [AccessSubjectInstance], { description: 'A list of all possible instances of this subjectType. Use this to populate the subject dropdown when creating a grant.' })
  async subjects (@Ctx() ctx: RQContext, @Root() subjectType: AccessSubjectType, @Arg('search', { nullable: true, description: 'Set this arg to filter the list based on the search. If this subjectType is not marked as searchable, this search will be ignored. If it is marked as searchable, an empty search will probably not return any instances (but it is up to the implementation of the subjectType).' }) search?: string) {
    const def = subjectTypes[subjectType.name]
    if (subjectType.subjectSearchType === AccessSearchType.NONE) return []
    if (!('getInstances' in def)) throw new Error('getInstances() is required unless subjectSearchType is NONE')
    if (subjectType.subjectSearchType === AccessSearchType.SEARCH) {
      if (isBlank(search)) return []
      return (await def.getInstances(search)).map(subjDef => new AccessSubjectInstance(subjDef))
    } else if ('searchable' in def && def.searchable === false) {
      return (await def.getInstances()).map(subjDef => new AccessSubjectInstance(subjDef))
    }
    throw new Error('searchable must be false, not null, if subjects are to be listed.')
  }

  @FieldResolver(returns => [AccessControl], { description: 'A list of all possible controls for this subjectType. Use this to populate the control dropdown when creating a grant.' })
  async controls (@Ctx() ctx: RQContext, @Root() subjectType: AccessSubjectType) {
    const controls = subjectTypes[subjectType.name].controls
    return Object.keys(controls).map(name => new AccessControl(subjectType.name, name, controls[name]))
  }
}

@Resolver(of => AccessControl)
export class AccessControlResolver {
  @FieldResolver(returns => [AccessTag], { nullable: true, description: 'A list of all possible tags for the control. Null if tagging is not supported for the control.' })
  async tags (@Ctx() ctx: RQContext, @Root() control: AccessControl, @Arg('search', { nullable: true }) search?: string) {
    const def = subjectTypes[control.subjectType].controls[control.name]
    const tags = await def.getAllTags?.(def.searchable ? search : undefined) ?? []
    return tags.map(tag => new AccessTag(tag))
  }
}
