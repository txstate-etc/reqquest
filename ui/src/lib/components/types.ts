import type { api } from '$lib'

export type DashboardAppRequest = Awaited<ReturnType<typeof api.getApplicantRequests>>[number]

export type ApplyNavigationResponse = Awaited<ReturnType<typeof api.getApplyNavigation>>

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
