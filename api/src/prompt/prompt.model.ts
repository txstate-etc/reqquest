import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { AppRequestStatusDB, PromptDefinition, promptRegistry, PromptRow } from '../internal.js'

export enum PromptVisibility {
  UNREACHABLE = 'UNREACHABLE',
  AUTOMATION = 'AUTOMATION',
  APPLICATION_DUPE = 'APPLICATION_DUPE',
  REQUEST_DUPE = 'REQUEST_DUPE',
  AVAILABLE = 'AVAILABLE'
}
registerEnumType(PromptVisibility, {
  name: 'PromptVisibility',
  description: 'The visibility of a prompt on a request. This is used to determine whether the prompt should be shown to the user in the UI.',
  valuesConfig: {
    UNREACHABLE: { description: 'This RequirementPrompt cannot be reached, there is a requirement or prompt in front of it that could or already has disqualified the application.' },
    AUTOMATION: { description: 'The prompt is intended to be filled in by an automation, but is otherwise available to be answered. It may or may not be visible in various UIs but it is not editable in any of them.' },
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
  }

  @Field({ description: 'A human and machine readable identifier for the prompt. Will be used to match prompt data with UI and API code that handles it.' })
  key: string

  @Field({ description: 'A human readable title for the prompt. This is what will be shown to users.' })
  title: string

  @Field({ description: 'A human readable title for the prompt in the navigation. You probably want it to be shorter than the full title. If not provided, the title will be used.' })
  navTitle: string

  @Field({ nullable: true, description: 'A brief description of the prompt. This should be shown to administrators to help explain the full meaning of the prompt while assigning permissions or editing its configuration.' })
  description?: string
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
    this.programKey = row.programKey
    this.applicationInternalId = row.applicationId
    this.applicationId = String(row.applicationId)
    this.appRequestInternalId = row.appRequestId
    this.appRequestId = String(row.appRequestId)
    this.appRequestDbStatus = row.appRequestDbStatus
    this.periodId = String(row.periodId)
    this.userInternalId = row.userId
    this.answered = !!row.answered
    this.invalidated = !!row.invalidated
    this.visibility = row.visibility
  }

  @Field(type => ID)
  id: string

  @Field({ description: 'Whether the prompt has been answered on this request.' })
  answered: boolean

  @Field({ description: 'When true, this prompt has been invalidated by the answer to another prompt. The `answered` field should remain false until the user specifically answers this prompt again, regardless of the output of the definition\'s `complete` method.' })
  invalidated: boolean

  @Field(type => PromptVisibility, { description: 'The visibility of the prompt on the request. This is used to determine whether the prompt should be shown to the user in the UI.' })
  visibility: PromptVisibility

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
  programKey: string
  periodId: string
  appRequestDbStatus: AppRequestStatusDB
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

  @Field({ nullable: true, description: 'When true, only returns reachable prompts.' })
  reachable?: boolean
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
