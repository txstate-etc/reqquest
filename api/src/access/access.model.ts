import { Context, ValidatedResponse, ValidatedResponseArgs } from '@txstate-mws/graphql-server'
import { ObjectType, InputType, Field, ID } from 'type-graphql'
import { AccessRoleGrantRow, AccessRoleGrantTagRow, AccessRoleRow, AccessRoleService, AccessUserIdentifierRow, AccessUserRow, ControlDefinition, JsonData, safeParse, ControlGroupDefinitionProcessed, controlGroups, TagCategoryDefinition, AccessRoleGroupRow } from '../internal.js'
import { DateTime } from 'luxon'

@ObjectType()
export class Access {}

@ObjectType({ description: 'A user that has or once had access to the system.' })
export class AccessUser {
  constructor (row: AccessUserRow) {
    this.internalId = row.id
    this.login = row.login
    this.fullname = row.fullname
    this.otherInfo = row.otherInfo
    this.stillValid = !!row.stillValid
  }

  internalId: number

  @Field(type => ID)
  login: string

  @Field()
  fullname: string

  @Field(type => JsonData, { nullable: true, description: 'A JSON object containing any information about the user that the implementing application wants to store. Could be useful for constructing personalized UI.' })
  otherInfo?: any

  @Field({ description: 'True as long as the lookupUser.byLogins function still returns this user. False otherwise. Likely this user has been deactivated.' })
  stillValid: boolean
}

@InputType({ description: 'A label and ID pair for an external user unique ID. For example, { label: "Student ID", id: "123456" }' })
export class AccessUserIdentifierInput {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string
}

@InputType({ description: 'A label and ID pair for an internal and external user related attributes. For example, [{ label: "institutionalRole", id: "Staff" }, { label: "group", id: "Admin" }]' })
export class AccessUserGroupingInput {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string
}

@ObjectType({ description: 'A label and ID pair for an external user unique ID. For example, { label: "Student ID", id: "123456" }' })
export class AccessUserIdentifier {
  constructor (row: AccessUserIdentifierRow) {
    this.id = row.id
    this.label = row.label
    this.userInternalId = row.userId
  }

  @Field(type => ID, { description: 'The unique ID for this identifier, e.g. "123456".' })
  id: string

  @Field({ description: 'The label for this identifier, e.g. "Student ID".' })
  label: string

  userInternalId: number
}

@InputType()
export class AccessUserFilter {
  internalIds?: number[]

  @Field({ nullable: true, description: 'If true, only return the user that is currently logged in.' })
  self?: boolean

  @Field(() => [ID], { nullable: true })
  logins?: string[]

  @Field(() => [String], { nullable: true, description: 'Filter by identifiers aside from username, like an Employee ID.' })
  otherIdentifiers?: string[]

  @Field(() => [AccessUserIdentifierInput], { nullable: true })
  otherIdentifiersByLabel?: AccessUserIdentifierInput[]

  @Field(() => [AccessUserGroupingInput], { nullable: true })
  otherGroupingsByLabel?: AccessUserGroupingInput[]

  // TODO: add filtering by user indexes, probably want a special input type like AppRequestIndexFilter

  @Field({ nullable: true })
  search?: string
}

/** Role models */
@ObjectType()
export class AccessRole {
  constructor (row: AccessRoleRow) {
    this.id = String(row.id)
    this.name = row.name ?? 'unnamed'
    this.scope = row.scope
    this.description = row.description
  }

  @Field(type => ID)
  id: string

  @Field()
  name: string

  @Field({ nullable: true, description: 'A description of the grant. This is not used for anything, but can be useful for admins to understand what the grant was trying to do.' })
  description?: string

  @Field({ nullable: true })
  scope?: string

  loadedGrants!: AccessRoleGrant[]

  async load (ctx: Context) {
    if (this.loadedGrants) return
    this.loadedGrants = await ctx.svc(AccessRoleService).getGrantsByRoleId(this.id)
    await Promise.all(this.loadedGrants.map(grant => grant.load(ctx)))
  }
}

@InputType()
export class AccessRoleInput {
  @Field()
  name!: string

  @Field({ nullable: true, description: 'Attach this role to a specific authentication scope, e.g. "parent".' })
  scope?: string

  @Field({ nullable: true, description: 'A description of the role. This is not used for anything, but can be useful for admins to understand what the role is trying to do.' })
  description?: string

  @Field(type => [String], { description: 'A list of groups this role is associated with.' })
  groups?: string[]
}

@ObjectType()
export class AccessRoleGroupManager {
  constructor (manager: { fullname: string, email?: string }) {
    this.fullname = manager.fullname
    this.email = manager.email
  }

  @Field({ description: 'The date the group was added to a role.' })
  fullname: string

  @Field({ nullable: true, description: 'The date the group was added to a role.' })
  email?: string
}

@ObjectType()
export class AccessRoleGroup {
  constructor (row: AccessRoleGroupRow) {
    this.roleId = String(row.roleId)
    this.groupName = row.groupName
    this.dateAdded = DateTime.fromJSDate(row.dateAdded)
  }

  @Field(type => ID)
  roleId: string

  @Field({ description: 'The name of the group. This should be unique even among all roleIds.' })
  groupName: string

  @Field({ description: 'The date the group was added to a role.' })
  dateAdded: DateTime

  // @Field({ nullable: true, description: 'List of managers or entities that manage members of group.' })
  // managers?: AccessRoleGroupManager[]

