import { ValidatedResponse } from '@txstate-mws/graphql-server'
import { DateTime } from 'luxon'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { PeriodConfigurationRow, PeriodRow, PeriodWorkflowRow, Prompt, promptRegistry, Requirement, requirementRegistry } from '../internal.js'

@ObjectType()
export class Period {
  @Field(() => ID)
  id: string

  @Field({ nullable: true, description: 'Unique identifier for this period that references an external system. Ideally human readable.' })
  code?: string

  @Field({ description: 'Name for this period. Will be displayed to applicants if they create an App Request while two periods are simultaneously open.' })
  name: string

  @Field({ description: 'Date that this period opens for applications.' })
  openDate: DateTime

  @Field({ nullable: true, description: 'Date that this period closes for applications. Some periods do not set a close date.' })
  closeDate?: DateTime

  @Field({ nullable: true, description: 'This is useful for filtering out periods that are no longer useful. For instance, a window might close applications after 2 weeks but the reviewers could be working.' })
  archiveDate?: DateTime

  @Field({ description: 'Whether this period\'s configurations have been reviewed by an administrator. Newly created periods must be reviewed before they will accept new app requests, even if the open date has passed.' })
  reviewed: boolean

  internalId: number

  constructor (row: PeriodRow) {
    this.internalId = row.id
    this.id = String(row.id)
    this.code = row.code
    this.name = row.name
    this.openDate = DateTime.fromJSDate(row.openDate)
    this.closeDate = row.closeDate != null ? DateTime.fromJSDate(row.closeDate) : undefined
    this.archiveDate = row.archiveDate != null ? DateTime.fromJSDate(row.archiveDate) : undefined
    this.reviewed = !!row.reviewed
  }
}

@ObjectType()
export class PeriodActions {}

@InputType()
export class PeriodFilters {
  @Field({ nullable: true, description: 'true -> open periods. false -> closed periods. null -> all periods.' })
  openNow?: boolean

  @Field({ nullable: true, description: 'Return periods that open after this date, not including that date\'s active period(s).' })
  opensAfter?: DateTime

  @Field({ nullable: true, description: 'Return periods that are open at this date or have been open before it.' })
  opensBefore?: DateTime

  @Field({ nullable: true, description: 'Return periods that are open at this date or will be open after it.' })
  closesAfter?: DateTime

  @Field({ nullable: true, description: 'Return periods that closed before this date, not including that date\'s active period(s).' })
  closesBefore?: DateTime

  @Field({ nullable: true, description: 'Return periods that will be archived after this date.' })
  archiveAfter?: DateTime

  @Field({ nullable: true, description: 'Return periods that were archived before this date.' })
  archiveBefore?: DateTime

  @Field(() => [String], { nullable: true, description: 'Return periods that have any of these names.' })
  names?: string[]

  @Field(() => [String], { nullable: true, description: 'Return periods that have any of these codes.' })
  codes?: string[]

  @Field(() => [ID], { nullable: true, description: 'Return periods that have any of these IDs.' })
  ids?: string[]
}

@InputType()
export class PeriodUpdate {
  @Field({ nullable: true })
  code?: string

  @Field()
  name!: string

  @Field()
  openDate!: DateTime

  @Field({ nullable: true })
  closeDate?: DateTime

  @Field({ nullable: true })
  archiveDate?: DateTime

  @Field({ nullable: true })
  reviewed?: Boolean
}

@ObjectType()
export class ValidatedPeriodResponse extends ValidatedResponse {
  @Field(type => Period, { nullable: true })
  period?: Period
}

@ObjectType()
export class Configuration {
  @Field({ description: 'The key being configured. Could be a requirement or prompt key.' })
  key: string

  periodInternalId: number
  periodId: string
  configuredObject: Requirement | Prompt
  type: 'Requirement' | 'Prompt'

  constructor (row: PeriodConfigurationRow) {
    this.periodInternalId = row.periodId
    this.periodId = String(row.periodId)
    this.key = row.definitionKey
    let obj: any
    if (obj = requirementRegistry.get(row.definitionKey)) this.configuredObject = new Requirement(obj)
    else if (obj = promptRegistry.get(row.definitionKey)) this.configuredObject = new Prompt(obj)
    else throw new Error(`Configuration for key ${row.definitionKey} not found in registries.`)
    this.type = this.configuredObject instanceof Requirement
      ? 'Requirement'
      : 'Prompt'
  }
}

@InputType()
export class ConfigurationFilters {
  @Field(type => [ID], { nullable: true, description: 'Return specific configurations.' })
  ids?: { periodId: string, key: string }[]

  @Field(type => [ID], { nullable: true, description: 'Return configurations for these period IDs.' })
  periodIds?: string[]

  @Field(type => [String], { nullable: true, description: 'Return configurations for these period codes.' })
  periodCodes?: string[]

  @Field(type => [String], { nullable: true, description: 'Return configurations for these keys.' })
  keys?: string[]
}

@ObjectType()
export class ConfigurationAccess {}

@ObjectType()
export class ValidatedConfigurationResponse extends ValidatedResponse {
  @Field(type => Configuration, { nullable: true })
  configuration?: Configuration
}

@ObjectType()
export class PeriodWorkflowStage {
  constructor (row: PeriodWorkflowRow) {
    this.periodId = String(row.periodId)
    this.key = row.stageKey
    this.programKey = row.programKey
    this.title = row.title
    this.blocking = !!row.blocking
    this.evaluationOrder = row.evaluationOrder
  }

  periodId: string
  programKey: string
  key: string
  evaluationOrder?: number

  @Field({ description: 'A human readable title for the workflow stage.' })
  title: string

  @Field({ description: 'Whether this stage is blocking. If true, the application cannot be completed and shown to the applicant until all requirements in this stage are satisfied.' })
  blocking: boolean
}
