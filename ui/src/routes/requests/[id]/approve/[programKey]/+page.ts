import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { getInlineReviewerEditPrompts } from '../../../../../internal'

export const load: PageLoad = async ({ params, depends }) => {
  const appRequest = await api.getReviewData(params.id)
  console.log('App Request in load function:', appRequest)

  //TODO: Implement prestage check and call if needed for prompts.  If prestage is required for prompt, then must cal getReviewData again
  // and store stagedprompts in set to block calling stage again for recurring stage functions ... only on leave and return in nav route
  const inlinePrompts = getInlineReviewerEditPrompts(appRequest)
  const inlinePromptIds = inlinePrompts.map(prompt => prompt.id)
  const inlinePromptsWithData = await api.getPromptDataLegion(params.id, inlinePromptIds)
  //TODO: Implement prestage check and call if needed for prompts
  console.log(`Prompts: ${JSON.stringify(inlinePrompts)}`)
  console.log(`Prompt ids: ${JSON.stringify(inlinePromptIds)}`)
  console.log(`Inline prompts data: ${JSON.stringify(inlinePromptsWithData)}`)
  // CALL TO getPromptsData
  // const loadedInlinePrompts = await api.getPromptsData(appRequest.id, inlinePromptIds)
  //console.log(`Loaded inline prompts: ${JSON.stringify(loadedInlinePrompts)}`)

  depends('request:approve')
  if (!appRequest) throw error(404, 'App Request not found')
  return { appRequest, programKey: params.programKey }
}
