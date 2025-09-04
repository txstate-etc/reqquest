import type { api } from '$lib'
import type { AppRequestStatus, Application, ApplicationStatus } from '$lib/typed-client/schema'

export type DashboardAppRequest = Awaited<ReturnType<typeof api.getApplicantRequests>>[number]

export type ApplyNavigationResponse = Awaited<ReturnType<typeof api.getApplyNavigation>>

export interface ApplicationDetailsData {
  id: string
  status: AppRequestStatus
  applications: Application[]
  data: Record<string, any>
  prequalPrompts?: AnsweredPrompt[]
  postqualPrompts?: AnsweredPrompt[]
}

// ApplicationDetailsView component
export interface AnsweredPrompt {
  id: string
  key: string
  title: string
  navTitle: string
  answered: boolean
  visibility: string
}

export interface PromptSection {
  title: string
  prompts: AnsweredPrompt[]
}

export interface SelectedApplication {
  id: string
  status: AppRequestStatus
  period: { name: string }
  applications?: { title: string, status: ApplicationStatus }[]
}
