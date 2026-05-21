import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { DateTimeScalar, Period } from '../internal.js'

@ObjectType({ description: 'This is the generic definition of a prompt. It is not attached to an appRequest. We will use this type for the administration interface to allow administrators to grant access to prompts and edit their configuration.' })
export class ApplicationMetric {
  constructor (row: any) {
    this.internalApplicationId = row.applicationInternalId
    this.applicationId = String(row.applicationId)
    this.createdAt = row.createdAt
    this.submittedAt = row.submittedAt
    this.closedAt = row.closedAt
    this.archivedAt = row.archivedAt
    this.updatedAt = row.updatedAt
    this.computedStatus = row.computedStatus
    this.computedPhase = row.computedPhase
    this.computedIneligiblePhase = row.computedIneligiblePhase
    this.periodId = row.periodId
    this.periodName = row.periodName
    this.periodCode = row.periodCode
    this.applicantId = row.applicantId
    this.applicantLogin = row.applicantLogin
    this.applicantFullname = row.applicantFullname
    this.reviewerId = row.reviewerId
    this.reviewerLogin = row.reviewerLogin
    this.reviewerFullname = row.reviewerFullname
  }

  internalApplicationId: number

  @Field(type => ID, { description: 'Application ID' })
  applicationId: string

  @Field(type => DateTimeScalar, { description: 'The date and time when the application was created.' })
  createdAt: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { description: 'The date and time when the application was submitted.' })
  submittedAt: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { description: 'The date and time when the application was closed.' })
  closedAt: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { description: 'The date and time when the application was archived.' })
  archivedAt: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { description: 'The date and time when the application was last updated.' })
  updatedAt: typeof DateTimeScalar

  @Field(type => String, { description: 'The current status of the application' })
  computedStatus: string

  @Field(type => String, { description: 'The current phase of the application' })
  computedPhase: string

  @Field(type => String, { nullable: true, description: 'The phase in which the application became ineligible' })
  computedIneligiblePhase?: string

  @Field(type => String, { description: 'The name of the period in which the application was created' })
  periodName: string

  @Field(type => ID, { description: 'The ID of the period in which the application was created' })
  periodId: string

  @Field(type => String, { description: 'The code of the period in which the application was created' })
  periodCode: string

  @Field(type => ID, { description: 'The ID of the applicant who created the application' })
  applicantId: string

  @Field(type => String, { description: 'The login ID of the applicant who created the application' })
  applicantLogin: string

  @Field(type => String, { description: 'The full name of the applicant who created the application' })
  applicantFullname: string

  @Field(type => ID, { nullable: true, description: 'The ID of the reviewer who reviewed the application' })
  reviewerId?: string

  @Field(type => String, { description: 'The login ID of the reviewer who reviewed the application' })
  reviewerLogin: string

  @Field(type => String, { description: 'The full name of the reviewer who reviewed the application' })
  reviewerFullname: string
}

@InputType()
export class MetricApplicationFilters {
  @Field(() => [ID], { nullable: true, description: 'Return application metrics for applications that have any of these IDs.' })
  applicationIds?: string[]

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that started after this date.' })
  startAfterDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that started before this date.' })
  startBeforeDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were submitted after this date.' })
  submittedAfterDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were submitted before this date.' })
  submittedBeforeDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were closed after this date.' })
  closedAfterDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were closed before this date.' })
  closedBeforeDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were archived after this date.' })
  archivedAfterDateTime?: typeof DateTimeScalar

  @Field(type => DateTimeScalar, { nullable: true, description: 'Return application metrics for applications that were archived before this date.' })
  archivedBeforeDateTime?: typeof DateTimeScalar

  @Field(type => MetricPeriodFilters, { nullable: true, description: 'Return application metrics from periods that match any of these filters.' })
  periods?: MetricPeriodFilters

  @Field(type => MetricAccessUserFilters, { nullable: true, description: 'Return application metrics from applicants that match any of these filters.' })
  applicants?: MetricAccessUserFilters

  @Field(type => MetricAccessUserFilters, { nullable: true, description: 'Return application metrics from reviewers that match any of these filters.' })
  reviewers?: MetricAccessUserFilters
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
