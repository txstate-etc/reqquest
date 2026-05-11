import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { getInlineReviewerEditPrompts, coalesceAppRequestPrompts } from '$internal'

export const load: PageLoad = async ({ params, depends }) => {
  const appRequest = await api.getReviewData(params.id)  
  //TODO: Implement prestage check and call if needed for prompts on reviewer screen
  const inlinePrompts = getInlineReviewerEditPrompts(appRequest)
  const inlinePromptsWithData = await api.getPromptDataLegion(params.id, inlinePrompts.map(prompt => prompt.id))
  const coalescedAppRequest = coalesceAppRequestPrompts(appRequest, inlinePromptsWithData)
  depends('request:approve')
  if (!appRequest) throw error(404, 'App Request not found')
  return { appRequest: coalescedAppRequest, programKey: params.programKey }
}
