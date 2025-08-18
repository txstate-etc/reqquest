import { DateTime } from 'luxon'
import { Field, ID, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'
import { AppRequestActivityRow, AppRequestRow, AppRequestStatusDB, JsonData, PromptTagDefinition } from '../internal.js'
import { ValidatedResponse } from '@txstate-mws/graphql-server'

export enum AppRequestStatus {
  STARTED = 'STARTED',
  DISQUALIFIED = 'DISQUALIFIED',
  READY_TO_SUBMIT = 'READY_TO_SUBMIT',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL',
  ACCEPTANCE = 'ACCEPTANCE',
  NOT_APPROVED = 'NOT_APPROVED',
  APPROVED = 'APPROVED',
  READY_TO_ACCEPT = 'READY_TO_ACCEPT',
  ACCEPTED = 'ACCEPTED',
  NOT_ACCEPTED = 'NOT_ACCEPTED',
  WITHDRAWN = 'WITHDRAWN',
  CANCELLED = 'CANCELLED'
}
registerEnumType(AppRequestStatus, {
  name: 'AppRequestStatus',
  description: `
    The status of an appRequest. This status is computed based on the "dbStatus" recorded in
    the database and the status of each application.
  `,
  valuesConfig: {
    [AppRequestStatus.STARTED]: { description: 'Applicant has begun the process and has not yet submitted.' },
    [AppRequestStatus.DISQUALIFIED]: { description: 'Applicant has not yet submitted but ALL applications have been disqualified. Applicant may continue editing prompts until the App Request is closed.' },
    [AppRequestStatus.READY_TO_SUBMIT]: { description: 'Applicant has completed all prompts and is ready to submit. At least one application is eligible to proceed.' },
    [AppRequestStatus.PREAPPROVAL]: { description: 'Applicant has submitted and we are waiting for pre-approval requirements to resolve (these are automations like waiting for data to show up in an external system).' },
    [AppRequestStatus.APPROVAL]: { description: 'Applicant has submitted and any pre-approval requirements have been met. We are waiting for a reviewer to do their part.' },
    [AppRequestStatus.ACCEPTANCE]: { description: 'Reviewer has approved an offer and we are waiting for the applicant to accept. This status is unreachable if the period has no ACCEPTANCE requirements.' },
    [AppRequestStatus.APPROVED]: { description: 'Applicant has submitted, at least one application is in an approved state, and no applications are pending.' },
    [AppRequestStatus.NOT_APPROVED]: { description: 'Applicant has submitted, and ALL applications have been disqualified, no applications are pending.' },
    [AppRequestStatus.READY_TO_ACCEPT]: { description: 'Applicant has been offered, satisfied all acceptance requirements and is ready to accept. This status is unreachable if the period has no ACCEPTANCE requirements.' },
    [AppRequestStatus.ACCEPTED]: { description: 'Applicant has accepted an offer on at least one application and no applications are still pending acceptance.' },
    [AppRequestStatus.WITHDRAWN]: { description: 'Applicant withdrew the request after submitting. The request must be re-opened (if eligible) to be edited again.' },
    [AppRequestStatus.CANCELLED]: { description: 'Applicant cancelled the request before submitting. The applicant may be permitted to uncancel and continue, if the period is still open.' }
  }
})

@ObjectType({ description: 'Represents a group of applications all being applied for at the same time. As part of the request, multiple applications will be created and either eliminated as ineligible or submitted for approval.' })
export class AppRequest {
  constructor (row: AppRequestRow, tags?: Record<string, string[]>) {
    this.id = String(row.id)
    this.internalId = row.id
    this.dbStatus = row.status
    this.status = row.computedStatus
    this.createdAt = DateTime.fromJSDate(row.createdAt)
    this.updatedAt = DateTime.fromJSDate(row.updatedAt)
    this.closedAt = row.closedAt ? DateTime.fromJSDate(row.closedAt) : undefined
    this.userInternalId = row.userId
    this.periodId = String(row.periodId)
    this.periodClosesAt = row.periodClosesAt ? DateTime.fromJSDate(row.periodClosesAt) : undefined
    this.periodArchivesAt = row.periodArchivesAt ? DateTime.fromJSDate(row.periodArchivesAt) : undefined
    this.periodOpensAt = DateTime.fromJSDate(row.periodOpensAt)
    this.tags = tags ?? {}
    this.dataVersion = row.dataVersion
  }

  @Field(type => ID)
  id: string

  @Field(type => AppRequestStatus)
  status: AppRequestStatus

  @Field()
  createdAt: DateTime

  @Field()
  updatedAt: DateTime

  @Field({ nullable: true, description: 'Date that this request was considered closed and no longer editable. If active or re-opened, will be null. If closed again, will be the second closure date.' })
  closedAt?: DateTime

  @Field(type => Int, { description: 'The version of the data for this app request. This is incremented every time the data is updated. If you provide it with your update requests, the API will perform an optimistic concurrency check and fail the update if someone else has updated the data in the meantime.' })
  dataVersion: number

  periodClosesAt?: DateTime
  periodArchivesAt?: DateTime
  periodOpensAt: DateTime
  dbStatus: AppRequestStatusDB
  internalId: number
  userInternalId: number
  periodId: string
  tags?: Record<string, string[]>
}

export enum AppRequestIndexDestination {
  APPLICANT_DASHBOARD = 'APPLICANT_DASHBOARD',
  REVIEWER_DASHBOARD = 'REVIEWER_DASHBOARD',
  APP_REQUEST_LIST = 'APP_REQUEST_LIST',
  LIST_FILTERS = 'LIST_FILTERS'
}
registerEnumType(AppRequestIndexDestination, {
  name: 'AppRequestIndexDestination',
  description: 'This is used to indicate where the index values should be displayed.',
  valuesConfig: {
    [AppRequestIndexDestination.APPLICANT_DASHBOARD]: { description: 'Show these index values when listing App Requests on the applicant dashboard.' },
    [AppRequestIndexDestination.REVIEWER_DASHBOARD]: { description: 'Show these index values when listing App Requests on the reviewer dashboard.' },
    [AppRequestIndexDestination.APP_REQUEST_LIST]: { description: 'Show these index values when listing App Requests in the main list page.' },
    [AppRequestIndexDestination.LIST_FILTERS]: { description: 'Allow the user to filter on these index values on the main list page.' }
  }
})

@ObjectType()
export class IndexValue {
  constructor (tag: string, label: string | undefined) {
    this.value = tag
    this.label = label ?? tag
  }

  @Field()
  value: string

  @Field()
  label: string
}

@InputType()
export class AppRequestIndexFilter {
  @Field()
  category!: string

  @Field(type => [String])
  tags!: string[]
}

@ObjectType({ description: 'This represents an index as registered by one of the project\'s prompt definitions.' })
export class IndexCategory {
  constructor (def: PromptTagDefinition) {
    this.category = def.category
    this.categoryLabel = def.categoryLabel ?? def.category
    this.listable = !def.notListable
    this[AppRequestIndexDestination.APPLICANT_DASHBOARD] = def.useInApplicantDashboard ?? 0
    this[AppRequestIndexDestination.REVIEWER_DASHBOARD] = def.useInReviewerDashboard ?? 0
    this[AppRequestIndexDestination.APP_REQUEST_LIST] = def.useInAppRequestList ?? 0
    this[AppRequestIndexDestination.LIST_FILTERS] = def.useInListFilters ?? 0
    this.applicantDashboardPriority = this[AppRequestIndexDestination.APPLICANT_DASHBOARD]
    this.reviewerDashboardPriority = this[AppRequestIndexDestination.REVIEWER_DASHBOARD]
    this.appRequestListPriority = this[AppRequestIndexDestination.APP_REQUEST_LIST]
    this.listFiltersPriority = this[AppRequestIndexDestination.LIST_FILTERS]
  }

  @Field()
  category: string

  @Field()
  categoryLabel: string

  @Field()
  listable: boolean

  @Field({ nullable: true, description: 'If this is > 0, the index values should be shown on the applicant dashboard, sorted by this priority in descending order.' })
  applicantDashboardPriority?: number

  @Field({ nullable: true, description: 'If this is > 0, the index values should be shown on the reviewer dashboard, sorted by this priority in descending order.' })
  reviewerDashboardPriority?: number

  @Field({ nullable: true, description: 'If this is > 0, the index values should be shown on the main app request list page, sorted by this priority in descending order.' })
  appRequestListPriority?: number

  @Field({ nullable: true, description: 'If this is > 0, the index values should be shown on the list filters, sorted by this priority in descending order.' })
  listFiltersPriority?: number

  [AppRequestIndexDestination.APPLICANT_DASHBOARD]: number
  [AppRequestIndexDestination.REVIEWER_DASHBOARD]: number
  [AppRequestIndexDestination.APP_REQUEST_LIST]: number
  [AppRequestIndexDestination.LIST_FILTERS]: number
}

@ObjectType({ description: 'This represents an index category attached to an app request. Its tagStrings property contains the tag values that have been extracted from the app request data.' })
export class AppRequestIndexCategory extends IndexCategory {
  constructor (def: PromptTagDefinition, public tagStrings: string[]) {
    super(def)
  }
}

@ObjectType()
export class AppRequestActions {}

@InputType()
export class AppRequestFilter {
  @Field(type => [ID], { nullable: true })
  ids?: string[]

  @Field(type => [AppRequestStatus], { nullable: true })
  status?: AppRequestStatus[]

  @Field(type => [ID], { nullable: true })
  periodIds?: string[]

  @Field(type => [ID], { nullable: true, description: 'Only return appRequests that are owned by one the given logins.' })
  logins?: string[]

  @Field({ nullable: true, description: 'Only return appRequests that are owned by the current user.' })
  own?: boolean

  @Field({ nullable: true, description: 'true -> only return appRequests that are closed. false -> only return appRequests that are open. null -> return all appRequests.' })
  closed?: boolean

  @Field(type => [AppRequestIndexFilter], { nullable: true, description: 'Only return appRequests that match one of the given indexes.' })
  indexes?: AppRequestIndexFilter[]

  @Field(type => String, { nullable: true, description: 'Search for appRequests that match this search term. This will do a prefix search across all fields that are indexed.' })
  search?: string

  @Field(type => DateTime, { nullable: true, description: 'Only return appRequests that were created after this date.' })
  createdAfter?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'Only return appRequests that were created before this date.' })
  createdBefore?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'Only return appRequests that were updated after this date.' })
  updatedAfter?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'Only return appRequests that were updated before this date.' })
  updatedBefore?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'Only return appRequests that were submitted after this date. App Requests that have not been submitted will be filtered out.' })
  submittedAfter?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'Only return appRequests that were submitted before this date. App Requests that have not been submitted will be filtered out.' })
  submittedBefore?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'Only return appRequests that were closed after this date. Open appRequests will be filtered out.' })
  closedAfter?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'Only return appRequests that were closed before this date. Open appRequests will be filtered out.' })
  closedBefore?: DateTime

  internalIds?: number[]
  userInternalIds?: number[]
}

