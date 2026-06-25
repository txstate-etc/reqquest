import { api, stagedprompts } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ url, params, depends, parent }) => {
  depends('request:apply')
  const applicantPromptPromise =  api.getApplicantPrompt(params.id, params.promptId)
  return { applicantPromptPromise }
}
