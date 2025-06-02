import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { ApplicationRequirementRow, PeriodConfigurationRow, PeriodProgramKey, PeriodProgramRequirementRow, RequirementDefinitionProcessed, requirementRegistry } from '../internal.js'

@ObjectType({ description: 'A requirement for a program. Each program has an ordered array of requirements, all of which must pass for an application to the program to succeed.' })
export class Requirement {
  definition: RequirementDefinitionProcessed
  constructor (definition: RequirementDefinitionProcessed) {
    this.definition = definition
    this.key = definition.key
    this.title = definition.title
    this.navTitle = definition.navTitle ?? definition.title
    this.description = definition.description
    this.type = definition.type
    this.authorizationKeys = { requirement: requirementRegistry.authorizationKeys[definition.key] ?? [] }
  }

  @Field({ description: 'A human and machine readable unique and stable identifier that we can use to add javascript logic to the evaluation of whether a requirement is satisfied. For example: "gi_ch33_must_be_post911"' })
  key: string

  @Field({ description: 'An internal description of the requirement. Probably not shown to users.' })
  description: string

  @Field({ description: 'A human readable title for the requirement. This is what will be shown to users.' })
  title: string

  @Field({ description: 'A human readable title for the requirement in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used.' })
  navTitle: string

  @Field(type => RequirementType, { description: 'The type of requirement. This determines when the requirement is evaluated and who can see the requirement.' })
  type: RequirementType

  authorizationKeys: Record<string, string[]>
}

export enum RequirementType {
  PREQUAL = 'PREQUAL',
  QUALIFICATION = 'QUALIFICATION',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL',
  ACCEPTANCE = 'ACCEPTANCE'
}
registerEnumType(RequirementType, {
  name: 'RequirementType',
  valuesConfig: {
    QUALIFICATION: { description: 'A requirement that should have a non-pending status before an application may be submitted for review. Programs with a DISQUALIFYING requirement of type APPLICATION should be visible to the submitter but visually distinct as disabled/ineligible.' },
    PREQUAL: { description: 'A requirement that should have a non-PENDING status before the user is shown their programs. Only the applications for programs whose PREQUAL requirements are MET or NOT_APPLICABLE should be visible. The others should be entirely hidden, rather than being shown in a disabled/ineligible state.' },
    PREAPPROVAL: { description: 'A requirement that has no prompts and must have a non-PENDING status before an application may be reviewed. Use this for materials/data that must appear in an external system before a reviewer will be able to begin their work.' },
    APPROVAL: { description: 'A requirement that should only be shown to agents/reviewers and must have a non-pending status before an application is closed.' },
    ACCEPTANCE: { description: 'A requirement that should only be shown to applicants after the application has been through review and an offer has been made. The applicant can come back and fill out the requirement\'s prompts to accept the offer.' }
  }
})
export enum RequirementStatus {
  MET = 'MET',
  DISQUALIFYING = 'DISQUALIFYING',
  WARNING = 'WARNING',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PENDING = 'PENDING'
}
registerEnumType(RequirementStatus, {
  name: 'RequirementStatus',
  valuesConfig: {
    MET: { description: 'The requirement has been met.' },
    DISQUALIFYING: { description: 'The requirement has not been met, and it means the application is denied/ineligible.' },
    WARNING: { description: 'The requirement has not been met, but the application may still be approved. The requirement should be marked in some way as not quite satisfactory. The statusReason may explain further what is wrong.' },
    NOT_APPLICABLE: { description: 'The requirement is not applicable. The application should not yet be denied, proceed to the next requirement.' },
    PENDING: { description: 'The requirement cannot be evaluated yet because one or more questions are unanswered.' }
  }
})

@ObjectType({ description: 'The specific instance of a requirement on a particular application. Stores the status of the requirement, e.g. being satisfied or not.' })
export class ApplicationRequirement extends Requirement {
  internalId: number
  appRequestInternalId: number
  appRequestId: string
  applicationInternalId: number
  applicationId: string
  periodId: string
  appRequestTags?: Record<string, string[]>

  constructor (row: ApplicationRequirementRow) {
    const definition = requirementRegistry.get(row.requirementKey)
    super(definition)
    this.internalId = row.id
    this.id = String(row.id)
    this.definition = definition
    this.applicationInternalId = row.applicationId
    this.applicationId = String(row.applicationId)
    this.appRequestInternalId = row.appRequestId
    this.appRequestId = String(row.appRequestId)
    this.periodId = String(row.periodId)
    this.status = row.status
    this.statusReason = row.statusReason
    this.reachable = !!row.reachable
  }

  @Field(type => ID)
  id: string

  @Field(type => RequirementStatus, { description: 'The status of the requirement. This is what will be shown to users.' })
  status: RequirementStatus

  @Field({ nullable: true, description: 'The reason why the requirement is in the status it is in. This will be shown to the applicant.' })
  statusReason?: string

  @Field({ description: 'When true, means that the requirement has not been made moot by an earlier requirement failing. It may still need to be hidden from navigation based on evaluatedInEarlierApplication.' })
  reachable: boolean
}

@InputType()
export class ApplicationRequirementFilter {
  @Field(type => [ID], { nullable: true })
  ids?: string[]

  @Field(type => [ID], { nullable: true })
  applicationIds?: string[]

  @Field(type => [ID], { nullable: true })
  requirementKeys?: string[]

  @Field(type => [ID], { nullable: true })
  appRequestIds?: string[]
}

@ObjectType()
export class PeriodProgramRequirement extends Requirement {
  constructor (row: PeriodProgramRequirementRow) {
    super(requirementRegistry.get(row.requirementKey))
    this.periodId = String(row.periodId)
    this.programKey = row.programKey
    this.enabled = !row.disabled
  }

  @Field({ description: 'Whether the requirement is enabled in this period. This is set by the system administrator.' })
  enabled: boolean

  periodId: string
  programKey: string
}

@ObjectType()
export class PeriodRequirementAccess {}

@ObjectType()
export class PeriodProgramRequirementAccess {}

@InputType()
export class PeriodProgramRequirementKey extends PeriodProgramKey {
  @Field()
  requirementKey!: string
}

@InputType()
export class PeriodRequirementKey {
  @Field()
  periodId!: string

  @Field()
  requirementKey!: string
}

@InputType()
export class PeriodProgramRequirementFilters {
  @Field(type => [PeriodProgramRequirementKey], { nullable: true, description: 'Return individual PeriodProgramRequirement records.' })
  keys?: PeriodProgramRequirementKey[]

  @Field(type => [PeriodProgramKey], { nullable: true, description: 'Return requirements for these PeriodProgram keys.' })
  periodPrograms?: PeriodProgramKey[]

  @Field(type => [ID], { nullable: true, description: 'Return requirements for these period IDs.' })
  periodIds?: string[]

  @Field(type => [ID], { nullable: true, description: 'Return requirements for these program keys.' })
  programKeys?: string[]

  @Field(type => [String], { nullable: true, description: 'Return requirements for these requirement keys.' })
  requirementKeys?: string[]

  @Field(type => [PeriodRequirementKey], { nullable: true, description: 'Return PeriodProgramRequirements by periodId and requirementKey.' })
  periodRequirementKeys?: PeriodRequirementKey[]
}
