import type { api, ApplicationStatus, AppRequestStatus, CompletionStatus, IneligiblePhases, RequirementType } from '$lib'

export type DashboardAppRequest = Awaited<ReturnType<typeof api.getApplicantRequests>>[number]

export type AppRequestForExportResponse = Awaited<ReturnType<typeof api.getAppRequestForExport>>

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
}

// what the ApplicationDetailsView needs
export interface AppRequestForDetails {
  id: string
  status: AppRequestStatus
  period?: { name: string }
  createdAt?: string
  updatedAt?: string
  actions?: any
}

export interface ApplicationForDetails {
  id: string
  title: string
  ineligiblePhase: IneligiblePhases | null
  status: ApplicationStatus
  statusReason?: string | null
  completionStatus: CompletionStatus
  hasWarning: boolean
  warningReasons: string[]
  ineligibleReasons: string[]
  requirements: {
    id: string
    type: RequirementType
    status: string
    statusReason: string | null
    prompts: AnsweredPrompt[]
  }[]
}

// export const phaseChangeMutations = ['submitAppRequest', 'returnToApplicant', 'completeAppRequestReview', 'returnToReview', 'acceptOffer', 'returnToOffer', 'completeRequest', 'returnToNonBlocking'] as const
export const phaseChangeMutations = ['submitAppRequest', 'returnToApplicant', 'completeReview', 'returnToReview', 'acceptOffer', 'returnToOffer', 'completeRequest', 'returnToNonBlocking'] as const
export type PhaseChangeMutations = typeof phaseChangeMutations[number]
