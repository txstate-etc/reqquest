import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { PeriodConfigurationRow, PeriodRow } from '../internal.js'
import { DateTime } from 'luxon'
import { ValidatedResponse } from '@txstate-mws/graphql-server'

@ObjectType()
export class Period {
  @Field(() => ID)
  id: string

  @Field({ nullable: true, description: 'Unique identifier for this period that references an external system. Ideally human readable.' })
  code?: string

  @Field({ description: 'Name for this period. Will be displayed to applicants if they create an App Request while two periods are simultaneously open.' })
  name: string

  @Field(type => DateTime, { description: 'Date that this period opens for applications.' })
  openDate: DateTime

  @Field(type => DateTime, { description: 'Date that this period closes for applications.' })
  closeDate: DateTime

  @Field(type => DateTime, { nullable: true, description: 'This is useful for filtering out periods that are no longer useful. For instance, a window might close applications after 2 weeks but the reviewers could be working.' })
  archiveAt?: DateTime

  internalId: number

  constructor (row: PeriodRow) {
    this.internalId = row.id
    this.id = String(row.id)
    this.code = row.code
    this.name = row.name
    this.openDate = DateTime.fromJSDate(row.openDate)
    this.closeDate = DateTime.fromJSDate(row.closeDate)
    this.archiveAt = row.archiveAt != null ? DateTime.fromJSDate(row.archiveAt) : undefined
  }
}

@ObjectType()
export class PeriodActions {}

@ObjectType()
export class PeriodFilters {
  @Field({ nullable: true, description: 'true -> open periods. false -> closed periods. null -> all periods.' })
  openNow?: boolean

  @Field({ nullable: true, description: 'Return periods that open after this date, not including that date\'s active period(s).' })
  opensAfter?: Date

  @Field({ nullable: true, description: 'Return periods that are open at this date or have been open before it.' })
  opensBefore?: Date

  @Field({ nullable: true, description: 'Return periods that are open at this date or will be open after it.' })
  closesAfter?: Date

  @Field({ nullable: true, description: 'Return periods that closed before this date, not including that date\'s active period(s).' })
  closesBefore?: Date

  @Field({ nullable: true, description: 'Return periods that will be archived after this date.' })
  archiveAfter?: Date

  @Field({ nullable: true, description: 'Return periods that were archived before this date.' })
  archiveBefore?: Date

  @Field(() => [String], { nullable: true, description: 'Return periods that have any of these codes.' })
  codes?: string[]

  @Field(() => [ID], { nullable: true, description: 'Return periods that have any of these IDs.' })
  ids?: string[]
}

@InputType()
export class PeriodUpdate {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  name?: string

  @Field(type => DateTime, { nullable: true })
  openDate?: DateTime

  @Field(type => DateTime, { nullable: true })
  closeDate?: DateTime

  @Field(type => DateTime, { nullable: true })
  archiveAt?: DateTime
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

  constructor (row: PeriodConfigurationRow) {
    this.periodInternalId = row.periodId
    this.periodId = String(row.periodId)
    this.key = row.definitionKey
  }
}

@ObjectType()
export class ConfigurationFilters {
  @Field(() => [ID], { nullable: true, description: 'Return specific configurations.' })
  ids?: { periodId: string, key: string }[]

  @Field(() => [ID], { nullable: true, description: 'Return configurations for these period IDs.' })
  periodIds?: string[]

  @Field(() => [String], { nullable: true, description: 'Return configurations for these period codes.' })
  periodCodes?: string[]

  @Field(() => [String], { nullable: true, description: 'Return configurations for these keys.' })
  keys?: string[]
}

@ObjectType()
export class ConfigurationAccess {}

@ObjectType()
export class ValidatedConfigurationResponse extends ValidatedResponse {
  @Field(type => Configuration, { nullable: true })
  configuration?: Configuration
}
