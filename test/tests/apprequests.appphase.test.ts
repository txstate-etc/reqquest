import { Hash } from 'crypto'
import { expect, test } from './fixtures.js'
import { DateTime } from 'luxon'
import { promptMapQualified, promptMapUnqualified } from './promptdata.js'

test.describe.skip('App Request - App Phase - workflows', () => {
  const name = '2025 app-req App Phase'
  const code = 'APP_REQ_APP-255'
  const openDate = '2025-07-01T00:00:00.000-05:00'
  const closeDate = '2025-09-01T00:00:00.000-05:00'
  const applicantLogin = 'applicant'
  const applicant2Login = 'applicant2'
  const timeZone = 'America/Chicago'
  let periodId = 0
  test('Admin - Create new period for app phase appRequests', async ({ adminRequest }) => {
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
    const response = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, closeDate: string }, messages: { message: string }[] } }>(query, variables)
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
    while (promptsExist && (promptIteration < promptMapQualified.size)) {
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
      const { appRequests } = await applicantRequest.graphql<{ appRequests: { applications: { programKey: string, requirements: { smartTitle: string, prompts: { id: number, key: string, answered: string, visibility: string }[] }[] }[] }[] }>(query_get_prompts, query_get_prompt_variables)
      expect(appRequests[0].applications.length).toBeGreaterThanOrEqual(1)

      const allPrompts = appRequests.flatMap(appReq => appReq.applications.flatMap(app => app.requirements.flatMap(req => req.prompts.filter(prompt => prompt.visibility === 'AVAILABLE'))))
      if (allPrompts.length < 1) promptsExist = false
      // update unanswered available prompts
      for (const availablePrompt of allPrompts) {
        const promptMap = promptMapUnqualified.get(availablePrompt.key)
        if (promptMap) { // only test if map to valid prompt data exists
          for (const value of promptMap) {
            const query_update_prompt_variables = { promptId: availablePrompt.id, data: value[1], validateOnly: false }
            const response = await applicantRequest.graphql<{ updatePrompt: { success: boolean, messages: { message: string }[] } }>(query_update_prompt, query_update_prompt_variables)
            expect(response.updatePrompt.messages.length).toBeGreaterThanOrEqual(0)
          }
        }
      }
    }
  })

  test('Applicant - submit app request with non passing data', async ({ applicantRequest }) => {
    const query = `
      mutation SubmitAppRequest($appRequestId:ID!) {
        submitAppRequest(appRequestId: $appRequestId) {
          success
          messages{
            message
            arg
            type
          }
        }
      }
    `
    const variables = { appRequestId }
    const response = await applicantRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message.includes('You may not submit this app request.')).toEqual(true)
  })

  test('Applicant - recurring update next available and not answered prompts with passing data', async ({ applicantRequest }) => {
    let availableUnasweredPromptsExist = true
    let promptIteration = 0
    while (availableUnasweredPromptsExist && (promptIteration < promptMapQualified.size)) {
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
        const promptMap = promptMapQualified.get(availablePrompt.key)
        if (promptMap) { // only test if map to valid prompt data exists
          for (const value of promptMap) {
            const query_update_prompt_variables = { promptId: availablePrompt.id, data: value[1], validateOnly: false }
            const { updatePrompt } = await applicantRequest.graphql<{ updatePrompt: { success: boolean, messages: { message: string }[] } }>(query_update_prompt, query_update_prompt_variables)
            expect(updatePrompt.success).toEqual(true)
          }
        }
      }
    }
  })

  test('Applicant - submit app request with non updated and non passing data', async ({ applicantRequest }) => {
    const query = `
      mutation SubmitAppRequest($appRequestId:ID!) {
        submitAppRequest(appRequestId: $appRequestId) {
          success
          messages{
            message
            arg
            type
          }
        }
      }
    `
    const variables = { appRequestId }
    const response = await applicantRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message.includes('You may not submit this app request.')).toEqual(true)
  })

  test('Applicant 2 - create app request for applicant 1 in reviewed period', async ({ applicant2Request }) => {
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
    const response = await applicant2Request.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You may not create requests for other people.')
  })

  let appRequest2Id = 0
  test('Applicant 2 - create app request in reviewed period', async ({ applicant2Request }) => {
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
    const variables = { login: applicant2Login, periodId, validateOnly: false }
    const response = await applicant2Request.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, variables)
    appRequest2Id = response.createAppRequest.appRequest.id
    expect(response.createAppRequest.appRequest.applicant.login).toEqual(applicant2Login)
  })

  test('Applicant 2 - recurring update next available and not answered prompts with passing data', async ({ applicant2Request }) => {
    let availableUnasweredPromptsExist = true
    let promptIteration = 0
    while (availableUnasweredPromptsExist && (promptIteration < promptMapQualified.size)) {
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
      const query_get_prompt_variables = { appRequestIds: [appRequest2Id] }
      const response = await applicant2Request.graphql<{ appRequests: { applications: { programKey: string, requirements: { smartTitle: string, prompts: { id: number, key: string, answered: string, visibility: string }[] }[] }[] }[] }>(query_get_prompts, query_get_prompt_variables)
      expect(response.appRequests[0].applications.length).toBeGreaterThanOrEqual(1)

      const allAvailableUnansweredPrompts = response.appRequests.flatMap(appReq => appReq.applications.flatMap(app => app.requirements.flatMap(req => req.prompts.filter(prompt => !prompt.answered && prompt.visibility === 'AVAILABLE'))))
      if (allAvailableUnansweredPrompts.length < 1) availableUnasweredPromptsExist = false
      // update unanswered available prompts
      for (const availablePrompt of allAvailableUnansweredPrompts) {
        const promptMap = promptMapQualified.get(availablePrompt.key)
        if (promptMap) { // only test if map to valid prompt data exists
          for (const value of promptMap) {
            const query_update_prompt_variables = { promptId: availablePrompt.id, data: value[1], validateOnly: false }
            const { updatePrompt } = await applicant2Request.graphql<{ updatePrompt: { appRequest: { data: any }, success: boolean, messages: { message: string }[] } }>(query_update_prompt, query_update_prompt_variables)
            expect(updatePrompt.success).toEqual(true)
          }
        }
      }
    }
  })

  test('Applicant 2 - close request prior to submit ', async ({ applicant2Request }) => {
    const query = `
      mutation CloseAppRequest($appRequestId: ID!) {
        closeAppRequest(appRequestId: $appRequestId) {
          success
          appRequest {
            status
            statusReason
            closedAt
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await applicant2Request.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You may not close this app request.')
  })
  test.fixme('Reviewer - Close applicant request prior to submit', async ({ reviewerRequest }) => {
    const query = `
      mutation CloseAppRequest($appRequestId: ID!) {
        closeAppRequest(appRequestId: $appRequestId) {
          success
          appRequest {
            status
            statusReason
            closedAt
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await reviewerRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You may not close this app request.')
  })
  test('Applicant 2 - Cancel / withdraw request prior to submit', async ({ applicant2Request }) => {
    const query = `
      mutation CancelAppRequest($appRequestId: ID!) {
        cancelAppRequest(appRequestId:$appRequestId) {
          success
          appRequest {
            status
            statusReason
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await applicant2Request.graphql<{ cancelAppRequest: { success: boolean, appRequest: { status: string, statusReason: string } } }>(query, variables)
    expect(response.cancelAppRequest.success).toEqual(true)
    expect(response.cancelAppRequest.appRequest.status).toEqual('CANCELLED')
  })
  test('Applicant 2 - Cancel / withdraw previously canceled prior to submit', async ({ applicant2Request }) => {
    const query = `
      mutation CancelAppRequest($appRequestId: ID!) {
        cancelAppRequest(appRequestId:$appRequestId) {
          success
          appRequest {
            status
            statusReason
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await applicant2Request.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You may not cancel this app request.')
  })
  // Applicant 2 - submit canceled request - fail
  test('Applicant 2 - submit canceled applicant request', async ({ applicant2Request }) => {
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
    const variables = { appRequestId: appRequest2Id }
    const response = await applicant2Request.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You may not submit this app request.')
  })
  test.fixme('Applicant 2 - Reopen previously canceled app request', async ({ applicant2Request }) => {
    const query = `
      mutation ReOpenAppRequest($appRequestId:ID!) {
        reopenAppRequest(appRequestId:$appRequestId) {
          success
          appRequest{
            status
            statusReason
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await applicant2Request.graphql<{ reopenAppRequest: { success: boolean, appRequest: { status: string, statusReason: string, closedAt: string } } }>(query, variables)
    expect(response.reopenAppRequest.success).toEqual(true)
  })

  test.fixme('Applicant 2 - Cancel / withdraw request prior to submit to allow reviewer reopen', async ({ applicant2Request }) => {
    const query = `
      mutation CancelAppRequest($appRequestId: ID!) {
        cancelAppRequest(appRequestId:$appRequestId) {
          success
          appRequest {
            status
            statusReason
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await applicant2Request.graphql<{ cancelAppRequest: { success: boolean, appRequest: { status: string, statusReason: string } } }>(query, variables)
    expect(response.cancelAppRequest.success).toEqual(true)
    expect(response.cancelAppRequest.appRequest.status).toEqual('CANCELLED')
  })
  test.fixme('Reviewer - Uncancel / reopen applicant request prior to submit', async ({ reviewerRequest }) => {
    const query = `
      mutation ReOpenAppRequest($appRequestId:ID!) {
        reopenAppRequest(appRequestId:$appRequestId) {
          success
          appRequest{
            status
            statusReason
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await reviewerRequest.graphql<{ reopenAppRequest: { success: boolean, appRequest: { status: string, statusReason: string, closedAt: string } } }>(query, variables)
    expect(response.reopenAppRequest.success).toEqual(true)
  })

  let lastAppRequestStatus = ''
  test('Applicant 2 - submit app request with passing data', async ({ applicant2Request }) => {
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
    const variables = { appRequestId: appRequest2Id }
    const response = await applicant2Request.graphql<{ submitAppRequest: { appRequest: { id: string, status: string }, messages: { arg: String, message: string, type: string }[], success: boolean } }>(query, variables)
    lastAppRequestStatus = response.submitAppRequest.appRequest.status
    expect(response.submitAppRequest.success).toEqual(true)
  })
  test('Applicant 2 - Close valid submitted app request that is currently under reviewer purview', async ({ applicant2Request }) => {
    const query = `
      mutation CloseAppRequest($appRequestId: ID!) {
        closeAppRequest(appRequestId: $appRequestId) {
          success
          appRequest {
            status
            statusReason
            closedAt
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await applicant2Request.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You may not close this app request.')
  })
  test('Reviewer - Close valid submitted app request that is currently under reviewer purview', async ({ reviewerRequest }) => {
    const query = `
      mutation CloseAppRequest($appRequestId: ID!) {
        closeAppRequest(appRequestId: $appRequestId) {
          success
          appRequest {
            status
            statusReason
            closedAt
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await reviewerRequest.graphql<{ closeAppRequest: { success: boolean, appRequest: { status: string, statusReason: string, closedAt: string } } }>(query, variables)
    expect(response.closeAppRequest.success).toEqual(true)
  })
  test('Reviewer - Reopen valid submitted app request that is currently under reviewer purview', async ({ reviewerRequest }) => {
    const query = `
      mutation ReOpenAppRequest($appRequestId:ID!) {
        reopenAppRequest(appRequestId:$appRequestId) {
          success
          appRequest{
            status
            statusReason
          }
        }
      }
    `
    const variables = { appRequestId: appRequest2Id }
    const response = await reviewerRequest.graphql<{ reopenAppRequest: { success: boolean, appRequest: { status: string, statusReason: string, closedAt: string } } }>(query, variables)
    expect(response.reopenAppRequest.success).toEqual(true)
    expect(response.reopenAppRequest.appRequest.status).toEqual(lastAppRequestStatus) // confirm status did not change
  })

  // Reviewer - Cancel/Withdraw applicant 2 request - fail
  // Applicant 2 - cancel/withdraw request - pass
  // Applicant 2 - uncancel/unwithdraw request - pass
  // Applicant 2 - cancel/withdraw request to allow reviewer uncancel - pass
  // Reviewer - uncancel/unwithdraw applicant 2 request - pass
  // Applicant - Cancel/Withdraw applicant 2 request - fail
})
