import { ApplicationStatus, RequirementStatus, RequirementType, type GetNextPrompt } from './queries'

export function findNextApplyPrompt (appRequest: GetNextPrompt, promptId: string, promptKey: string, base: string): string | undefined {
  let nextRoute: string | undefined
  let currentPromptFound = false
  let lastRequirementWasPrequal = false
  for (const application of appRequest.applications) {
    for (const requirement of application.requirements) {
      for (const prompt of requirement.prompts) {
        if (prompt.id === promptId) {
          if (![ApplicationStatus.PREQUAL, ApplicationStatus.QUALIFICATION].includes(application.status)) {
            if (application.id === appRequest.applications[appRequest.applications.length - 1].id) return `${base}/requests/${appRequest.id}/apply/review`
            else return `${base}/requests/${appRequest.id}/apply/programs`
          }
          currentPromptFound = true
          lastRequirementWasPrequal = requirement.type === RequirementType.PREQUAL
        } else if (currentPromptFound && !prompt.hiddenInNavigation) {
          if (lastRequirementWasPrequal && requirement.type === RequirementType.QUALIFICATION) nextRoute = `${base}/requests/${appRequest.id}/apply/programs`
          else nextRoute = `${base}/requests/${appRequest.id}/apply/${prompt.key}`
          break
        }
      }
      if (nextRoute) break
    }
    if (nextRoute) break
  }
  if (!nextRoute && appRequest.submitEligible) return `${base}/requests/${appRequest.id}/apply/review`
  return nextRoute ?? `${base}/requests/${appRequest.id}/apply/{$promptKey}`
}

export function findCurrentApplyScreen (appRequest: GetNextPrompt, base: string) {
  if (appRequest.submitEligible) return `${base}/requests/${appRequest.id}/apply/review`
  let nextRoute: string | undefined
  let lastRequirementWasPrequal = false
  for (const application of appRequest.applications) {
    for (const requirement of application.requirements) {
      for (const prompt of requirement.prompts) {
        if (prompt.hiddenInNavigation) {
          lastRequirementWasPrequal = requirement.type === RequirementType.PREQUAL && requirement.status !== RequirementStatus.PENDING
        } else {
          if (lastRequirementWasPrequal) nextRoute = `${base}/requests/${appRequest.id}/apply/programs`
          else nextRoute = `${base}/requests/${appRequest.id}/apply/${prompt.key}`
        }
      }
    }
  }
  return nextRoute
}
