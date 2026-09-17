import { expect, test } from './fixtures.js'
import { promptMapApplicantQualified, promptMapReviewerCatDenied, promptMapReviewerAllDenied, promptMapApproveReviewerQualified, promptMapApplicantAcceptance, promptMapReviewerNonBlocking } from './complex.promptdata.js'

/**
 * Non-blocking does not mean optional. A request cannot reach COMPLETE until every non-blocking requirement on every
 * application has resolved to something other than PENDING - including an application denied during review, because
 * the audit of the reviewer's work is needed whether or not the applicant was approved. Only an application screened
 * out before submission skips non-blocking workflow.
 *
 * In the complex demo only the cat program carries a non-blocking stage (confirm_cat_microchip_service_workflow), so the
 * cat application is the one denied in review here. Foster shares the cat review requirement, so it is denied along with
 * it; it has only a blocking stage, which makes it the control - denied, but with nothing non-blocking owed. The
 * pre-submission exception is not exercised in this demo: every pre-submission requirement that can disqualify is shared
 * by all three programs, so screening the cat out would screen the whole request out and it could never be submitted.
 */
type Graphql = <T = any>(query: string, variables?: Record<string, any>) => Promise<T>
type Prompt = { id: number, key: string, answered: boolean, visibility: string }
type Requirement = { key: string, type: string, status: string, prompts: Prompt[] }
type Application = { id: string, programKey: string, phase: string, status: string, ineligiblePhase: string | null, requirements: Requirement[] }
type State = { phase: string, status: string, actions: { completeRequest: boolean }, applications: Application[] }

const stateQuery = `
  query NonBlockingWorkflowState($ids: [ID!]) {
    appRequests(filter: { ids: $ids }) {
      phase status actions { completeRequest }
      applications {
        id programKey phase status ineligiblePhase
        requirements { key type status prompts { id key answered visibility } }
      }
    }
  }
`
async function getState (graphql: Graphql, appRequestId: number): Promise<State> {
  const response = await graphql<{ appRequests: State[], errors?: { message: string }[] }>(stateQuery, { ids: [appRequestId] })
  if (!response.appRequests) throw new Error(`state query failed: ${JSON.stringify(response.errors)}`)
  return response.appRequests[0]
}
const application = (state: State, programKey: string) => state.applications.find(a => a.programKey === programKey)!
const requirement = (state: State, programKey: string, key: string) => application(state, programKey).requirements.find(r => r.key === key)!

const updatePromptMutation = `
  mutation UpdatePrompt($promptId: ID!, $data: JsonData!) {
    updatePrompt(promptId: $promptId, data: $data, validateOnly: false) { success messages { message arg } }
  }
`
/**
 * Answer every AVAILABLE prompt of a still-PENDING requirement that the map knows, repeating because each answer
 * reveals the next prompts. Keyed on what this run has sent rather than the API's `answered` flag: a prompt with no
 * validation rules (the movie-lover review) reads as answered before it holds any data, and a prompt shared by programs
 * is one answer. The PENDING filter keeps it from re-sending a prompt whose requirement has already resolved - a
 * passed blocking stage locks its prompt, and the API refuses the update.
 */
async function answerAvailable (graphql: Graphql, appRequestId: number, answers: Map<string, Map<string, any>>) {
  const sent = new Set<string>()
  for (let i = 0; i <= answers.size; i++) {
    const state = await getState(graphql, appRequestId)
    const available = state.applications.flatMap(a => a.requirements.filter(r => r.status === 'PENDING').flatMap(r => r.prompts.filter(p => p.visibility === 'AVAILABLE' && answers.has(p.key) && !sent.has(p.key))))
    if (!available.length) return
    for (const prompt of available) {
      if (sent.has(prompt.key)) continue
      sent.add(prompt.key)
      for (const value of answers.get(prompt.key)!.values()) {
        const response = await graphql<{ updatePrompt?: { success: boolean, messages: { message: string }[] }, errors?: { message: string }[] }>(updatePromptMutation, { promptId: prompt.id, data: value })
        expect(response.errors, `${prompt.key}: ${JSON.stringify(response.errors)}`).toBeUndefined()
        expect(response.updatePrompt!.success, `${prompt.key}: ${response.updatePrompt!.messages.map(m => m.message).join('; ')}`).toEqual(true)
      }
    }
  }
}

