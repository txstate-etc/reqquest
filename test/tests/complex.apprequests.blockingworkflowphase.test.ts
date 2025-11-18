import { Hash } from 'crypto'
import { expect, test } from './fixtures.js'
import { DateTime } from 'luxon'
import { promptMapApplicantQualified, promptMapReviewerQualified, promptMapReviewerUnqualified } from './default.promptdata.js'

// TODO:  Skip until valid tests complete
test.describe.skip('App Request - Blocking workflow Phase - workflows', { tag: '@complex' }, () => {
  const name = '2025 app-req Blocking workflow Phase'
  const code = 'APP_REQ_Block_Work-255'
  const timeZone = 'America/Chicago'
  const dateTomorrow = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setMilliseconds(0)).toISOString()
  const openDate = '2025-07-01T00:00:00.000-05:00'
  const closeDate = DateTime.fromISO(dateTomorrow).setZone(timeZone).toISO()
  const applicantbwLogin = 'applicantbw'
  let periodId = 0
  test('Admin - Create new period for blocking workflow phase appRequests', async ({ adminRequest }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate:DateTime!, $closeDate:DateTime!, $reviewed:Boolean){
        createPeriod(period:{ name: $name, code: $code, openDate: $openDate, closeDate: $closeDate, reviewed: $reviewed}, validateOnly: false) {
          period {
            id
            name
            code
            openDate
            closeDate
            reviewed
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { name, code, openDate, closeDate, reviewed: true }
    const response = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, closeDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    periodId = response.createPeriod.period.id
    expect(response.createPeriod.period.name).toEqual(name)
    expect(response.createPeriod.period.code).toEqual(code)
    expect(response.createPeriod.period.openDate).toEqual(openDate)
    expect(response.createPeriod.period.closeDate).toEqual(closeDate)
    expect(response.createPeriod.period.reviewed).toEqual(true)
  })
  let appRequestId = 0
  test('Applicant - create app request in blocking workflow reviewed period', async ({ applicantRequest }) => {
    const query = `
      mutation CreateAppRequest($login:String!, $periodId: ID!, $validateOnly: Boolean) {
        createAppRequest(login: $login, periodId:$periodId, validateOnly: $validateOnly) {
          appRequest {
            id
            applicant {
              login
            }
          }
          messages{
            message
          }
        }
      }
    `
    const variables = { login: applicantbwLogin, periodId, validateOnly: false }
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, variables)
    appRequestId = createAppRequest.appRequest.id
    expect(createAppRequest.appRequest.applicant.login).toEqual(applicantbwLogin)
  })
  test('Applicant - recurring update next available and not answered prompts with qualified data', async ({ applicantRequest }) => {
    let availableUnasweredPromptsExist = true
    let promptIteration = 0
    while (availableUnasweredPromptsExist && (promptIteration < promptMapApplicantQualified.size)) {
      promptIteration++
      const query_get_prompts = `
        query GetPromptsForRequest($appRequestIds: [ID!]) {
          appRequests(filter: {ids:$appRequestIds}) {
            applications {
              programKey
              requirements {
                smartTitle
                prompts {
                  id
                  key
                  title
                  navTitle
                  answered
                  visibility
                }
              }
            }
          }
        }
      `
      const query_update_prompt = `
        mutation UpdatePrompt($promptId: ID!,$data: JsonData!,$validateOnly: Boolean, $dataVersion: Int){
          updatePrompt(promptId:$promptId, data:$data, validateOnly:$validateOnly, dataVersion: $dataVersion){
            success
            messages {
              message
              type
              arg
            }
          }
        }
      `
      const query_get_prompt_variables = { appRequestIds: [appRequestId] }
      const response = await applicantRequest.graphql<{ appRequests: { applications: { programKey: string, requirements: { smartTitle: string, prompts: { id: number, key: string, answered: string, visibility: string }[] }[] }[] }[] }>(query_get_prompts, query_get_prompt_variables)
      expect(response.appRequests[0].applications.length).toBeGreaterThanOrEqual(1)

      const allAvailableUnansweredPrompts = response.appRequests.flatMap(appReq => appReq.applications.flatMap(app => app.requirements.flatMap(req => req.prompts.filter(prompt => !prompt.answered && prompt.visibility === 'AVAILABLE'))))
      if (allAvailableUnansweredPrompts.length < 1) availableUnasweredPromptsExist = false
      // update unanswered available prompts
      for (const availablePrompt of allAvailableUnansweredPrompts) {
        const promptMapApplicant = promptMapApplicantQualified.get(availablePrompt.key)
        if (promptMapApplicant) { // only test if map to valid prompt data exists
          for (const value of promptMapApplicant) {
            const query_update_prompt_variables = { promptId: availablePrompt.id, data: value[1], validateOnly: false }
            const { updatePrompt } = await applicantRequest.graphql<{ updatePrompt: { success: boolean, messages: { message: string }[] } }>(query_update_prompt, query_update_prompt_variables)
            expect(updatePrompt.success).toEqual(true)
          }
        }
      }
    }
  })
  let lastAppRequestStatus = ''
  test('Applicant - submit app request with passing data', async ({ applicantRequest }) => {
    const query = `
      mutation SubmitAppRequest($appRequestId:ID!) {
        submitAppRequest(appRequestId: $appRequestId) {
          success
          messages{
            message
            arg
            type
          }
          appRequest {
            id
            status
          }
        }
      }
    `
    const variables = { appRequestId }
    const response = await applicantRequest.graphql<{ submitAppRequest: { appRequest: { id: string, status: string }, messages: { arg: String, message: string, type: string }[], success: boolean } }>(query, variables)
    lastAppRequestStatus = response.submitAppRequest.appRequest.status
    expect(response.submitAppRequest.success).toEqual(true)
  })
  // check program eligibility
  test('Applicant - check app request eligibility per program with ALL qualified data', async ({ reviewerRequest }) => {
    const query_get_prompts = `
        query GetPromptsForRequest($appRequestIds: [ID!]) {
          appRequests(filter: {ids:$appRequestIds}) {
            applications {
              status
              programKey
            }
          }
        }
      `
    const query_get_prompt_variables = { appRequestIds: [appRequestId] }
    const response = await reviewerRequest.graphql<{ appRequests: { applications: { programKey: string, status: string }[] }[] }>(query_get_prompts, query_get_prompt_variables)
    for (const app of response.appRequests[0].applications) {
      expect(app.status).toEqual('ELIGIBLE')
    }
  })
})
