import type { ApplicationRescindedStatus, ApplicationStatus, AppRequestPhase, AppRequestStatus, IneligiblePhases, RequirementType } from './typed-client/index.js'

export type CompletionStatus = 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING'

export interface AnsweredPrompt {
  id: string
  key: string
  title: string
  navTitle: string
  answered: boolean
  invalidated: boolean | null
  invalidatedReason: string | null
  moot: boolean | null
  visibility: string
  optOut?: boolean | null
  prestageData: Record<string, any>
  configurationData: Record<string, any>
  gatheredConfigData: Record<string, any>
  statusReasons: {
    status: string
    statusReason: string | null
    programName: string
  }[]
}

export interface PromptSection {
  title: string
  prompts: AnsweredPrompt[]
  subsections?: PromptSection[]
  applicationStatus?: ApplicationStatus
  applicationRescindedStatus?: ApplicationRescindedStatus | null
}

// what the ApplicationDetailsView needs
export interface AppRequestForDetails {
  id: string
  status: AppRequestStatus
  phase: AppRequestPhase
  period?: { name: string }
  createdAt?: string
  updatedAt?: string
  closedAt?: string | null
  actions?: any
  dataVersion?: number
  data?: any
}

export interface ApplicationForDetails {
  id: string
  title: string
  applicantDescription?: string | null
  eligibilityDescription?: string | null
  ineligiblePhase: IneligiblePhases | null
  status: ApplicationStatus
  rescindedStatus?: ApplicationRescindedStatus | null
  statusReason?: string | null
  completionStatus: CompletionStatus
  hasWarning: boolean  
  warningReasons: string[]
  ineligibleReasons: string[]
  metReasons: string[]
  requirements: {
    id: string
    type: RequirementType
    status: string
    statusReason: string | null
    prompts: AnsweredPrompt[]
  }[]
}

export const phaseChangeMutations = ['submitAppRequest', 'returnToApplicant', 'completeReview', 'returnToReview', 'acceptOffer', 'returnToOffer', 'completeRequest', 'returnToNonBlocking'] as const
export type PhaseChangeMutations = typeof phaseChangeMutations[number]

export type OptOutApplication = ApplicationForDetails & { prompt: AnsweredPrompt }

export enum PromptIndicators {
  AUTOMATION = 1,
  WARNING = 2,
  DISQUALIFYING = 3
}

export const translateMutations = {
  submitAppRequest: 'submitted request for review.',
  returnToApplicant: 'returned request to applicant',
  completeReview: 'completed request review',
  returnToReview: 'returned request to review',
  acceptOffer: 'accepted offer',
  returnToOffer: 'returned request to applicant to accept offer',
  completeRequest: 'marked request as complete',
  returnToNonBlocking: 'returned request to non-blocking workflow tasks'
}