const requestAction = (name: string) => `mutation ($appRequestId: ID!) { ${name}(appRequestId: $appRequestId) { success messages { message } } }`
const applicationAction = (name: string) => `mutation ($applicationId: ID!) { ${name}(applicationId: $applicationId) { success messages { message } } }`
/** The fixture hands back `{ data, errors }` instead of `data` when the API refuses, so both shapes are checked. */
async function expectAction (graphql: Graphql, name: string, mutation: string, variables: Record<string, any>) {
  const response = await graphql<any>(mutation, variables)
  expect(response.errors, `${name}: ${JSON.stringify(response.errors)}`).toBeUndefined()
  expect(response[name].success, `${name}: ${response[name].messages.map((m: { message: string }) => m.message).join('; ')}`).toEqual(true)
}
async function expectRefused (graphql: Graphql, name: string, mutation: string, variables: Record<string, any>) {
  const response = await graphql<any>(mutation, variables)
  expect(response.errors ?? [], `${name} should have been refused`).not.toHaveLength(0)
}

/**
 * The API caches which periods carry acceptance and non-blocking workflow (util/auth.ts) and only refreshes on the
 * cache's own clock, so a period created by a spec would still read as having neither and completeReview would skip
 * straight to COMPLETE. The demo's seeded period has been in that cache since startup, and no other spec uses it.
 */
async function seededPeriodId (graphql: Graphql) {
  const { periods } = await graphql<{ periods: { id: number, code: string }[] }>('{ periods { id code } }')
  const seeded = periods.find(period => period.code === '2025 Sem 1')
  expect(seeded, 'the complex demo seeds period "2025 Sem 1" in testdata.ts').toBeDefined()
  return seeded!.id
}

/** Create a request for `login`, qualify for every program and submit it. Returns the request id. */
async function submitQualifiedRequest (graphql: Graphql, login: string, periodId: number) {
  const create = `
    mutation CreateAppRequest($login: String!, $periodId: ID!) {
      createAppRequest(login: $login, periodId: $periodId, validateOnly: false) { appRequest { id } messages { message } }
    }
  `
  const { createAppRequest } = await graphql<{ createAppRequest: { appRequest: { id: number } | null, messages: { message: string }[] } }>(create, { login, periodId })
  expect(createAppRequest.appRequest, createAppRequest.messages.map(m => m.message).join('; ')).not.toBeNull()
  const appRequestId = createAppRequest.appRequest!.id
  await answerAvailable(graphql, appRequestId, promptMapApplicantQualified)
  await expectAction(graphql, 'submitAppRequest', requestAction('submitAppRequest'), { appRequestId })
  const state = await getState(graphql, appRequestId)
  expect(state.phase).toEqual('SUBMITTED')
  for (const app of state.applications) expect(app.status, app.programKey).toEqual('PENDING')
  return appRequestId
}

/**
 * Walk every READY_FOR_WORKFLOW application through its blocking stages: dog and foster each have one (a denied
 * application is not exempt from it), cat has none and goes straight to REVIEW_COMPLETE.
 */
async function finishBlockingWorkflow (graphql: Graphql, appRequestId: number) {
  for (let i = 0; i < 4; i++) {
    const state = await getState(graphql, appRequestId)
    const advancing = state.applications.filter(a => a.phase === 'READY_FOR_WORKFLOW')
    if (!advancing.length) break
    for (const app of advancing) await expectAction(graphql, 'advanceWorkflow', applicationAction('advanceWorkflow'), { applicationId: app.id })
    await answerAvailable(graphql, appRequestId, promptMapApproveReviewerQualified)
  }
  const state = await getState(graphql, appRequestId)
  for (const app of state.applications) expect(app.phase, app.programKey).toEqual('REVIEW_COMPLETE')
  expect(state.status).toEqual('REVIEW_COMPLETE')
}

