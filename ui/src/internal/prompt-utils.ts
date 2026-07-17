import { uiRegistry } from '../local'
import { api, reviewerRequirementTypes, type PromptDataLegion, type ReviewData } from '$internal'
import type { AppRequest, PromptDefinition, PromptSection, AnsweredPrompt } from '$lib'

export const getInlineReviewerEditPrompts = (appRequest: ReviewData) => {
  const prompts = appRequest?.applications.flatMap(application => application.requirements.filter(
    req => reviewerRequirementTypes.has(req.type))).flatMap(req => req.prompts.filter(prompt => {      
      const def = uiRegistry.getPrompt(prompt.key)
      return isInlineReviewerEditPrompt(def, req, prompt)
    }))    
  return prompts
}

export const isInlineReviewerEditPrompt = (def, req, prompt): boolean => {
  const isReviewerQuestion = reviewerRequirementTypes.has(req.type) && !def?.automation
  return def != null && isReviewerQuestion && prompt.actions.update && def.formMode !== 'full' && !(prompt.invalidated && prompt.answered)
}

export const coalesceAppRequestPrompts = (appRequest: ReviewData, prompts?: PromptDataLegion) => {
  appRequest?.applications.forEach(application => {
    application.requirements.forEach(requirement => {
      requirement.prompts.forEach(reqPrompt => {
        const updatedPrompt = prompts?.find(prompt => prompt.id === reqPrompt.id)
        if (updatedPrompt) {
          Object.assign(reqPrompt, updatedPrompt)
        }
      })
    })
  })
  return appRequest
} 
