import { DateTime } from 'luxon'
import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { AppRequestRow, AppRequestStatusDB, PromptTagDefinition } from '../internal.js'
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

  internalIds?: number[]
  userInternalIds?: number[]
}

@ObjectType()
export class ValidatedAppRequestResponse extends ValidatedResponse {
  @Field(type => AppRequest)
  appRequest!: AppRequest
}
