import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { ApplicationRow, ProgramDefinition, programRegistry } from '../internal.js'

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ELIGIBLE = 'ELIGIBLE',
  INELIGIBLE = 'INELIGIBLE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
  description: `
    The status of an application. This is usually a computed field, not stored in the database. The status
    is computed based on the status of the appRequest and of the requirements for the program. If
    the appRequest is CLOSED or CANCELLED, this status will remain frozen wherever it was before the
    closure / cancellation.
  `,
  valuesConfig: {
    PENDING: { description: 'The application status has not yet been determined. Further prompts must be answered.' },
    ELIGIBLE: { description: 'All application requirements up to and including WORKFLOW_BLOCKING requirements are resolving as MET (or NOT_APPLICABLE or WARNING). If there is an acceptance phase, the acceptance is still pending.' },
    INELIGIBLE: { description: 'At least one application requirement up to and including WORKFLOW_BLOCKING requirements is not met. The review cannot proceed, but the first or current stage of the workflow should still continue.' },
    ACCEPTED: { description: 'An offer was made to the applicant and all ACCEPTANCE requirements are met (the applicant accepted the offer).' },
    REJECTED: { description: 'An offer was made to the applicant and at least one ACCEPTANCE requirement is not met (the applicant rejected the offer).' }
  }
})

export enum ApplicationPhase {
  PREQUAL = 'PREQUAL',
  QUALIFICATION = 'QUALIFICATION',
  READY_TO_SUBMIT = 'READY_TO_SUBMIT',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL',
  READY_FOR_WORKFLOW = 'READY_FOR_WORKFLOW',
  WORKFLOW_BLOCKING = 'WORKFLOW_BLOCKING',
  READY_FOR_OFFER = 'READY_FOR_OFFER',
  ACCEPTANCE = 'ACCEPTANCE',
  READY_TO_ACCEPT = 'READY_TO_ACCEPT',
  WORKFLOW_NONBLOCKING = 'WORKFLOW_NONBLOCKING',
  COMPLETE = 'COMPLETE'
}

registerEnumType(ApplicationPhase, {
  name: 'ApplicationPhase',
  description: `
    The phase of the application. This is usually a computed field, not stored in the database. The phase
    is computed based on the status of the appRequest and of the requirements for the program.
  `,
  valuesConfig: {
    PREQUAL: { description: 'The appRequest has not finished pre-qual yet. The application doesn\'t properly exist yet.' },
    QUALIFICATION: { description: 'The applicant is filling out their portion of prompts and has not yet finished.' },
    READY_TO_SUBMIT: { description: 'The applicant has filled out their portion of the prompts but has not yet submitted for review.' },
    PREAPPROVAL: { description: 'The applicant has submitted the application, but there are automated prompts that need to be filled in before the application will appear on a reviewer\'s dashboard.' },
    APPROVAL: { description: 'The applicant has submitted the application and any PREAPPROVAL requirements are passing. The application is under review.' },
    READY_FOR_WORKFLOW: { description: 'No application requirements are PENDING. The application is ready for the first workflow stage, but a reviewer must manually advance the phase. This phase will be automatically skipped if there are no workflow stages configured/enabled.' },
    WORKFLOW_BLOCKING: { description: 'The application review has been completed and now there is a workflow process to audit the review BEFORE marking the application status as eligible or ineligible. It should remain pending until the blocking workflow stages have been completed. Workflow stages that evaluate to INELIGIBLE will also make the application status INELIGIBLE. Prompts from the applicant and review phases are locked.' },
    READY_FOR_OFFER: { description: 'The application has been reviewed and any blocking workflow stages have been completed. The application is ready for an offer to be made to the applicant. A reviewer must manually advanced the phase, and will do so for the whole appRequest, not one application at a time. So the application will sit in this state until all applications are ready for offer. If there is no acceptance phase (because there are no acceptance requirements), the makeOffer prompt will move the phase to WORKFLOW_NONBLOCKING or COMPLETE.' },
    ACCEPTANCE: { description: 'The application has been reviewed and an offer has been made to the applicant. The applicant must accept the offer.' },
    READY_TO_ACCEPT: { description: 'An offer has been made to the applicant. The acceptance requirements are no longer pending, the application is ready to be finalized.' },
    WORKFLOW_NONBLOCKING: { description: 'The application has been offered and accepted and now there is a workflow process to audit the review AFTER marking the application status as eligible or ineligible. Requirements from non-blocking workflow states cannot affect the application status, but the application will not proceed to the complete phase until all workflow stages are non-PENDING.' },
    COMPLETE: { description: 'The application has been reviewed. If there was a workflow, it is complete. If there was an acceptance phase, the offer was accepted or rejected.' }
  }
})

export enum IneligiblePhases {
  PREQUAL = 'PREQUAL',
  QUALIFICATION = 'QUALIFICATION',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL',
  WORKFLOW = 'WORKFLOW',
  ACCEPTANCE = 'ACCEPTANCE'
}

registerEnumType(IneligiblePhases, {
  name: 'IneligiblePhases',
  valuesConfig: {
    PREQUAL: { description: 'The application became ineligible in the pre-qualification phase.' },
    QUALIFICATION: { description: 'The application became ineligible in the qualification phase.' },
    PREAPPROVAL: { description: 'The application became ineligible in the pre-approval phase.' },
    APPROVAL: { description: 'The application became ineligible in the approval phase.' },
    WORKFLOW: { description: 'The application became ineligible during blocking workflow.' },
    ACCEPTANCE: { description: 'The application became ineligible in the acceptance phase.' }
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
    this.phase = row.computedPhase
    this.ineligiblePhase = row.computedIneligiblePhase
    this.workflowStageKey = row.workflowStage
    this.status = row.computedStatus
    this.statusReason = row.computedStatusReason
    this.title = this.program.title
    this.navTitle = this.program.title ?? this.program.title
    this.authorizationKeys = { program: [this.program.key] }
  }

  @Field(() => ID)
  id: string

  @Field(type => ApplicationPhase, { description: 'The phase of the application. This is usually a computed field, not stored in the database.' })
  phase: ApplicationPhase

  @Field(type => IneligiblePhases, { nullable: true, description: 'The phase in which this application became ineligible for benefits. Useful for reporting / filtering. Null if the application is not (yet) ineligible.' })
  ineligiblePhase?: IneligiblePhases

  @Field(() => ApplicationStatus)
  status: ApplicationStatus

  @Field({ nullable: true, description: 'When one of the application\'s requirements is failing or throwing a warning, its reason will be copied here for convenience. If there is a warning and then later a failure, the failure reason will win.' })
  statusReason?: string

  @Field({ description: 'The title of the program this application is for.' })
  title: string

  @Field({ description: 'The navigation title of the program this application is for.' })
  navTitle: string

  @Field({ description: 'The program key this application corresponds to.' })
  programKey: string

  internalId: number
  appRequestInternalId: number
  appRequestId: string
  appRequestTags?: Record<string, string[]>
  userInternalId: number
  periodId: string
  program: ProgramDefinition
  authorizationKeys: Record<string, string[]>
  workflowStageKey?: string
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