const cat = 'adopt_a_cat_program'
const dog = 'adopt_a_dog_program'
const foster = 'foster_a_pet_program'

test.describe.serial('Non-blocking workflow is owed by an application denied in review', { tag: '@complex' }, () => {
  let appRequestId = 0

  test('Applicant - qualify for all three programs and submit', async ({ adminRequest, applicantRequest }) => {
    appRequestId = await submitQualifiedRequest(applicantRequest.graphql, 'applicant', await seededPeriodId(adminRequest.graphql))
  })

  test('Reviewer - deny the cat application (and with it foster), approve the dog', async ({ reviewerRequest }) => {
    await answerAvailable(reviewerRequest.graphql, appRequestId, promptMapReviewerCatDenied)
    const state = await getState(reviewerRequest.graphql, appRequestId)
    for (const denied of [cat, foster]) {
      expect(application(state, denied).status, denied).toEqual('INELIGIBLE')
      expect(application(state, denied).ineligiblePhase, denied).toEqual('APPROVAL')
    }
    expect(application(state, dog).status).toEqual('ELIGIBLE')
    for (const app of state.applications) expect(app.phase, app.programKey).toEqual('READY_FOR_WORKFLOW')
  })

  test('Reviewer - walk every application through blocking workflow and complete the review', async ({ reviewerRequest }) => {
    await finishBlockingWorkflow(reviewerRequest.graphql, appRequestId)
    await expectAction(reviewerRequest.graphql, 'completeReview', requestAction('completeReview'), { appRequestId })
    expect((await getState(reviewerRequest.graphql, appRequestId)).phase).toEqual('ACCEPTANCE')
  })

  test('Applicant - accept the offer, which starts non-blocking workflow', async ({ applicantRequest }) => {
    await answerAvailable(applicantRequest.graphql, appRequestId, promptMapApplicantAcceptance)
    expect((await getState(applicantRequest.graphql, appRequestId)).status).toEqual('READY_TO_ACCEPT')
    await expectAction(applicantRequest.graphql, 'acceptOffer', requestAction('acceptOffer'), { appRequestId })
    const state = await getState(applicantRequest.graphql, appRequestId)
    expect(state.phase).toEqual('WORKFLOW_NONBLOCKING')
    expect(application(state, dog).status).toEqual('ACCEPTED')
    // a denial that predates the offer is not a declined offer: the acceptance phase must not relabel it
    for (const denied of [cat, foster]) {
      expect(application(state, denied).status, denied).toEqual('INELIGIBLE')
      expect(application(state, denied).ineligiblePhase, denied).toEqual('APPROVAL')
    }
  })

  test('Reviewer - the denied application still owes its non-blocking stage, so the request cannot complete', async ({ reviewerRequest }) => {
    // send everything except the cat to complete first, so the cat is the only thing that can be holding the request
    let state = await getState(reviewerRequest.graphql, appRequestId)
    for (const app of state.applications.filter(a => a.programKey !== cat && a.phase === 'READY_FOR_WORKFLOW')) {
      await expectAction(reviewerRequest.graphql, 'advanceWorkflow', applicationAction('advanceWorkflow'), { applicationId: app.id })
    }
    state = await getState(reviewerRequest.graphql, appRequestId)
    for (const other of [dog, foster]) expect(['READY_TO_COMPLETE', 'COMPLETE'], other).toContain(application(state, other).phase)
    // the denied cat is held by its PENDING non-blocking requirement, whose prompt is open to the reviewer
    expect(application(state, cat).phase).toEqual('WORKFLOW_NONBLOCKING')
    const microchip = requirement(state, cat, 'confirm_cat_microchip_service_workflow_req')
    expect(microchip.status).toEqual('PENDING')
    expect(microchip.prompts.find(p => p.key === 'confirm_cat_microchip_service_prompt')?.visibility).toEqual('AVAILABLE')
    // mayCompleteRequest is readyToComplete plus permission, and the reviewer has the permission
    expect(state.actions.completeRequest).toEqual(false)
    await expectRefused(reviewerRequest.graphql, 'completeRequest', requestAction('completeRequest'), { appRequestId })
  })

  test('Reviewer - answering the non-blocking stage releases the request to complete', async ({ reviewerRequest }) => {
    await answerAvailable(reviewerRequest.graphql, appRequestId, promptMapReviewerNonBlocking)
    let state = await getState(reviewerRequest.graphql, appRequestId)
    expect(requirement(state, cat, 'confirm_cat_microchip_service_workflow_req').status).toEqual('MET')
    expect(application(state, cat).phase).toEqual('READY_FOR_WORKFLOW')
    // in the non-blocking phase advancing is the single "send to complete" action
    await expectAction(reviewerRequest.graphql, 'advanceWorkflow', applicationAction('advanceWorkflow'), { applicationId: application(state, cat).id })
    state = await getState(reviewerRequest.graphql, appRequestId)
    expect(application(state, cat).phase).toEqual('COMPLETE')
    expect(state.actions.completeRequest).toEqual(true)
    await expectAction(reviewerRequest.graphql, 'completeRequest', requestAction('completeRequest'), { appRequestId })
    state = await getState(reviewerRequest.graphql, appRequestId)
    expect(state.phase).toEqual('COMPLETE')
    // one accepted application makes the request ACCEPTED; the denied ones must not drag it to NOT_ACCEPTED
    expect(state.status).toEqual('ACCEPTED')
  })
})