  // async load (ctx: Context) {
  //   if (this.loadedGrants) return
  //   this.loadedGrants = await ctx.svc(AccessRoleService).getGrantsByRoleId(this.id)
  //   await Promise.all(this.loadedGrants.map(grant => grant.load(ctx)))
  // }
}

@ObjectType()
export class AccessControlGroup {
  constructor (name: string) {
    this.name = name
    const def = controlGroups[name]
    this.title = def.title ?? name
    this.description = def.description
    this.tags = def.tags?.map(category => new AccessTagCategory(category)) ?? []
  }

  @Field()
  name: string

  @Field({ description: 'A slightly longer version of the control group\'s name, for display in the role management interface.' })
  title: string

  @Field({ nullable: true, description: 'A longer explanation of the control group for display in the role management interface.' })
  description?: string

  @Field(type => [AccessTagCategory])
  tags: AccessTagCategory[]
}

@ObjectType()
export class AccessTagCategory {
  constructor (public def: TagCategoryDefinition) {
    this.category = def.category
    this.label = def.label ?? def.category
    this.description = def.description
    this.listable = !def.notListable
  }

  @Field()
  category: string

  @Field()
  label: string

  @Field({ nullable: true })
  description?: string

  @Field()
  listable: boolean
}

@ObjectType()
export class AccessTag {
  constructor (value: string, label?: string) {
    this.value = value
    this.label = label ?? value
  }

  @Field()
  value: string

  @Field()
  label: string
}

@ObjectType()
export class AccessControl {
  constructor (controlGroup: string, name: string, def: ControlDefinition) {
    this.controlGroup = controlGroup
    this.name = name
    this.description = def.description
  }

  controlGroup: string

  @Field()
  name: string

  @Field()
  description: string
}

@ObjectType()
export class AccessRoleGrant {
  constructor (row: AccessRoleGrantRow) {
    this.controlGroup = new AccessControlGroup(row.controlGroup)
    this.allow = !!row.allow
    this.roleId = String(row.roleId)
    this.internalId = row.id
    this.id = String(row.id)
  }

  internalId: number
  roleId: string

  @Field(type => ID)
  id: string

  @Field(type => AccessControlGroup, { description: 'The group this control belongs to. e.g. Reviewer - Review Phase' })
  controlGroup: AccessControlGroup

  @Field({ description: `
    If true, this grant allows the action specified by the selected controls. If false, it removes
    the controls.

    Removing a control only happens within the context of a single role. If another role grants the
    same control, the action is allowed. This is more of an exception system than a denial
    system. So you can do something like add the "view" control to the "movie" control group in one
    grant, and then in a second grant in the same role, remove it from "The Princess Bride". Now you
    have a role that grants "view" on all movies _except_ The Princess Bride. If the user has another role
    that grants "view" on The Princess Bride (or on all movies), they can view it based on that other role.
  ` })
  allow: boolean

  loadedControls!: string[]
  loadedTags!: AccessGrantTag[]

  async load (ctx: Context) {
    if (this.loadedControls) return
    ([this.loadedControls, this.loadedTags] = await Promise.all([
      ctx.svc(AccessRoleService).getControlsByGrantId(this.id),
      ctx.svc(AccessRoleService).getTagsByGrantId(this.internalId)
    ]))
  }
}

@ObjectType()
export class AccessRoleGrantActions {}

@ObjectType()
export class AccessGrantTag {
  constructor (row: AccessRoleGrantTagRow) {
    const controlGroup = controlGroups[row.controlGroup] as ControlGroupDefinitionProcessed
    const category = controlGroup.tagCategoryLookup[row.category] as TagCategoryDefinition
    this.category = row.category
    this.categoryLabel = category.label ?? row.category
    this.tag = row.tag
    this.controlGroup = row.controlGroup
    this.grantId = row.grantId
    this.roleId = row.roleId
  }

  grantId: number
  roleId: number
  controlGroup: string

  @Field()
  tag: string

  @Field()
  category: string

  @Field()
  categoryLabel: string
}

@InputType()
export class AccessTagInput {
  @Field({ description: 'The tag value, e.g. "TX".' })
  tag!: string

  @Field({ description: 'The category this tag belongs to, e.g. "State".' })
  category!: string
}

@InputType()
export class AccessRoleGrantCreate {
  @Field({ nullable: true })
  controlGroup?: string

  @Field(type => [AccessTagInput], { nullable: true, description: 'A list of tags to restrict a grant. For instance, if this is added to a grant on PromptAnswer-update, each tag refers to a subset of App Requests.' })
  tags?: AccessTagInput[]

  @Field(type => [String], { nullable: true, description: 'A list of controls that are allowed or denied by this grant. Each controlGroup has a list of available controls, available under Query.controlGroups.' })
  controls?: string[]

  @Field()
  allow!: boolean
}

@InputType()
export class AccessRoleGrantUpdate extends AccessRoleGrantCreate { }

@InputType()
export class AccessRoleFilter {
  @Field(() => [ID], { nullable: true })
  ids?: string[]

  @Field(() => [String], { nullable: true })
  names?: string[]

  @Field(() => [String], { nullable: true })
  groups?: string[]

  @Field(() => [String], { nullable: true })
  scopes?: string[]
}

@ObjectType()
export class AccessRoleValidatedResponse extends ValidatedResponse {
  constructor (config: ValidatedResponseArgs & { accessRole?: AccessRole }) {
    super(config ?? {})
    this.accessRole = config?.accessRole
  }

  @Field(returns => AccessRole, { nullable: true })
  accessRole?: AccessRole
}

@ObjectType()
export class RoleActions {}
