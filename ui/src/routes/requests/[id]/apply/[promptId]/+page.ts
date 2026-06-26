import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, params, depends, parent }) => {
  depends('request:apply')
  const { appRequest, prompt } = await api.getApplicantPrompt(params.id, params.promptId)
  if (!prompt) throw error(404, 'Prompt not found')
  return { prompt, dataVersion: appRequest.dataVersion }
}
