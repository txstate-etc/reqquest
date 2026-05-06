import { uiRegistry } from '../local'
import { reviewerRequirementTypes } from '$internal'

export const stagedprompts = new Set<string>()

export const getInlineReviewerEditPrompts = (appRequest) => {
  const prompts = appRequest.applications.flatMap(application => application.requirements.filter(
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