@ObjectType()
export class ValidatedAppRequestResponse extends ValidatedResponse {
  @Field(type => AppRequest, { nullable: true })
  appRequest?: AppRequest
}

@ObjectType()
export class AppRequestActivity {
  constructor (row: AppRequestActivityRow) {
    this.id = String(row.id)
    this.appRequestId = String(row.appRequestId)
    this.appRequestInternalId = row.appRequestId
    this.userInternalId = row.userId
    this.impersonatedBy = row.impersonatedBy
    this.action = row.action
    this.description = row.description
    this.data = row.data ? JSON.parse(row.data) : undefined
    this.createdAt = DateTime.fromJSDate(row.createdAt)
  }

  appRequestId!: string
  appRequestInternalId!: number
  userInternalId!: number
  impersonatedBy?: number

  @Field(type => ID)
  id: string

  @Field()
  action!: string

  @Field({ nullable: true, description: 'A detailed description of the activity. This is not meant to be filtered and could contain specific details about the action.' })
  description?: string

  @Field(type => JsonData, { nullable: true, description: 'A JSON object containing additional data about the activity. This could be filtered but different actions would place different data here so it is not strongly typed.' })
  data?: any

  @Field(type => DateTime, { description: 'The date and time when the action occurred.' })
  createdAt!: DateTime
}

