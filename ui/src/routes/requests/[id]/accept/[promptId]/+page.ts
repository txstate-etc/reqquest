import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends, parent }) => {
  const { promptsById } = await parent()  
  if (promptsById[params.promptId].presave) await api.updatePrompt(params.promptId, {}, true) 
  const { prompt } = await api.getApplicantPrompt(params.id, params.promptId)
  depends('request:apply')
  if (!prompt) throw error(404, 'Prompt not found')
  return { prompt }
}