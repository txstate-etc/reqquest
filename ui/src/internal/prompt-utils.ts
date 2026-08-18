import { uiRegistry } from '../local'
import { reviewerRequirementTypes, type PromptDataLegion, type ReviewData } from '$internal'

export type CoalescedAppRequest = ReturnType<typeof coalesceAppRequestPrompts>

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

export const coalesceAppRequestPrompts = (appRequest: NonNullable<ReviewData>, prompts?: PromptDataLegion) => {
  const coalescedApplications = appRequest.applications.map(application => ({
    ...application,
    requirements: application.requirements.map(requirement => ({
      ...requirement,
      prompts: requirement.prompts.map(reqPrompt => {
        const updatedPrompt = prompts?.find(prompt => prompt.id === reqPrompt.id)
        return { ...reqPrompt, ...updatedPrompt}
      })
    }))
  }))
  return {
    ...appRequest,
    applications: coalescedApplications ?? []
  }
} 