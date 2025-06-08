import { Context, UnimplementedError, ValidatedResponse } from '@txstate-mws/graphql-server'
import { sortby } from 'txstate-utils'
import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql'
import {
  Access, AccessUser, AccessUserFilter, AccessRole, AccessRoleFilter, AccessRoleValidatedResponse,
  RoleActions, AccessUserService, AccessRoleService, AccessRoleGrantCreate, AccessRoleGrant,
  AccessUserIdentifier, AccessRoleInput, AccessControl, AccessSubjectType, subjectTypes,
  AccessRoleGrantUpdate, appConfig, AccessTagCategory, AccessTag, AccessGrantTag,
  AccessRoleGrantActions, AccessRoleServiceInternal, AppRequestService, SubjectTypeDefinitionProcessed,
  TagCategoryDefinition
} from '../internal.js'

@Resolver(of => Access)
export class AccessResolver {
  @Query(returns => Access, { description: `
    This is the global access object. Each field represents a global permission
    like the ability to view the role management interface.
  ` })
  async access (@Ctx() ctx: Context) {
    return {}
  }

  @FieldResolver(returns => Boolean, { description: 'Current user may create a new app request, either for themselves or on behalf of another user.' })
  async createAppRequest (@Ctx() ctx: Context) {
    return ctx.svc(AppRequestService).mayCreate()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the role management UI.' })
  async viewRoleManagement (@Ctx() ctx: Context) {
    ctx.svc(AccessRoleService).mayViewRoleManagement()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to create new roles in the role management UI.' })
  async createRole (@Ctx() ctx: Context) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the period management UI.' })
  async viewPeriodManagement (@Ctx() ctx: Context) {
    return ctx.svc(AccessRoleService).mayViewPeriodManagement()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to create new periods in the period management UI.' })
  async createPeriod (@Ctx() ctx: Context) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the reviewer dashboard.' })
  async viewReviewerInterface (@Ctx() ctx: Context) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the applicant dashboard.' })
  async viewApplicantDashboard (@Ctx() ctx: Context) {
    throw new UnimplementedError()
  }

  @FieldResolver(returns => Boolean, { description: 'Current user is permitted to view the app request list.' })
  async viewAppRequestList (@Ctx() ctx: Context) {
    throw new UnimplementedError()
  }
}

@Resolver(of => AccessRole)
export class AccessRoleResolver {
  @Query(returns => [AccessRole])
  async roles (@Ctx() ctx: Context, @Arg('filter', { nullable: true }) filter?: AccessRoleFilter) {
    return await ctx.svc(AccessRoleService).findAccessRole(filter)
  }

  @Query(returns => [String], { description: 'A list of all possible scopes. Scopes are used to limit users when they are accessing the system through an alternate UI or login method. For instance, if you generate an authentication token to give to a third party, it may have a scope identifying that third party and limiting their access even though they are acting as you. Roles must match the token scope in order to apply permissions.' })
  scopes (@Ctx() ctx: Context) {
    return appConfig.scopes ?? []
  }

  @FieldResolver(returns => [String])
  async groups (@Ctx() ctx: Context, @Root() accessRole: AccessRole) {
    return await ctx.svc(AccessRoleService).getGroupsByRoleId(accessRole.id)
  }

  @FieldResolver(returns => [AccessRoleGrant])
  async grants (@Ctx() ctx: Context, @Root() accessRole: AccessRole) {
    return await ctx.svc(AccessRoleService).getGrantsByRoleId(accessRole.id)
  }

  @FieldResolver(returns => RoleActions)
  actions (@Root() accessRole: AccessRole) {
    return accessRole
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleCreate (@Ctx() ctx: Context,
    @Arg('role') role: AccessRoleInput,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean
  ) {
    return await ctx.svc(AccessRoleService).createAccessRole(role, validateOnly)
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleUpdate (@Ctx() ctx: Context,
    @Arg('roleId', type => ID) roleId: string,
    @Arg('role') role: AccessRoleInput,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean
  ) {
    return await ctx.svc(AccessRoleService).updateAccessRole(roleId, role, validateOnly)
  }

  @Mutation(returns => ValidatedResponse)
  async roleDelete (@Ctx() ctx: Context, @Arg('roleId', type => ID) roleId: string) {
    return await ctx.svc(AccessRoleService).deleteAccessRole(roleId)
  }
}

@Resolver(of => AccessRoleGrant)
export class AccessRoleGrantResolver {
  @FieldResolver(returns => [String])
  async controls (@Ctx() ctx: Context, @Root() accessRoleGrant: AccessRoleGrant) {
    return await ctx.svc(AccessRoleService).getControlsByGrantId(accessRoleGrant.id)
  }

  @FieldResolver(returns => [AccessGrantTag])
  async tags (@Ctx() ctx: Context, @Root() accessRoleGrant: AccessRoleGrant) {
    return await ctx.svc(AccessRoleService).getTagsByGrantId(accessRoleGrant.internalId)
  }

  @FieldResolver(returns => AccessRoleGrantActions)
  actions (@Root() accessRoleGrant: AccessRoleGrant) {
    return accessRoleGrant
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleAddGrant (@Ctx() ctx: Context, @Arg('roleId', type => ID) roleId: string,
    @Arg('grant') grant: AccessRoleGrantCreate,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean
  ) {
    return await ctx.svc(AccessRoleService).addAccessRoleGrant(roleId, grant, validateOnly)
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleUpdateGrant (@Ctx() ctx: Context, @Arg('grantId', type => ID) grantId: string,
    @Arg('grant') grant: AccessRoleGrantUpdate,
    @Arg('validateOnly', { nullable: true }) validateOnly?: boolean
  ) {
    return await ctx.svc(AccessRoleService).updateAccessRoleGrant(grantId, grant, validateOnly)
  }

  @Mutation(returns => AccessRoleValidatedResponse)
  async roleDeleteGrant (@Ctx() ctx: Context, @Arg('grantId', type => ID) grantId: string) {
    return await ctx.svc(AccessRoleService).deleteAccessRoleGrant(grantId)
  }
}

@Resolver(of => AccessRoleGrantActions)
export class AccessRoleGrantActionsResolver {
  @FieldResolver(returns => Boolean)
  async update (@Ctx() ctx: Context, @Root() accessRoleGrant: AccessRoleGrant) {
    const role = await ctx.svc(AccessRoleServiceInternal).findAccessRoleById(accessRoleGrant.roleId)
    return ctx.svc(AccessRoleService).mayUpdate(role!)
  }

  @FieldResolver(returns => Boolean)
  async delete (@Ctx() ctx: Context, @Root() accessRoleGrant: AccessRoleGrant) {
    const role = await ctx.svc(AccessRoleServiceInternal).findAccessRoleById(accessRoleGrant.roleId)
    return ctx.svc(AccessRoleService).mayDelete(role!)
  }
}

@Resolver(of => AccessGrantTag)
export class AccessGrantTagResolver {
  @FieldResolver(returns => String)
  async label (@Ctx() ctx: Context, @Root() tag: AccessGrantTag) {
    const subjectType = subjectTypes[tag.subjectType] as SubjectTypeDefinitionProcessed
    const category = subjectType.tagCategoryLookup[tag.category] as TagCategoryDefinition
    return await category.getLabel?.(tag.tag) ?? tag.tag
  }
}

@Resolver(of => RoleActions)
export class RoleActionsResolver {
  @FieldResolver(returns => Boolean)
  update (@Ctx() ctx: Context, @Root() role: AccessRole) {
    return ctx.svc(AccessRoleService).mayUpdate(role)
  }

  @FieldResolver(returns => Boolean)
  delete (@Ctx() ctx: Context, @Root() role: AccessRole) {
    return ctx.svc(AccessRoleService).mayDelete(role)
  }
}

@Resolver(of => AccessUser)
export class AccessUserResolver {
  @Query(returns => [AccessUser])
  async accessUsers (@Ctx() ctx: Context, @Arg('filter', { nullable: true }) filter?: AccessUserFilter) {
    return await ctx.svc(AccessUserService).find(filter)
  }

  @FieldResolver(returns => [String])
  groups (@Ctx() ctx: Context, @Root() accessUser: AccessUser) {
    return ctx.svc(AccessUserService).getGroupsByUserId(accessUser.internalId)
  }

  @FieldResolver(returns => AccessRole)
  async roles (@Ctx() ctx: Context, @Root() accessUser: AccessUser) {
    return await ctx.svc(AccessRoleService).findAccessRolesByUserId(accessUser.internalId)
  }

  @FieldResolver(returns => [AccessUserIdentifier])
  async otherIdentifiers (@Ctx() ctx: Context, @Root() accessUser: AccessUser) {
    return await ctx.svc(AccessUserService).getOtherIdentifiers(accessUser.internalId)
  }
}

@Resolver(of => AccessSubjectType)
export class AccessSubjectTypeResolver {
  @Query(returns => [AccessSubjectType], { description: 'This is where you get information about the authorization system. Each grant will be associated with one of these subjectTypes and optionally a list of subject instances. The grant will also have a set of controls, and each control will have an optional set of tags. The tags are used to limit the scope of the grant.' })
  async subjectTypes (@Ctx() ctx: Context) {
    return sortby(Object.keys(subjectTypes).map(name => new AccessSubjectType(name)), 'title')
  }

  @FieldResolver(returns => [AccessControl], { description: 'A list of all possible controls for this subjectType. Use this to populate the control dropdown when creating a grant.' })
  async controls (@Ctx() ctx: Context, @Root() subjectType: AccessSubjectType) {
    const controls = subjectTypes[subjectType.name].controls
    return Object.keys(controls).map(name => new AccessControl(subjectType.name, name, controls[name]))
  }
}

@Resolver(of => AccessTagCategory)
export class AccessTagCategoryResolver {
  @FieldResolver(returns => [AccessTag], { description: 'A list of all possible tags for this category. Use this to populate the tag dropdown when creating a grant.' })
  async tags (@Ctx() ctx: Context, @Root() tagCategory: AccessTagCategory) {
    return (await tagCategory.def.getTags?.())?.map(tag => new AccessTag(tag.value, tag.label)) ?? []
  }
}
