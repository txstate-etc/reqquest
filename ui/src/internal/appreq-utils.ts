import { enumIneligiblePhases, enumRequirementStatus, type IneligiblePhases } from '../lib'

/**
 * True when this application is ineligible because of an applicant requirement (PREQUAL, QUALIFICATION
 * or POSTQUAL). This looks at the type of the failing requirement, not at when it failed - a reviewer
 * changing an applicant answer after submission also makes this true. For "was it ineligible before
 * submission" use the API's `hiddenIneligiblePreSubmit` instead.
 *
 * These are the applications that land in the "Ineligible benefits" panel on
 * the applicant screens, and the ones whose program `eligibilityDescription` should be shown.
 * Anywhere that cares about membership in that panel should go through this function so the
 * panel and the extra messaging can't drift out of sync.
 */
export function isIneligibleByApplicantRequirement (application: { ineligiblePhase?: IneligiblePhases | null }) {
  return application.ineligiblePhase === enumIneligiblePhases.PREQUAL || application.ineligiblePhase === enumIneligiblePhases.QUALIFICATION
}


 // Return the appRequests with any application that is ineligible because of an applicant requirement stripped out of each one. See `isIneligibleByApplicantRequirement`.
export function excludeApplicantRequirementIneligibleApps<T extends { applications: { ineligiblePhase?: IneligiblePhases | null }[] }> (appRequests: T[]): T[] {
  return appRequests.map(ar => ({
    ...ar,
    applications: ar.applications.filter(app => !isIneligibleByApplicantRequirement(app))
  }))
}

export function isHiddenFromApplicant (application: { hiddenIneligiblePreSubmit?: boolean | null, requirements?: { status: string, prompts: { optOut?: boolean | null }[] }[] }) {
  if (!application.hiddenIneligiblePreSubmit) return false
  const optedOut = application.requirements?.some(r => r.status === enumRequirementStatus.DISQUALIFYING && r.prompts.some(p => p.optOut))
  return !optedOut
}

export const DEFAULT_APPLICANT_NO_PROGRAMS_MESSAGE = 'Based on your responses, you don\'t currently qualify for any available benefits. If you believe this is incorrect, review your answers.'
