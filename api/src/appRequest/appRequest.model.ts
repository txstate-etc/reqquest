import { DateTime } from 'luxon'
import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { AccessTag, AppRequestRow, AppRequestStatusDB } from '../internal.js'

export enum AppRequestStatus {
  PREQUAL = 'PREQUAL',
  QUALIFICATION = 'QUALIFICATION',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}
registerEnumType(AppRequestStatus, {
  name: 'AppRequestStatus',
  description: `
    The status of an appRequest. This status is computed based on the status recorded in
    the database and of the requirements for all applications. The possible statuses for each
    database status are as follows:

    STARTED: PREQUAL or QUALIFICATION depending on requirement statuses.
    SUBMITTED: PREAPPROVAL or APPROVAL depending on requirement statuses.
    CLOSED: CLOSED.
    CANCELLED: CANCELLED.
  `
})

@ObjectType({ description: 'Represents a group of applications all being applied for at the same time. As part of the request, multiple applications will be created and either eliminated as ineligible or submitted for approval.' })
export class AppRequest {
  constructor (row: AppRequestRow) {
    this.id = String(row.id)
    this.internalId = row.id
    this.dbStatus = row.status
    this.status = row.computedStatus
    this.submitEligible = row.submitEligible === 1
    this.createdAt = DateTime.fromJSDate(row.createdAt)
    this.updatedAt = DateTime.fromJSDate(row.updatedAt)
    this.closedAt = row.closedAt ? DateTime.fromJSDate(row.closedAt) : undefined
    this.userInternalId = row.userId
    this.periodId = String(row.periodId)
  }

  @Field(type => ID)
  id: string

  @Field()
  submitEligible: boolean

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
