import { expect } from './fixtures.js'
import { promptMapApplicantQualified } from './default.promptdata.js'

interface RequestHelpers { graphql: <T = any>(query: string, variables?: Record<string, any>) => Promise<T> }

/**
 * Creates a request for `login` in `periodId`, answers every applicant prompt with the default demo's
 * qualifying answers, submits it, then closes it as the reviewer. Returns the request id. Closing after
 * submission keeps the request's status and adds the request-level Closed flag.
 */
export async function createSubmittedClosedRequest (applicant: RequestHelpers, reviewer: RequestHelpers, login: string, periodId: string) {
  const { createAppRequest } = await applicant.graphql<{ createAppRequest: { appRequest: { id: string } | null, messages: { message: string }[] } }>(`
    mutation CreateAppRequest($login: String!, $periodId: ID!) {
      createAppRequest(login: $login, periodId: $periodId, validateOnly: false) { appRequest { id } messages { message } }
    }
  `, { login, periodId })
  expect(createAppRequest.appRequest, createAppRequest.messages.map(m => m.message).join('; ')).not.toBeNull()
  const appRequestId = createAppRequest.appRequest!.id

  const getPrompts = `
    query GetPrompts($appRequestIds: [ID!]) {
      appRequests(filter: { ids: $appRequestIds }) { applications { requirements { prompts { id key answered visibility } } } }
    }
  `
  const updatePrompt = `
    mutation UpdatePrompt($promptId: ID!, $data: JsonData!) {
      updatePrompt(promptId: $promptId, data: $data, validateOnly: false) { success messages { message } }
    }
  `
  // prompts are revealed one requirement at a time, so keep answering until nothing is left
  for (let i = 0; i < promptMapApplicantQualified.size; i++) {
    const response = await applicant.graphql<{ appRequests: { applications: { requirements: { prompts: { id: string, key: string, answered: boolean, visibility: string }[] }[] }[] }[] }>(getPrompts, { appRequestIds: [appRequestId] })
    const available = response.appRequests.flatMap(r => r.applications.flatMap(a => a.requirements.flatMap(req => req.prompts.filter(p => !p.answered && p.visibility === 'AVAILABLE'))))
    if (available.length === 0) break
    for (const prompt of available) {
      for (const value of promptMapApplicantQualified.get(prompt.key)?.values() ?? []) {
        const { updatePrompt: result } = await applicant.graphql<{ updatePrompt: { success: boolean } }>(updatePrompt, { promptId: prompt.id, data: value })
        expect(result.success).toEqual(true)
      }
    }
  }

  const { submitAppRequest } = await applicant.graphql<{ submitAppRequest: { success: boolean, messages: { message: string }[] } }>(`
    mutation SubmitAppRequest($appRequestId: ID!) { submitAppRequest(appRequestId: $appRequestId) { success messages { message } } }
  `, { appRequestId })
  expect(submitAppRequest.success, submitAppRequest.messages.map(m => m.message).join('; ')).toEqual(true)

  const { closeAppRequest } = await reviewer.graphql<{ closeAppRequest: { success: boolean, messages: { message: string }[] } }>(`
    mutation CloseAppRequest($appRequestId: ID!) { closeAppRequest(appRequestId: $appRequestId) { success messages { message } } }
  `, { appRequestId })
  expect(closeAppRequest.success, closeAppRequest.messages.map(m => m.message).join('; ')).toEqual(true)
  return appRequestId
}
