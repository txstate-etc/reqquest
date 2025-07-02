import { Context, ValidatedResponse, ValidatedResponseArgs } from '@txstate-mws/graphql-server'
import { ObjectType, InputType, Field, ID } from 'type-graphql'
import { AccessRoleGrantRow, AccessRoleGrantTagRow, AccessRoleRow, AccessRoleService, AccessUserIdentifierRow, AccessUserRow, ControlDefinition, JsonData, safeParse, SubjectTypeDefinitionProcessed, subjectTypes, TagCategoryDefinition } from '../internal.js'

@ObjectType()
export class Access {}

@ObjectType({ description: 'A user that has or once had access to the system.' })
export class AccessUser {
  constructor (row: AccessUserRow) {
    this.internalId = row.id
    this.login = row.login
    this.fullname = row.fullname
    this.otherInfo = safeParse(row.otherInfo)
  }

  internalId: number

  @Field(type => ID)
  login: string

  @Field()
  fullname: string

  @Field(type => JsonData, { nullable: true, description: 'A JSON object containing any information about the user that the implementing application wants to store. Could be useful for constructing personalized UI.' })
  otherInfo?: any
}

@InputType({ description: 'A label and ID pair for an external user unique ID. For example, { label: "Student ID", id: "123456" }' })
export class AccessUserIdentifierInput {
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

  @Field({ nullable: true })
  search?: string
}

/** Role models */
@ObjectType()
export class AccessRole {
  constructor (row: AccessRoleRow) {
    this.id = String(row.id)
    this.name = row.name
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
export class AccessSubjectType {
  constructor (name: string) {
    this.name = name
    const def = subjectTypes[name]
    this.title = def.title ?? name
    this.description = def.description
    this.tags = def.tags?.map(category => new AccessTagCategory(category)) ?? []
  }

  @Field()
  name: string

  @Field({ description: 'A slightly longer version of the subject type\'s name, for display in the role management interface.' })
  title: string

  @Field({ nullable: true, description: 'A longer explanation of the subject type for display in the role management interface.' })
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
  constructor (subjectType: string, name: string, def: ControlDefinition) {
    this.subjectType = subjectType
    this.name = name
    this.description = def.description
  }

  subjectType: string

  @Field()
  name: string

  @Field()
  description: string
}

@ObjectType()
export class AccessRoleGrant {
  constructor (row: AccessRoleGrantRow) {
    this.subjectType = new AccessSubjectType(row.subjectType)
    this.allow = !!row.allow
    this.roleId = String(row.roleId)
    this.internalId = row.id
    this.id = String(row.id)
  }

  internalId: number
  roleId: string

  @Field(type => ID)
  id: string

  @Field(type => AccessSubjectType, { description: 'The type of subject this grant applies to, e.g. "movie".' })
  subjectType: AccessSubjectType

  @Field({ description: `
    If true, this grant allows the action specified by the selected controls. If false, it removes
    the controls.

    Removing a control only happens within the context of a single role. If another role grants the
    same control, the action is allowed. This is more of an exception system than a denial
    system. So you can do something like add the "view" control to the "movie" subject type in one
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
    const subjectType = subjectTypes[row.subjectType] as SubjectTypeDefinitionProcessed
    const category = subjectType.tagCategoryLookup[row.category] as TagCategoryDefinition
    this.category = row.category
    this.categoryLabel = category.label ?? row.category
    this.tag = row.tag
    this.subjectType = row.subjectType
    this.grantId = row.grantId
    this.roleId = row.roleId
  }

  grantId: number
  roleId: number
  subjectType: string

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
  subjectType?: string

  @Field(type => [AccessTagInput], { nullable: true, description: 'A list of tags to restrict a grant. For instance, if this is added to a grant on PromptAnswer-update, each tag refers to a subset of App Requests.' })
  tags?: AccessTagInput[]

  @Field(type => [String], { nullable: true, description: 'A list of controls that are allowed or denied by this grant. Each subjectType has a list of available controls, available under Query.subjectTypes.' })
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
