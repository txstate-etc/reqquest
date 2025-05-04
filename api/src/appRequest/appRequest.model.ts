import { DateTime } from 'luxon'
import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { AccessTag, AppRequestRow, AppRequestStatusDB } from '../internal.js'

export enum AppRequestStatus {
  STARTED = 'STARTED',
  READY_TO_SUBMIT = 'READY_TO_SUBMIT',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL',
  DISQUALIFIED = 'DISQUALIFIED',
  APPROVED = 'APPROVED',
  DISQUALIFIED_CLOSED = 'DISQUALIFIED_CLOSED',
  APPROVED_CLOSED = 'APPROVED_CLOSED',
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
    [AppRequestStatus.READY_TO_SUBMIT]: { description: 'Applicant has completed the process and is ready to submit. At least one application is eligible to proceed.' },
    [AppRequestStatus.PREAPPROVAL]: { description: 'Applicant has submitted and we are waiting for pre-approval requirements to resolve (usually these are automations like waiting for data to show up in an external system).' },
    [AppRequestStatus.APPROVAL]: { description: 'Applicant has submitted and any pre-approval requirements have been met. We are waiting for a reviewer to do their part.' },
    [AppRequestStatus.DISQUALIFIED]: { description: 'Applicant has submitted and ALL applications have been disqualified. The request is not closed, so the status can still be changed. The reviewer should close out the request when ready, or the system will do it after the period ends.' },
    [AppRequestStatus.APPROVED]: { description: 'Applicant has submitted and at least one application is in an approved non-pending state. The request is not closed, so the status can still be changed. The reviewer should close out the request when ready, or the system will do it after the period ends.' },
    [AppRequestStatus.DISQUALIFIED_CLOSED]: { description: 'The request has been closed and all applications were disqualified. The request must be re-opened (if eligible) to be edited again.' },
    [AppRequestStatus.APPROVED_CLOSED]: { description: 'The request has been closed and at least one application was approved. The request must be re-opened (if eligible) to be edited again.' },
    [AppRequestStatus.WITHDRAWN]: { description: 'Applicant withdrew the request after submitting. The request must be re-opened (if eligible) to be edited again.' },
    [AppRequestStatus.CANCELLED]: { description: 'Applicant cancelled the request before submitting. The applicant may be permitted to uncancel and continue, if the period is still open.' }
  }
})

@ObjectType({ description: 'Represents a group of applications all being applied for at the same time. As part of the request, multiple applications will be created and either eliminated as ineligible or submitted for approval.' })
export class AppRequest {
  constructor (row: AppRequestRow) {
    this.id = String(row.id)
    this.internalId = row.id
    this.dbStatus = row.status
    this.status = row.computedStatus
    this.createdAt = DateTime.fromJSDate(row.createdAt)
    this.updatedAt = DateTime.fromJSDate(row.updatedAt)
    this.closedAt = row.closedAt ? DateTime.fromJSDate(row.closedAt) : undefined
    this.userInternalId = row.userId
    this.periodId = String(row.periodId)
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

  dbStatus: AppRequestStatusDB
  internalId: number
  userInternalId: number
  periodId: string
  tags?: AccessTag[]
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

  internalIds?: number[]
  userInternalIds?: number[]
}
