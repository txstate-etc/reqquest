import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { ApplicationPhase, AppRequestPhase, AppRequestStatusDB, PromptDefinition, promptRegistry, PromptRow, RequirementType } from '../internal.js'

export enum PromptVisibility {
  UNREACHABLE = 'UNREACHABLE',
  APPLICATION_DUPE = 'APPLICATION_DUPE',
  REQUEST_DUPE = 'REQUEST_DUPE',
  AVAILABLE = 'AVAILABLE'
}
registerEnumType(PromptVisibility, {
  name: 'PromptVisibility',
  description: 'The visibility of a prompt on a request. This is used to determine whether the prompt should be shown to the user in the UI.',
  valuesConfig: {
    UNREACHABLE: { description: 'This RequirementPrompt cannot be reached, there is a requirement or prompt in front of it that could or already has disqualified the application.' },
    APPLICATION_DUPE: { description: 'This RequirementPrompt is a duplicate of a RequirementPrompt that already appears earlier in the same application (it could also be duplicated yet again in an earlier application). It should not be shown to applicants. The reviewer UI may or may not want to show these repeated dependencies.' },
    REQUEST_DUPE: { description: 'This RequirementPrompt is a duplicate of a RequirementPrompt that already appears earlier in the same app request, but it is the first appearance in its application. It should not be shown to applicants. The reviewer UI may or may not want to show these repeated dependencies.' },
    AVAILABLE: { description: 'This RequirementPrompt is available to be answered. It is the first appearance of this prompt in the App Request. It should be visible in both the applicant and reviewer UI.' }
  }
})

@ObjectType({ description: 'This is the generic definition of a prompt. It is not attached to an appRequest. We will use this type for the administration interface to allow administrators to grant access to prompts and edit their configuration.' })
export class Prompt {
  constructor (public definition: PromptDefinition) {
    this.key = definition.key
    this.title = definition.title
    this.navTitle = definition.navTitle ?? definition.title
    this.authorizationKeys = { prompt: promptRegistry.authorizationKeys[definition.key] ?? [] }
  }

  @Field({ description: 'A human and machine readable identifier for the prompt. Will be used to match prompt data with UI and API code that handles it.' })
  key: string

  @Field({ description: 'A human readable title for the prompt. This is what will be shown to users.' })
  title: string

  @Field({ description: 'A human readable title for the prompt in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used.' })
  navTitle: string

  @Field({ nullable: true, description: 'A brief description of the prompt. This should be shown to administrators to help explain the full meaning of the prompt while assigning permissions or editing its configuration.' })
  description?: string

  authorizationKeys?: Record<string, string[]>
}

@ObjectType({ description: 'A RequestPrompt is an instance of a Prompt on a particular request. Once the user has answered the prompt, it contains the answer and the prompt status on that request.' })
export class RequirementPrompt extends Prompt {
  constructor (row: PromptRow) {
    super(promptRegistry.get(row.promptKey))
    this.internalId = row.id
    this.id = String(row.id)
    this.requirementInternalId = row.requirementId
    this.requirementId = String(row.requirementId)
    this.requirementKey = row.requirementKey
    this.requirementType = row.requirementType
    this.promptKey = row.promptKey
    this.programKey = row.programKey
    this.applicationInternalId = row.applicationId
    this.applicationId = String(row.applicationId)
    this.appRequestInternalId = row.appRequestId
    this.appRequestId = String(row.appRequestId)
    this.appRequestDbStatus = row.appRequestDbStatus
    this.appRequestDbPhase = row.appRequestDbPhase
    this.periodId = String(row.periodId)
    this.userInternalId = row.userId
    this.answered = !!row.answered
    this.invalidated = !!row.invalidated
    this.invalidatedReason = row.invalidatedReason ?? undefined
    this.visibility = row.visibility
    this.moot = !!row.moot
    this.locked = !!row.locked
    this.workflowStage = row.workflowStage ?? undefined
    this.applicationWorkflowStage = row.applicationWorkflowStage ?? undefined
    this.applicationPhase = row.applicationPhase
  }

