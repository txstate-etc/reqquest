import { Context, ValidatedResponse, ValidatedResponseArgs } from '@txstate-mws/graphql-server'
import { ObjectType, InputType, Field, ID, registerEnumType } from 'type-graphql'
import { AccessRoleGrantControlRow, AccessRoleGrantRow, AccessRoleGrantTagRow, AccessRoleRow, AccessRoleService, AccessUserIdentifierRow, AccessUserRow, ControlDefinition, JsonData, safeParse, subjectTypes, TagCategoryDefinition, TagDefinition } from '../internal.js'
import { isBlank } from 'txstate-utils'

@ObjectType()
export class Access {}

@ObjectType({ description: 'A user that has or once had access to the system.' })
export class AccessUser {
  constructor (row: AccessUserRow) {
    this.internalId = row.id
    this.login = row.login
    this.otherInfo = safeParse(row.otherInfo)
  }

  internalId: number

  @Field(type => ID)
  login: string

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

  @Field(() => [ID], { nullable: true })
  logins?: string[]

  @Field(() => [String], { nullable: true })
  otherIdentifiers?: string[]

  @Field(() => [AccessUserIdentifierInput], { nullable: true })
  otherIdentifersByLabel?: AccessUserIdentifierInput[]

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
    this.tags = def.tags?.map(category => new AccessTagCategory(category, category.category, category.label ?? category.category)) ?? []
  }

  @Field()
  name: string

  @Field(type => [AccessTagCategory])
  tags: AccessTagCategory[]
}

@ObjectType()
export class AccessTagCategory {
  constructor (public def: TagCategoryDefinition, value: string, label: string) {
    this.value = value
    this.label = label
    this.listable = !def.notListable
  }

  @Field()
  value: string

  @Field()
  label: string

  @Field({ nullable: true })
  description?: string

  @Field()
  listable: boolean
}

@ObjectType()
export class AccessTag {
  constructor (value: string, label: string) {
    this.value = value
    this.label = label
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
    this.subjectType = row.subjectType
    this.allow = !!row.allow
    this.roleId = String(row.roleId)
    this.internalId = row.id
    this.id = String(row.id)
  }

  internalId: number
  roleId: string

  @Field(type => ID)
  id: string

  @Field({ description: 'The type of subject this grant applies to, e.g. "movie".' })
  subjectType: string

  @Field({ nullable: true, description: `
    The specific subject instance this grant applies to, e.g. if subjectType is "movie",
    subject might be "The Princess Bride", and the grant applies to that movie. If null,
    the grant applies to all movies. It's a little more complicated than that when we consider
    the "allow" setting, see that description for more details.
  ` })
  subject?: string

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

  loadedControls!: AccessGrantControl[]
  loadedTags!: AccessGrantTag[]

  async load (ctx: Context) {
    if (this.loadedControls) return
    ([this.loadedControls, this.loadedTags] = await Promise.all([
      ctx.svc(AccessRoleService).getControlsByGrantId(this.id),
      ctx.svc(AccessRoleService).getTagsByGrantId(this.internalId)
    ]))
  }
}

@ObjectType({ description: 'This is a control record on a specific grant on a specific role, whereas AccessControl represents the control as a global concept.' })
export class AccessGrantControl {
  constructor (row: AccessRoleGrantControlRow) {
    this.internalId = row.id
    this.name = row.control
    console.log(row.subjectType, row.control, subjectTypes[row.subjectType])
    this.description = subjectTypes[row.subjectType].controls[row.control].description
    this.grantInternalId = row.grantId
    this.grantId = String(row.grantId)
    this.roleInternalId = row.roleId
    this.roleId = String(row.roleId)
    this.subjectType = row.subjectType
  }

  internalId: number
  roleInternalId: number
  roleId: string
  grantInternalId: number
  grantId: string
  subjectType: string

  @Field()
  name: string

  @Field()
  description: string
}

@ObjectType()
export class AccessGrantTag {
  constructor (row: AccessRoleGrantTagRow) {
    this.category = row.category
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

  @Field({})
  category: string

  @Field({ nullable: true })
  categoryLabel?: string
}

@InputType()
export class AccessTagInput {
  @Field({ description: 'The tag value, e.g. "TX".' })
  tag!: string

  @Field({ description: 'The category this tag belongs to, e.g. "State".' })
  category!: string
}

@InputType()
export class AccessControlInput {
  @Field({ description: 'The action this grant applies to, e.g. "view" or "update".' })
  control!: string
}

@InputType()
export class AccessRoleGrantCreate {
  @Field()
  subjectType!: string

  @Field(type => [AccessTagInput], { nullable: true, description: 'A list of tags to restrict a grant. For instance, if this is added to a grant on PromptAnswer-update, each tag refers to a subset of App Requests.' })
  tags?: AccessTagInput[]

  @Field(type => [AccessControlInput], { description: 'A list of controls that are allowed or denied by this grant. Each subjectType has a list of available controls, available under Query.subjectTypes.' })
  controls!: AccessControlInput[]

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
