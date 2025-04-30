import { ValidatedResponse, ValidatedResponseArgs } from '@txstate-mws/graphql-server'
import { ObjectType, InputType, Field, ID, registerEnumType } from 'type-graphql'
import { AccessRoleGrantControlRow, AccessRoleGrantControlTagRow, AccessRoleGrantRow, AccessRoleService, AccessUserIdentifierRow, AccessUserRow, ControlDefinition, JsonData, safeParse, SubjectDefinition, subjectTypes, TagDefinition } from '../internal.js'

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
  constructor (row: any) {
    this.id = String(row.id)
    this.name = row.name
    this.scope = row.scope
  }

  @Field(type => ID)
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  scope?: string

  loadedGrants!: AccessRoleGrant[]
  loadedSubjects!: AccessSubjectInstance[]

  async load (ctx: any) {
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

  @Field(type => [String], { description: 'A list of groups this role is associated with.' })
  groups?: string[]
}

@ObjectType()
export class AccessSubjectType {
  constructor (name: string) {
    this.name = name
    const def = subjectTypes[name]
    this.subjectSearchType = !('searchable' in def) || def.searchable == null ? AccessSearchType.NONE : (def.searchable ? AccessSearchType.SEARCH : AccessSearchType.SELECT)
  }

  @Field()
  name: string

  @Field(type => AccessSearchType, { description: 'The way that subject instances are added to the grant.' })
  subjectSearchType: AccessSearchType
}

@ObjectType()
export class AccessSubjectInstance {
  constructor (subjDef: SubjectDefinition) {
    this.id = subjDef.id
    this.name = subjDef.name ?? subjDef.id
  }

  @Field(type => ID)
  id: string

  @Field()
  name: string
}

export enum AccessSearchType {
  NONE = 'NONE',
  SELECT = 'SELECT',
  SEARCH = 'SEARCH'
}
registerEnumType(AccessSearchType, {
  name: 'AccessSearchType',
  description: 'The way that this list should be interacted with.',
  valuesConfig: {
    NONE: { description: 'There will never be objects in the list. Do not create a UI to interact with the list at all.' },
    SELECT: { description: 'The list will be small enough to make the user browse the whole list and add items by selection.' },
    SEARCH: { description: 'The list will be too large for the user to browse through, or simply not feasible to list exhaustively, so we let the user search for list items.' }
  }
})

@ObjectType()
export class AccessControl {
  constructor (subjectType: string, name: string, def: ControlDefinition) {
    this.subjectType = subjectType
    this.name = name
    this.description = def.description
    this.tagType = def.searchable == null ? AccessSearchType.NONE : (def.searchable ? AccessSearchType.SEARCH : AccessSearchType.SELECT)
  }

  subjectType: string

  @Field()
  name: string

  @Field()
  description: string

  @Field(type => AccessSearchType)
  tagType: AccessSearchType
}

@ObjectType()
export class AccessTag {
  constructor (definition: TagDefinition) {
    this.tag = definition.tag
    this.name = definition.name
    this.category = definition.category
    this.categoryLabel = definition.categoryLabel
  }

  @Field()
  tag: string

  @Field()
  name: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  categoryLabel?: string
}

@ObjectType()
export class AccessRoleGrant {
  constructor (row: AccessRoleGrantRow) {
    this.subjectType = row.subjectType
    this.allow = !!row.allow
    this.roleId = String(row.roleId)
    this.id = String(row.id)
  }

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
  loadedSubjects!: AccessSubjectInstance[]
  async load (ctx: any) {
    if (this.loadedControls) return
    ([this.loadedControls, this.loadedSubjects] = await Promise.all([
      ctx.svc(AccessRoleService).getControlsByGrantId(this.id),
      ctx.svc(AccessRoleService).getSubjectsByGrantId(this.id)
    ]))
    await Promise.all(this.loadedControls.map(control => control.loadTags(ctx)))
  }
}

@ObjectType({ description: 'This is a control record on a specific grant on a specific role, whereas AccessControl represents the control as a global concept.' })
export class AccessGrantControl {
  constructor (row: AccessRoleGrantControlRow) {
    this.name = row.control
    this.description = subjectTypes[row.subjectType].controls[row.control].description
    this.grantId = row.grantId
    this.roleId = row.roleId
  }

  roleId: number
  grantId: number

  @Field()
  name: string

  @Field()
  description: string

  loadedTags!: AccessGrantControlTag[]
  async loadTags (ctx: any) {
    if (this.loadedTags) return
    this.loadedTags = await ctx.svc(AccessRoleService).getTagsByControlId(this.grantId, this.roleId)
  }
}

@ObjectType()
export class AccessGrantControlTag {
  constructor (row: AccessRoleGrantControlTagRow) {
    this.category = row.category || undefined
    this.tag = row.tag
    this.controlId = row.controlId
    this.subjectType = row.subjectType
    this.control = row.control
    this.controlId = row.controlId
    this.grantId = row.grantId
    this.roleId = row.roleId
  }

  controlId: number
  grantId: number
  roleId: number
  subjectType: string
  control: string

  @Field()
  tag: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  categoryLabel?: string
}

@InputType()
export class AccessTagInput {
  @Field({ description: 'The tag value, e.g. "TX".' })
  tag!: string

  @Field({ description: 'The category this tag belongs to, e.g. "State".' })
  category?: string
}

@InputType()
export class AccessControlInput {
  @Field({ description: 'The action this grant applies to, e.g. "view" or "update".' })
  control!: string

  @Field(type => [AccessTagInput], { description: 'A list of tags to help res' })
  tags?: AccessTagInput[]
}

@InputType()
export class AccessRoleGrantCreate {
  @Field()
  subjectType!: string

  @Field(type => [String], { nullable: true, description: 'A list of subject IDs to restrict the grant.' })
  subjects?: string[]

  @Field(type => [AccessControlInput])
  controls!: AccessControlInput[]

  @Field({ nullable: true })
  description?: string

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
