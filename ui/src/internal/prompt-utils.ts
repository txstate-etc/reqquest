import { uiRegistry } from '../local'
import { reviewerRequirementTypes, type PromptDataLegion, type ReviewData } from '$internal'
import type { PromptDefinition, RequirementType } from '$lib'

export type CoalescedAppRequest = ReturnType<typeof coalesceAppRequestPrompts>

export const getInlineReviewerEditPrompts = (appRequest: ReviewData) => {
  const prompts = appRequest?.applications.flatMap(application => application.requirements.filter(
    req => reviewerRequirementTypes.has(req.type))).flatMap(req => req.prompts.filter(prompt => {      
      const def = uiRegistry.getPrompt(prompt.key)
      return isInlineReviewerEditPrompt(def, req.type, prompt)
    }))    
  return prompts
}

export const isInlineReviewerEditPrompt = (def?: PromptDefinition, type?: RequirementType, prompt?: CoalescedAppRequest['applications'][0]['requirements'][0]['prompts'][0]): boolean => {
  const isReviewerQuestion = type && reviewerRequirementTypes.has(type) && !def?.automation
  return !!(def != null && isReviewerQuestion && prompt?.actions.update && def.formMode !== 'full' && !(prompt.invalidated && prompt.answered))
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