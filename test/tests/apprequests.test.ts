import { Hash } from 'crypto'
import { expect, test } from './fixtures.js'
import { DateTime } from 'luxon'
import { promptMapPass, promptMapFail } from './promptdata.js'

test.describe('App Request workflows', () => {
  const name = '2025 app-req'
  const code = 'APP_REQ_PER-255'
  const openDate = '2025-07-01T00:00:00.000-05:00'
  const closeDate = '2025-09-01T00:00:00.000-05:00'
  const applicantLogin = 'applicant'
  const timeZone = 'America/Chicago'
  let periodId = 0
  test('Admin - Create new period for appRequests', async ({ adminRequest }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate:DateTime!, $closeDate:DateTime!){
        createPeriod(period:{ name: $name, code: $code, openDate: $openDate, closeDate: $closeDate}, validateOnly: false) {
          period {
            id
            name
            code
            openDate
            closeDate
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { name, code, openDate, closeDate }
    //  NOTE: Styled differently from other destructured request examples as this was an early deadlock hit
    const response = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, closeDate: string }, messages: { message: string }[] } }>(query, variables)
    // console.log(`Response is ${JSON.stringify(response)}`)
    periodId = response.createPeriod.period.id
    expect(response.createPeriod.period.name).toEqual(name)
    expect(response.createPeriod.period.code).toEqual(code)
    expect(response.createPeriod.period.openDate).toEqual(openDate)
    expect(response.createPeriod.period.closeDate).toEqual(closeDate)
  })
  test('Applicant - create app request in UNreviewed period', async ({ applicantRequest }) => {
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
    const variables = { login: applicantLogin, periodId, validateOnly: false }
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, variables)
    expect(createAppRequest.messages[0].message.includes('is not currently accepting requests.')).toEqual(true)
  })
  test('Admin - set app request period to reviewed and past close date', async ({ adminRequest }) => {
    const query = `
      mutation UpdatePeriod($periodId: ID!, $name: String!, $code: String, $openDate:DateTime!, $closeDate:DateTime!, $reviewed:Boolean){
        updatePeriod(periodId: $periodId, update:{ name: $name, code: $code, openDate: $openDate, closeDate: $closeDate, reviewed:$reviewed }, validateOnly: false) {
          period {
            id
            name
            code
            openDate
            closeDate
            archiveDate
            reviewed
          }
          messages {
            message
          }
        }
      }
    `
    const pastCloseDate = '2025-08-01T00:00:00.000-05:00'
    const variables = { periodId, name, code, openDate, closeDate: pastCloseDate, reviewed: true }
    const { updatePeriod } = await adminRequest.graphql<{ updatePeriod: { period: { id: number, name: string, code: string, closeDate: string, openDate: string, archiveDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    expect(updatePeriod.period.id).toEqual(periodId)
    expect(updatePeriod.period.reviewed).toEqual(true)
    expect(updatePeriod.period.closeDate).toEqual(pastCloseDate)
  })
  test('Applicant - create app request in reviewed but closed period', async ({ applicantRequest }) => {
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
    const variables = { login: applicantLogin, periodId, validateOnly: false }
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, variables)
    expect(createAppRequest.messages[0].message.includes('is not currently accepting requests.')).toEqual(true)
  })
  test('Admin - set app request period close date in future', async ({ adminRequest }) => {
    const query = `
      mutation UpdatePeriod($periodId: ID!, $name: String!, $code: String, $openDate:DateTime!, $closeDate:DateTime!, $reviewed:Boolean){
        updatePeriod(periodId: $periodId, update:{ name: $name, code: $code, openDate: $openDate, closeDate: $closeDate, reviewed:$reviewed }, validateOnly: false) {
          period {
            id
            name
            code
            openDate
            closeDate
            archiveDate
            reviewed
          }
          messages {
            message
          }
        }
      }
    `
    const beforeCloseDate = DateTime.fromISO('2025-12-01T01:00:00.000-05:00').setZone(timeZone).toISO()
    const variables = { periodId, name, code, openDate, closeDate: beforeCloseDate, reviewed: true }
    const { updatePeriod } = await adminRequest.graphql<{ updatePeriod: { period: { id: number, name: string, code: string, closeDate: string, openDate: string, archiveDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    expect(updatePeriod.period.id).toEqual(periodId)
    expect(updatePeriod.period.reviewed).toEqual(true)
    expect(updatePeriod.period.closeDate).toEqual(beforeCloseDate)
  })
  let appRequestId = 0
  test('Applicant - create app request in reviewed period', async ({ applicantRequest }) => {
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
    const variables = { login: applicantLogin, periodId, validateOnly: false }
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, variables)
    appRequestId = createAppRequest.appRequest.id
    expect(createAppRequest.appRequest.applicant.login).toEqual(applicantLogin)
  })
  test('Applicant - create app request in SAME reviewed period', async ({ applicantRequest }) => {
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
    const variables = { login: applicantLogin, periodId, validateOnly: false }
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, variables)
    expect(createAppRequest.messages[0].message.includes('A request already exists in')).toEqual(true)
  })
  test('Sudoer - create app request on behalf of applicant after applicant already created own', async ({ suRequest }) => {
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
    const variables = { login: applicantLogin, periodId, validateOnly: false }
    const { createAppRequest } = await suRequest.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, variables)
    expect(createAppRequest.messages[0].message.includes('A request already exists in')).toEqual(true)
  })

  test('Applicant - recurring update all available prompts with FAILING data', async ({ applicantRequest }) => {
    let promptsExist = true
    let promptIteration = 0
    while (promptsExist && (promptIteration < promptMapPass.size)) {
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
        mutation UpdatePrompt($promptId: ID!,$data: JsonData!,$validateOnly: Boolean, $dataVersion: Float){
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
      const { appRequests } = await applicantRequest.graphql<{ appRequests: { applications: { programKey: string, requirements: { smartTitle: string, prompts: { id: number, key: string, answered: string, visibility: string }[] }[] }[] }[] }>(query_get_prompts, query_get_prompt_variables)
      expect(appRequests[0].applications.length).toBeGreaterThanOrEqual(1)

      const allPrompts = appRequests.flatMap(appReq => appReq.applications.flatMap(app => app.requirements.flatMap(req => req.prompts.filter(prompt => prompt.visibility === 'AVAILABLE'))))
      if (allPrompts.length < 1) promptsExist = false
      // update unanswered available prompts
      for (const availablePrompt of allPrompts) {
        const promptMap = promptMapFail.get(availablePrompt.key)
        if (promptMap) { // only test if map to valid prompt data exists
          for (const value of promptMap) {
            console.log(`***Fail data ${JSON.stringify(value[1])}`)
            console.log(`***Add fail data to prompt ${availablePrompt.key}`)
            const query_update_prompt_variables = { promptId: availablePrompt.id, data: value[1], validateOnly: false }
            const response = await applicantRequest.graphql<{ updatePrompt: { success: boolean, messages: { message: string }[] } }>(query_update_prompt, query_update_prompt_variables)
            console.log(`Fail response: ${JSON.stringify(response)}`)
            expect(response.updatePrompt.success).toEqual(false)
          }
        }
      }
    }
  })

  test('Applicant - recurring update next available and not answered prompts with passing data', async ({ applicantRequest }) => {
    let availableUnasweredPromptsExist = true
    let promptIteration = 0
    while (availableUnasweredPromptsExist && (promptIteration < promptMapPass.size)) {
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
        mutation UpdatePrompt($promptId: ID!,$data: JsonData!,$validateOnly: Boolean, $dataVersion: Float){
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
      console.log(`Success response: ${JSON.stringify(response)}`)
      expect(response.appRequests[0].applications.length).toBeGreaterThanOrEqual(1)

      const allAvailableUnansweredPrompts = response.appRequests.flatMap(appReq => appReq.applications.flatMap(app => app.requirements.flatMap(req => req.prompts.filter(prompt => !prompt.answered && prompt.visibility === 'AVAILABLE'))))
      if (allAvailableUnansweredPrompts.length < 1) availableUnasweredPromptsExist = false
      // update unanswered available prompts
      for (const availablePrompt of allAvailableUnansweredPrompts) {
        const promptMap = promptMapPass.get(availablePrompt.key)
        if (promptMap) { // only test if map to valid prompt data exists
          for (const value of promptMap) {
            console.log(`***Add pass data to prompt ${availablePrompt.key}`)
            const query_update_prompt_variables = { promptId: availablePrompt.id, data: value[1], validateOnly: false }
            const { updatePrompt } = await applicantRequest.graphql<{ updatePrompt: { success: boolean, messages: { message: string }[] } }>(query_update_prompt, query_update_prompt_variables)
            expect(updatePrompt.success).toEqual(true)
          }
        }
      }
    }
  })
})
