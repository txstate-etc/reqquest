import { DateTime } from 'luxon'
import { expect, test } from './fixtures.js'
import { answerAvailable, application, expectAction, getState, requestAction, seededPeriodId, type Graphql } from './complex.flow.js'
import { promptMapApplicantQualified } from './complex.promptdata.js'

/**
 * At submission, an application whose program has no reviewer questions (no PREAPPROVAL or APPROVAL requirements enabled)
 * has no immediate review, so the API advances it on its own: into its first blocking workflow stage, or to REVIEW_COMPLETE
 * when there is none. When every application is then REVIEW_COMPLETE, the review completes automatically as well.
 *
 * No stock complex program is like that - each one with stages or acceptance also has APPROVAL requirements - so each case
 * disables APPROVAL keys for a period. Disabling is period-wide per key: a key shared between programs drops out of every
 * program that lists it, and the cases are built around that.
 *
 * Not covered: an application ruled out before submission advancing the same way. Every presubmission disqualifier in the
 * complex demo is shared by all three programs, so a request with one ineligible and one eligible program cannot be built
 * here. The API's selection does not look at eligibility at all, so the path is the same one exercised below.
 */
const dog = 'adopt_a_dog_program'
const cat = 'adopt_a_cat_program'
const foster = 'foster_a_pet_program'
const dogStage = 'approve_reviewer_exercise_exemption_adopt_a_dog_workflow'
const dogApprovalKeys = ['review_applicant_state_residence_app_req', 'review_applicant_dog_info_app_req', 'review_movie_lover_app_req']
const everyApprovalKey = [...dogApprovalKeys, 'review_applicant_cat_info_app_req', 'review_applicant_foster_a_pet_info_app_req']
// the only requirement of the dog and foster blocking stage; with it disabled the stage has nothing enabled and is skipped
const blockingStageKey = 'approve_reviewer_exercise_exemption_workflow_req'

const timeZone = 'America/Chicago'
const openDate = '2025-07-01T00:00:00.000-05:00'
const closeDate = DateTime.now().plus({ days: 1 }).setZone(timeZone).set({ millisecond: 0 }).toISO()

async function createReviewedPeriod (graphql: Graphql, name: string, code: string) {
  const { createPeriod } = await graphql<{ createPeriod: { period: { id: number } } }>(`
    mutation CreatePeriod($name: String!, $code: String!, $openDate: DateTime!, $closeDate: DateTime!) {
      createPeriod(period: { name: $name, code: $code, openDate: $openDate, closeDate: $closeDate }, validateOnly: false) { period { id } }
    }
  `, { name, code, openDate, closeDate })
  const periodId = createPeriod.period.id
  await graphql('mutation ($periodId: ID!) { markPeriodReviewed(periodId: $periodId) { period { id } } }', { periodId })
  return periodId
}

async function setRequirementsDisabled (graphql: Graphql, periodId: number, keys: string[], disabled: boolean) {
  for (const requirementKey of keys) {
    const response = await graphql<any>('mutation ($periodId: String!, $requirementKey: String!, $disabled: Boolean!) { updatePeriodRequirement(periodId: $periodId, requirementKey: $requirementKey, disabled: $disabled) { success } }', { periodId: String(periodId), requirementKey, disabled })
    expect(response.errors, `${requirementKey}: ${JSON.stringify(response.errors)}`).toBeUndefined()
    expect(response.updatePeriodRequirement.success, requirementKey).toEqual(true)
  }
}

async function createAndSubmit (graphql: Graphql, login: string, periodId: number) {
  const { createAppRequest } = await graphql<{ createAppRequest: { appRequest: { id: number } | null, messages: { message: string }[] } }>(`
    mutation CreateAppRequest($login: String!, $periodId: ID!) {
      createAppRequest(login: $login, periodId: $periodId, validateOnly: false) { appRequest { id } messages { message } }
    }
  `, { login, periodId })
  expect(createAppRequest.appRequest, createAppRequest.messages.map(m => m.message).join('; ')).not.toBeNull()
  const appRequestId = createAppRequest.appRequest!.id
  await answerAvailable(graphql, appRequestId, promptMapApplicantQualified)
  await expectAction(graphql, 'submitAppRequest', requestAction('submitAppRequest'), { appRequestId })
  return appRequestId
}

test.describe.serial('Applications with no reviewer questions advance on their own at submission', { tag: '@complex' }, () => {
  // the seeded period allows one request per applicant and the other complex specs already use applicant, applicant2 and applicant3 in it
  test.use({ login: 'applicant4' })
  let mixedPeriodId = 0
  let seededId = 0

  test('Admin - period where only the dog program has no reviewer questions', async ({ suRequest }) => {
    mixedPeriodId = await createReviewedPeriod(suRequest.graphql, '2025 auto-advance mixed', 'AUTO_ADVANCE_MIXED')
    await setRequirementsDisabled(suRequest.graphql, mixedPeriodId, dogApprovalKeys, true)
  })

  test('Submit - the dog application enters its blocking stage by itself, the others wait for review', async ({ request, reviewerRequest }) => {
    const appRequestId = await createAndSubmit(request.graphql, 'applicant4', mixedPeriodId)
    const state = await getState(reviewerRequest.graphql, appRequestId)
    expect(state.phase).toEqual('SUBMITTED')
    expect(state.status).toEqual('APPROVAL')
    const dogApp = application(state, dog)
    expect(dogApp.phase).toEqual('WORKFLOW_BLOCKING')
    expect(dogApp.workflowStage?.key).toEqual(dogStage)
    // the stage's own requirement is what is pending now; nothing was decided against the applicant
    expect(dogApp.status).toEqual('PENDING')
    expect(dogApp.ineligiblePhase).toBeNull()
    for (const key of [cat, foster]) {
      expect(application(state, key).phase, key).toEqual('APPROVAL')
      expect(application(state, key).status, key).toEqual('PENDING')
      expect(application(state, key).workflowStage, key).toBeNull()
    }
  })

  test('Admin - seeded period where no program has reviewer questions or an enabled blocking stage', async ({ suRequest }) => {
    seededId = await seededPeriodId(suRequest.graphql)
    await setRequirementsDisabled(suRequest.graphql, seededId, [...everyApprovalKey, blockingStageKey], true)
  })

  test('Submit - every application reaches REVIEW_COMPLETE and the review completes itself into acceptance', async ({ request, reviewerRequest }) => {
    const appRequestId = await createAndSubmit(request.graphql, 'applicant4', seededId)
    const state = await getState(reviewerRequest.graphql, appRequestId)
    // the seeded period has an acceptance phase, so the automatic Complete Review lands there rather than at COMPLETE
    expect(state.phase).toEqual('ACCEPTANCE')
    expect(state.status).toEqual('ACCEPTANCE')
    for (const app of state.applications) {
      expect(app.phase, app.programKey).toEqual('ACCEPTANCE')
      expect(app.status, app.programKey).toEqual('ELIGIBLE')
      expect(app.workflowStage, app.programKey).toBeNull()
    }
  })

  // createPeriod copies the disabled flags of the most recent period and the later complex specs rely on the stock
  // configuration, so every flag this spec set is cleared whatever happened above
  test.afterAll(async ({ suRequest }) => {
    if (seededId) await setRequirementsDisabled(suRequest.graphql, seededId, [...everyApprovalKey, blockingStageKey], false)
    if (mixedPeriodId) await setRequirementsDisabled(suRequest.graphql, mixedPeriodId, dogApprovalKeys, false)
  })
})