test.describe.serial('A request denied entirely in review reads Ineligible, not Offer declined', { tag: '@complex' }, () => {
  let appRequestId = 0

  test('Applicant2 - qualify for all three programs and submit', async ({ adminRequest, applicant2Request }) => {
    appRequestId = await submitQualifiedRequest(applicant2Request.graphql, 'applicant2', await seededPeriodId(adminRequest.graphql))
  })

  test('Reviewer - deny every application in review', async ({ reviewerRequest }) => {
    await answerAvailable(reviewerRequest.graphql, appRequestId, promptMapReviewerAllDenied)
    const state = await getState(reviewerRequest.graphql, appRequestId)
    for (const app of state.applications) {
      expect(app.status, app.programKey).toEqual('INELIGIBLE')
      expect(app.ineligiblePhase, app.programKey).toEqual('APPROVAL')
      expect(app.phase, app.programKey).toEqual('READY_FOR_WORKFLOW')
    }
  })

  test('Reviewer - finish blocking workflow and complete the review', async ({ reviewerRequest }) => {
    await finishBlockingWorkflow(reviewerRequest.graphql, appRequestId)
    await expectAction(reviewerRequest.graphql, 'completeReview', requestAction('completeReview'), { appRequestId })
  })

  test('The request is Ineligible (NOT_APPROVED) and every application stays denied at APPROVAL', async ({ reviewerRequest }) => {
    const state = await getState(reviewerRequest.graphql, appRequestId)
    // the period has an acceptance phase, so the request enters it even though there is nothing to offer
    expect(state.phase).toEqual('ACCEPTANCE')
    for (const app of state.applications) {
      expect(app.status, app.programKey).toEqual('INELIGIBLE')
      expect(app.ineligiblePhase, app.programKey).toEqual('APPROVAL')
    }
    // NOT_ACCEPTED means the applicant declined an offer; nobody here was offered anything
    expect(state.status).toEqual('NOT_APPROVED')
  })
})
