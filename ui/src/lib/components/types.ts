import type { api, ApplicationStatus, AppRequestStatus } from '$lib'

export type DashboardAppRequest = Awaited<ReturnType<typeof api.getApplicantRequests>>[number]

export type ApplyNavigationResponse = Awaited<ReturnType<typeof api.getApplyNavigation>>
export type AppRequestForExportResponse = Awaited<ReturnType<typeof api.getAppRequestForExport>>

export interface AnsweredPrompt {
  id: string
  key: string
  title: string
  navTitle: string
  answered: boolean
  visibility: string
  relatedConfigData: Record<string, any>
}

export interface PromptSection {
  title: string
  prompts: AnsweredPrompt[]
}

// what the ApplicationDetailsView needs
export interface AppRequestForDetails {
  id: string
  status: AppRequestStatus
  period: { name: string }
  applications: {
    title: string
    status: ApplicationStatus
    requirements: {
      prompts: AnsweredPrompt[]
    }[]
  }[]
  createdAt?: string
  updatedAt?: string
  actions?: any
}
