import { DateTime } from 'luxon'
import { expect, test } from './fixtures.js'
import { promptMapApplicantQualified } from './default.promptdata.js'

/**
 * The reviewer screen groups an application's requirements into panels. Without a layout the panels are
 * type-based; the default demo's cat program declares one custom panel ("Other cats in the home") that
 * pairs the applicant's other-cats answer with the reviewer's vaccine check, and leaves
 * `applicant_seems_nice_req` unplaced so it falls into the trailing "Reviewer Questions" panel.
 */
test.describe.serial('Reviewer screen panels follow the program\'s reviewSections', { tag: '@default' }, () => {
  const timeZone = 'America/Chicago'
  const stamp = Date.now()
  const periodName = `Reviewer Screen Layout Period ${stamp}`
  const periodCode = `RSL${stamp}`
  const openDate = DateTime.now().setZone(timeZone).minus({ days: 1 }).toISO()
  const closeDate = DateTime.now().setZone(timeZone).plus({ days: 1 }).toISO()

  let periodId = 0
  let appRequestId = 0
  const programKey = 'adopt_a_cat_program'

  test('Admin - create period', async ({ adminRequest }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate: DateTime!, $closeDate: DateTime!) {
        createPeriod(period: { name: $name, code: $code, openDate: $openDate, closeDate: $closeDate }, validateOnly: false) {
          period { id }
          messages { message }
        }
      }
    `
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { period: { id: number }, messages: { message: string }[] } }>(query, { name: periodName, code: periodCode, openDate, closeDate })
    periodId = createPeriod.period.id
    expect(periodId).toBeTruthy()
  })

  test('Admin - mark period reviewed', async ({ adminRequest }) => {
    const query = `
      mutation MarkPeriodReviewed($periodId: ID!) {
        markPeriodReviewed(periodId: $periodId) { period { id reviewed } messages { message } }
      }
    `
    const { markPeriodReviewed } = await adminRequest.graphql<{ markPeriodReviewed: { period: { reviewed: boolean } } }>(query, { periodId })
    expect(markPeriodReviewed.period.reviewed).toEqual(true)
  })

  test('Applicant - create, answer and submit app request', async ({ applicantRequest }) => {
    const create = `
      mutation CreateAppRequest($login: String!, $periodId: ID!) {
        createAppRequest(login: $login, periodId: $periodId, validateOnly: false) {
          appRequest { id }
          messages { message }
        }
      }
    `
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: number } | null, messages: { message: string }[] } }>(create, { login: 'applicant', periodId })
    expect(createAppRequest.appRequest, createAppRequest.messages.map(m => m.message).join('; ')).not.toBeNull()
    appRequestId = createAppRequest.appRequest!.id

    const getPrompts = `
      query GetPrompts($appRequestIds: [ID!]) {
        appRequests(filter: { ids: $appRequestIds }) {
          applications { requirements { prompts { id key answered visibility } } }
        }
      }
    `
    const updatePrompt = `
      mutation UpdatePrompt($promptId: ID!, $data: JsonData!) {
        updatePrompt(promptId: $promptId, data: $data, validateOnly: false) { success messages { message } }
      }
    `
    // prompts are revealed one requirement at a time, so keep answering until nothing is left
    for (let i = 0; i < promptMapApplicantQualified.size; i++) {
      const response = await applicantRequest.graphql<{ appRequests: { applications: { requirements: { prompts: { id: number, key: string, answered: boolean, visibility: string }[] }[] }[] }[] }>(getPrompts, { appRequestIds: [appRequestId] })
      const available = response.appRequests.flatMap(r => r.applications.flatMap(a => a.requirements.flatMap(req => req.prompts.filter(p => !p.answered && p.visibility === 'AVAILABLE'))))
      if (available.length === 0) break
      for (const prompt of available) {
        for (const value of promptMapApplicantQualified.get(prompt.key)?.values() ?? []) {
          const { updatePrompt: result } = await applicantRequest.graphql<{ updatePrompt: { success: boolean } }>(updatePrompt, { promptId: prompt.id, data: value })
          expect(result.success).toEqual(true)
        }
      }
    }

    const submit = `
      mutation SubmitAppRequest($appRequestId: ID!) {
        submitAppRequest(appRequestId: $appRequestId) { success messages { message } }
      }
    `
    const { submitAppRequest } = await applicantRequest.graphql<{ submitAppRequest: { success: boolean } }>(submit, { appRequestId })
    expect(submitAppRequest.success).toEqual(true)
  })

  test('Reviewer - API returns the cat program\'s layout', async ({ reviewerRequest }) => {
    const query = `
      query GetReviewSections($appRequestIds: [ID!]) {
        appRequests(filter: { ids: $appRequestIds }) {
          applications { programKey reviewSections { title requirementKeys workflowStageKey section } }
        }
      }
    `
    const { appRequests } = await reviewerRequest.graphql<{ appRequests: { applications: { programKey: string, reviewSections: { title: string | null, requirementKeys: string[] | null, workflowStageKey: string | null, section: string | null }[] }[] }[] }>(query, { appRequestIds: [appRequestId] })
    const cat = appRequests[0].applications.find(a => a.programKey === programKey)!
    expect(cat.reviewSections).toEqual([
      { title: null, requirementKeys: null, workflowStageKey: null, section: 'GENERAL' },
      { title: null, requirementKeys: null, workflowStageKey: null, section: 'PROGRAM' },
      { title: 'Other cats in the home', requirementKeys: ['other_cats_applicant_req', 'other_cats_reviewer_req'], workflowStageKey: null, section: null }
    ])
    const dog = appRequests[0].applications.find(a => a.programKey === 'adopt_a_dog_program')!
    expect(dog.reviewSections).toEqual([])
  })

  test('Reviewer - custom panel sits between the program panel and Reviewer Questions', async ({ reviewerPage }) => {
    await reviewerPage.goto(`/requests/${appRequestId}/approve/${programKey}`)
    const panels = reviewerPage.locator('.panel')
    await expect(panels.first()).toBeVisible()
    const titles = await panels.locator('.panel-header').allInnerTexts()
    expect(titles.map(t => t.trim())).toEqual(['General Questions', 'Adopt a Cat', 'Other cats in the home', 'Reviewer Questions'])

    // the applicant's other-cats answer left the program panel for the custom one...
    const customPanel = panels.filter({ has: reviewerPage.locator('.panel-header', { hasText: 'Other cats in the home' }) })
    await expect(customPanel.locator('dt', { hasText: 'Do you have other cats?' }).first()).toBeVisible()
    const programPanel = panels.filter({ has: reviewerPage.locator('.panel-header', { hasText: 'Adopt a Cat' }) })
    await expect(programPanel.locator('dt', { hasText: 'Do you have other cats?' })).toHaveCount(0)
    await expect(programPanel.locator('dt', { hasText: 'Tuna Allergy' })).toBeVisible()

    // ...while the unplaced reviewer requirement trails in the default reviewer panel, even though it is
    // the last key in requirementKeys - the case the old interleaving heuristic got wrong
    const reviewerPanel = panels.filter({ has: reviewerPage.locator('.panel-header', { hasText: 'Reviewer Questions' }) })
    await expect(reviewerPanel.locator('dt', { hasText: 'Assess Applicant\'s Niceness' })).toBeVisible()
    await expect(customPanel.locator('dt', { hasText: 'Assess Applicant\'s Niceness' })).toHaveCount(0)
  })

  test('Reviewer - a program without a layout renders the type-based panels only', async ({ reviewerPage }) => {
    await reviewerPage.goto(`/requests/${appRequestId}/approve/adopt_a_dog_program`)
    const panels = reviewerPage.locator('.panel')
    await expect(panels.first()).toBeVisible()
    const titles = (await panels.locator('.panel-header').allInnerTexts()).map(t => t.trim())
    expect(titles).toEqual(['General Questions', 'Adopt a Dog'])
  })
})
