import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { getInlineReviewerEditPrompts, coalesceAppRequestPrompts } from '$internal'

export const load: PageLoad = async ({ params, depends }) => {
  const appRequest = await api.getReviewData(params.id)
  const inlinePrompts = getInlineReviewerEditPrompts(appRequest)
  const inlinePromptsWithData = await api.getPromptDataLegion(params.id, (inlinePrompts ?? []).map(prompt => prompt.id))
  const coalescedAppRequest = coalesceAppRequestPrompts(appRequest, inlinePromptsWithData)
  if (!coalescedAppRequest) throw error(404, 'App Request not found')
  depends('request:approve')
  console.log(coalescedAppRequest)
  return { appRequest: coalescedAppRequest, programKey: params.programKey }
}
