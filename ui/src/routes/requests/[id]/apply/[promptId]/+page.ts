import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, params, depends, parent }) => {
  const { promptsById } = await parent()
  depends('request:apply')
  const basicPromptData = promptsById[params.promptId]
  const applicantPromptPromise =  api.getApplicantPrompt(params.id, params.promptId)
  return { applicantPromptPromise, basicPromptData }
}