@InputType({ description: 'This is used to filter a list of activities.' })
export class AppRequestActivityFilters {
  appRequestInternalIds?: number[]

  @Field(type => [ID], { nullable: true })
  appRequestIds?: string[]

  @Field(type => [ID], { nullable: true, description: 'Return activities that were performed by one of the given logins. Also returns activities that were performed while one of the given logins was impersonating someone else.' })
  users?: string[]

  @Field({ nullable: true, description: 'true -> Return activities that were performed while a user was impersonating another user. false -> Return activities that were not impersonated.' })
  impersonated?: boolean

  @Field(type => [ID], { nullable: true, description: 'Return activities that were performed while one of the given logins was being impersonated by someone else.' })
  impersonatedUsers?: string[]

  @Field(type => [ID], { nullable: true, description: 'Return activities that were performed while one of the given logins was impersonating another user.' })
  impersonatedBy?: string[]

  @Field(type => [String], { nullable: true, description: 'Filter activities by action. This is a list of action names that should be matched. There are many potential action names, they are untyped.' })
  actions?: string[]

  @Field(type => DateTime, { nullable: true, description: 'Return activities that happened after this date.' })
  happenedAfter?: DateTime

  @Field(type => DateTime, { nullable: true, description: 'Return activities that happened before this date.' })
  happenedBefore?: DateTime
}
