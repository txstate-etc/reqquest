import { uiRegistry } from '../local'
import { reviewerRequirementTypes } from '$internal'
import { deepEqual } from './util.js'

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

export const coalesceAppRequestPrompts = (appRequest, prompts) => {
  appRequest.applications.forEach(application => {
    application.requirements.forEach(requirement => {
      requirement.prompts.forEach(reqPrompt => {
        const updatedPrompt = prompts.find(prompt => prompt.id === reqPrompt.id)
        if (updatedPrompt) {
          Object.assign(reqPrompt, updatedPrompt)
        }
      })
    })
  })
  return appRequest
} 

export const promptRequiresValidation = (prompt, data) => {
  if (prompt.preloadData == null) return true // if there is no prompt data, validate to show required field errors
  return (!deepEqual(prompt.preloadData, data)) ? true : false // if there is prompt data, only validate if the data has changed to avoid showing validation errors on load before the user has a chance to make any changes
}
