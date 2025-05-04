import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { AccessRole, AppRequest, PromptDefinition, promptRegistry, PromptRow } from '../internal.js'
import { ValidatedResponse } from '@txstate-mws/graphql-server'

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
    this.applicationInternalId = row.applicationId
    this.applicationId = String(row.applicationId)
    this.appRequestInternalId = row.appRequestId
    this.appRequestId = String(row.appRequestId)
    this.periodId = String(row.periodId)
    this.userInternalId = row.userId
    this.answered = !!row.answered
    this.invalidated = !!row.invalidated
    this.reachable = !!row.reachable
    this.askedInEarlierApplication = !!row.askedInEarlierApplication
    this.askedInEarlierRequirement = !!row.askedInEarlierRequirement
    this.askedEarlier = this.askedInEarlierApplication || this.askedInEarlierRequirement
    this.hiddenInNavigation = !this.reachable || this.askedEarlier
  }

  @Field(type => ID)
  id: string

  @Field({ description: 'Whether the prompt has been answered on this request.' })
  answered: boolean

  @Field({ description: 'When true, this prompt has been invalidated by the answer to another prompt. The `answered` field should remain false until the user specifically answers this prompt again, regardless of the output of the definition\'s `complete` method.' })
  invalidated: boolean

  @Field({ description: 'When true, means that the prompt has not been made moot by an earlier requirement failing. It may still need to be hidden from navigation based on askedInEarlierRequirement or askedInEarlierApplication.' })
  reachable: boolean

  @Field({ description: 'When true, means that this prompt should be hidden from navigation due to being asked in an earlier requirement in the same application. If a screen were reviewing the details of a single requirement, this prompt\'s information might re-appear in that context.' })
  askedInEarlierRequirement: boolean

  @Field({ description: 'When true, means that this prompt should be hidden from navigation due to being asked in an earlier application. If a screen were reviewing the details of a single application, this prompt\'s information might re-appear in that context.' })
  askedInEarlierApplication: boolean

  @Field({ description: 'For convenience, this is true if either askedInEarlierRequirement or askedInEarlierApplication is true.' })
  askedEarlier: boolean

  @Field({ description: 'For convenience, this is true if the prompt is not reachable or has been asked earlier.' })
  hiddenInNavigation: boolean

  internalId: number
  appRequestInternalId: number
  appRequestId: string
  userInternalId: number
  applicationInternalId: number
  applicationId: string
  requirementInternalId: number
  requirementId: string
  periodId: string
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
export class ValidatedAppRequestResponse extends ValidatedResponse {
  @Field(type => AppRequest)
  appRequest!: AppRequest
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
