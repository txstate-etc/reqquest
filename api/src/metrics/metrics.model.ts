import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { DateTimeScalar, Period } from '../internal.js'
import { DateTime } from 'luxon'

@ObjectType({ description: 'Individual application metric entry' })
export class ApplicationMetricEntry {
  constructor (row: any) {
    this.internalApplicationId = row.applicationId
    this.applicationId = String(row.applicationId)
    this.createdAt = DateTime.fromJSDate(row.createdAt)
    this.updatedAt = DateTime.fromJSDate(row.updatedAt)
    this.submittedAt = row.submittedAt != null ? DateTime.fromJSDate(row.submittedAt) : undefined
    this.closedAt = row.closedAt != null ? DateTime.fromJSDate(row.closedAt) : undefined
    this.status = row.computedStatus
    this.phase = row.computedPhase
    this.ineligiblePhase = row.computedIneligiblePhase
    this.programKey = row.programKey
    this.periodId = row.periodId
    this.periodName = row.periodName
    this.periodCode = row.periodCode
    this.applicantId = row.applicantId
    this.applicantLogin = row.applicantLogin
    this.applicantFullname = row.applicantFullname
  }

  internalApplicationId: number
  @Field(type => ID)
  applicationId: string

  @Field()
  createdAt: DateTime

  @Field()
  updatedAt: DateTime

  @Field({ nullable: true })
  submittedAt?: DateTime

  @Field({ nullable: true })
  closedAt?: DateTime

  @Field(type => String)
  status: string

  @Field(type => String)
  phase: string

  @Field(type => String, { nullable: true })
  ineligiblePhase?: string

  @Field(type => String)
  programKey: string

  @Field(type => ID)
  periodId: string

  @Field(type => String)
  periodName: string

  @Field(type => String)
  periodCode: string

  @Field(type => ID)
  applicantId: string

  @Field(type => String)
  applicantLogin: string

  @Field(type => String)
  applicantFullname: string
}

@ObjectType({ description: 'Calculated application metrics' })
export class ApplicationMetric {
  @Field(type => [ApplicationMetricEntry])
  entries?: ApplicationMetricEntry[]

  @Field(type => Number)
  started?: number

  @Field(type => Number)
  submitted?: number

  @Field(type => Number)
  closed?: number

  @Field(type => Number)
  approved?: number

  @Field(type => Number)
  denied?: number
}

@InputType()
export class MetricPeriodFilters {
  @Field(() => [ID], { nullable: true, description: 'Return application metrics from periods that have any of these IDs.' })
  ids?: string[]

  @Field(() => [String], { nullable: true, description: 'Return rapplication metrics from periods that have any of these names.' })
  names?: string[]

  @Field(() => [String], { nullable: true, description: 'Return application metrics from periods that have any of these codes.' })
  codes?: string[]
}

@InputType()
export class MetricAccessUserFilters {
  @Field(() => [ID], { nullable: true, description: 'Return application metrics from users that have any of these IDs.' })
  ids?: string[]

  @Field(type => [String], { nullable: true, description: 'Return application metrics from users that have any of these logins.' })
  logins?: string[]

  @Field(type => [String], { nullable: true, description: 'Return application metrics from users that have any of these fullnames.' })
  fullnames?: string[]
}

@InputType()
export class MetricApplicationFilters {
  @Field(() => [ID], { nullable: true, description: 'Return application metrics for applications that have any of these IDs.' })
  applicationIds?: string[]

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that started after this date.' })
  startedAfterDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that started before this date.' })
  startedBeforeDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were submitted after this date.' })
  submittedAfterDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were submitted before this date.' })
  submittedBeforeDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were closed after this date.' })
  closedAfterDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were closed before this date.' })
  closedBeforeDateTime?: typeof DateTimeScalar

  @Field(type => MetricPeriodFilters, { nullable: true, description: 'Return application metrics from periods that match any of these filters.' })
  periods?: MetricPeriodFilters

  @Field(type => MetricAccessUserFilters, { nullable: true, description: 'Return application metrics from applicants that match any of these filters.' })
  applicants?: MetricAccessUserFilters
}
