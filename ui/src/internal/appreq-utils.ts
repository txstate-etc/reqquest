import { enumIneligiblePhases, type IneligiblePhases } from '../lib'

/**
 * True when this application was found ineligible before submission, i.e. during PREQUAL or
 * QUALIFICATION. These are the applications that land in the "Ineligible benefits" panel on
 * the applicant screens, and the ones whose program `eligibilityDescription` should be shown.
 * Anywhere that cares about membership in that panel should go through this function so the
 * panel and the extra messaging can't drift out of sync.
 */
export function isIneligiblePreSubmission (application: { ineligiblePhase?: IneligiblePhases | null }) {
  return application.ineligiblePhase === enumIneligiblePhases.PREQUAL || application.ineligiblePhase === enumIneligiblePhases.QUALIFICATION
}

/**
 * Return the appRequests with any pre-submission-ineligible applications stripped out of each one.
 */
export function excludePreSubmissionIneligibleApps<T extends { applications: { ineligiblePhase?: IneligiblePhases | null }[] }> (appRequests: T[]): T[] {
  return appRequests.map(ar => ({
    ...ar,
    applications: ar.applications.filter(app => !isIneligiblePreSubmission(app))
  }))
}
