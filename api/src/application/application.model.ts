import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { ApplicationRow, ProgramDefinition, programRegistry } from '../internal.js'

export enum ApplicationStatus {
  PREQUAL = 'PREQUAL',
  FAILED_PREQUAL = 'FAILED_PREQUAL',
  QUALIFICATION = 'QUALIFICATION',
  FAILED_QUALIFICATION = 'FAILED_QUALIFICATION',
  READY_TO_SUBMIT = 'READY_TO_SUBMIT',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL',
  APPROVED = 'APPROVED',
  NOT_APPROVED = 'NOT_APPROVED',
  ACCEPTED = 'ACCEPTED',
  NOT_ACCEPTED = 'NOT_ACCEPTED',
  CANCELLED = 'CANCELLED',
  WITHDRAWN = 'WITHDRAWN'
}
registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
  description: `
    The status of an application. This is usually a computed field, not stored in the database. The status
    is computed based on the status of the appRequest and of the requirements for the program. If
    the appRequest is CLOSED, the status should permanently match the ApplicationStatusDB instead of being
    computed. If the appRequest is CANCELLED, all applications should be CANCELLED as well.
  `,
  valuesConfig: {
    PREQUAL: { description: 'The appRequest has not finished pre-qualification yet. This application does not quite exist yet and probably should not appear in the UI.' },
    QUALIFICATION: { description: 'The application has been pre-qualified and is awaiting further input from the applicant.' },
    READY_TO_SUBMIT: { description: 'All requirements have been evaluated as MET or NOT_APPLICABLE. The application is ready to be submitted.' },
    PREAPPROVAL: { description: 'The application has been submitted and is awaiting preapproval.' },
    APPROVAL: { description: 'The application has been submitted, has passed preapproval, and is awaiting approval.' },
    APPROVED: { description: 'The application has been approved.' },
    FAILED_PREQUAL: { description: 'The applicant is ineligible for the program according to the pre-qual requirements. The application/program should no longer be visible in the UI for this appRequest.' },
    FAILED_QUALIFICATION: { description: 'The applicant is ineligible for the program according to the qualification requirements. The application/program should remain visible in the UI and any applicable statusReason from the associated requirements should be displayed.' },
    NOT_APPROVED: { description: 'The application has not been approved.' },
    ACCEPTED: { description: 'The application\'s benefit has been accepted by the applicant. This status is only possible for programs with at least one ACCEPTANCE requirement.' },
    NOT_ACCEPTED: { description: 'The application\'s benefit was rejected by the applicant. This status is only possible for programs with at least one ACCEPTANCE requirement.' },
    WITHDRAWN: { description: 'The appRequest (and thus the application inside it) was withdrawn after being submitted. If it is re-opened, it will re-open in submitted state.' },
    CANCELLED: { description: `
      The appRequest (and thus the application inside it) has been cancelled by the applicant. In
      some cases, individual programs may have a requirement that the applicant agrees that they
      desire to apply. In that case the appRequest status is not CANCELLED, and neither is the application
      status. It will actually be FAILED_PREQUAL or FAILED_QUALIFICATION, and the statusReason of the
      requirement will explain that the applicant did not wish to pursue the application.
    ` }
  }
})

@ObjectType({ description: 'An application represents the applicant applying to a specific program. Each appRequest has multiple applications - one per program defined in the system. Some applications are mutually exclusive and/or will be eliminated early based on PREQUAL requirements, but they all technically exist in the data model - there is no concept of picking one application over another, just two applications where one dies and the other survives.' })
export class Application {
  constructor (row: ApplicationRow) {
    this.program = programRegistry.get(row.programKey)
    this.internalId = row.id
    this.id = String(row.id)
    this.appRequestInternalId = row.appRequestId
    this.appRequestId = String(row.appRequestId)
    this.userInternalId = row.userId
    this.periodId = String(row.periodId)
    this.programKey = row.programKey
    this.status = row.computedStatus
    this.statusReason = row.computedStatusReason
    this.title = this.program.title
    this.navTitle = this.program.title ?? this.program.title
  }

  @Field(() => ID)
  id: string

  @Field(() => ApplicationStatus)
  status: ApplicationStatus

  @Field({ nullable: true, description: 'When one of the application\'s requirements is failing or throwing a warning, its reason will be copied here for convenience. If there is a warning and then later a failure, the failure reason will win.' })
  statusReason?: string

  @Field({ description: 'The title of the program this application is for.' })
  title: string

  @Field({ description: 'The navigation title of the program this application is for.' })
  navTitle: string

  internalId: number
  appRequestInternalId: number
  appRequestId: string
  userInternalId: number
  periodId: string
  programKey: string
  program: ProgramDefinition
}

@ObjectType()
export class ApplicationActions {}

@InputType()
export class ApplicationFilter {
  @Field(() => [ID], { nullable: true })
  ids?: string[]

  @Field(() => [ID], { nullable: true })
  appRequestIds?: string[]
}
