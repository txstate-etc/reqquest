import { api, stagedprompts } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, params, depends, parent }) => {
  const { promptsById, appRequestForExport } = await parent()  
  depends('request:apply')
  if (promptsById[params.promptId].prestage && !stagedprompts.has(params.promptId)) {    
    const response = await api.stagePrompt(params.promptId, appRequestForExport.dataVersion) 
    if (response.success) stagedprompts.add(params.promptId)
  }     
  const { appRequest, prompt } = await api.getApplicantPrompt(params.id, params.promptId)
  if (!prompt) throw error(404, 'Prompt not found')
  return { prompt, dataVersion: appRequest.dataVersion }
}