  static clone (prompt: RequirementPrompt) {
    return new RequirementPrompt({
      id: prompt.internalId,
      appRequestDbPhase: prompt.appRequestDbPhase,
      appRequestDbStatus: prompt.appRequestDbStatus,
      requirementKey: prompt.requirementKey,
      requirementType: prompt.requirementType,
      promptKey: prompt.promptKey,
      requirementId: prompt.requirementInternalId,
      appRequestId: prompt.appRequestInternalId,
      applicationId: prompt.applicationInternalId,
      periodId: Number(prompt.periodId),
      userId: prompt.userInternalId,
      programKey: prompt.programKey,
      answered: prompt.answered ? 1 : 0,
      moot: prompt.moot ? 1 : 0,
      locked: prompt.locked ? 1 : 0,
      invalidated: prompt.invalidated ? 1 : 0,
      invalidatedReason: prompt.invalidatedReason ?? null,
      visibility: prompt.visibility,
      applicationPhase: prompt.applicationPhase,
      workflowStage: prompt.workflowStage
    })
  }

  @Field(type => ID)
  id: string

  @Field({ description: 'Whether the prompt has been answered on this request. Note that the answer may be marked invalidated, which means that even though it has been answered, the current answer can\'t be used and the user needs to answer it again.' })
  answered: boolean

  @Field({ description: 'When true, this prompt has been invalidated by the answer to another prompt. The `answered` field will remain true so be sure to check this field as well when determining whether the prompt is complete.' })
  invalidated: boolean

  @Field({ nullable: true, description: 'If the prompt has been invalidated, this may contain a reason why. It should be displayed to the user.' })
  invalidatedReason?: string

  @Field(type => PromptVisibility, { description: 'The visibility of the prompt on the request. This is used to determine whether the prompt should be shown to the user in the UI.' })
  visibility: PromptVisibility

  @Field({ description: 'This prompt\'s requirement follows a requirement that has already marked the application as ineligible. The prompt still has visibility of AVAILABLE OR REQUEST_DUPE OR APPLICATION_DUPE as normal, but should probably be shown to the user as disabled or not shown at all.' })
  moot: boolean

  internalId: number
  appRequestInternalId: number
  appRequestId: string
  appRequestTags?: Record<string, string[]>
  userInternalId: number
  applicationInternalId: number
  applicationId: string
  requirementInternalId: number
  requirementId: string
  requirementKey: string
  requirementType: RequirementType
  promptKey: string
  programKey: string
  periodId: string
  appRequestDbStatus: AppRequestStatusDB
  appRequestDbPhase: AppRequestPhase
  workflowStage?: string
  applicationWorkflowStage?: string
  applicationPhase: ApplicationPhase
  locked: boolean
}

@ObjectType()
export class RequirementPromptActions {}

@InputType()
export class RequirementPromptFilter {
  @Field(type => [ID], { nullable: true })
  ids?: string[]

  @Field(type => [ID], { nullable: true })
  appRequestIds?: string[]

  @Field(type => [ID], { nullable: true })
  applicationIds?: string[]

  @Field(type => [ID], { nullable: true })
  requirementIds?: string[]

  @Field(type => [String], { nullable: true })
  promptKeys?: string[]

  @Field({ nullable: true, description: 'When true only returns reachable prompts.' })
  reachable?: boolean

  @Field({ nullable: true, description: 'When true only returns answered prompts.' })
  answered?: boolean
}

@ObjectType()
export class PeriodPrompt extends Prompt {
  constructor (periodId: string, key: string) {
    super(promptRegistry.get(key))
    this.periodId = periodId
  }

  @Field()
  periodId: string
}

@InputType()
export class PeriodPromptKey {
  @Field()
  periodId!: string

  @Field()
  promptKey!: string
}

@InputType()
export class PeriodPromptFilters {
  @Field(type => [ID], { nullable: true, description: 'Return PeriodPrompts for these period IDs.' })
  periodIds?: string[]

  @Field(type => [String], { nullable: true, description: 'Return PeriodPrompts for these keys.' })
  promptKeys?: string[]

  @Field(type => [PeriodPromptKey], { nullable: true, description: 'Return PeriodPrompts by periodId and promptKey.' })
  periodPromptKeys?: PeriodPromptKey[]
}

@ObjectType()
export class PeriodPromptActions {}
