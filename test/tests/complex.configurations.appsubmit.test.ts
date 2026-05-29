import { expect, test } from './fixtures.js'
import { DateTime } from 'luxon'
import { promptMapApplicantQualified } from './complex.promptdata.js'

test.describe.serial('Requirement configurations lock after app request submission', { tag: '@complex' }, () => {
  const name = '2025 Config Lock On Submit'
  const code = 'APP_REQ_REQUIREMENT_CONFIG_LOCK-256'
  const timeZone = 'America/Chicago'
  const dateTomorrow = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setMilliseconds(0)).toISOString()
  const openDate = '2025-08-01T00:00:00.000-05:00'
  const closeDate = DateTime.fromISO(dateTomorrow).setZone(timeZone).toISO()
  const applicantLogin = 'applicant'
  const requirementConfigKey = 'dog_exercise_qual_req'
  let periodId = 0
  let appRequestId = 0

  test('Admin - Create new period for requirement configuration lock testing', async ({ adminRequest }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate:DateTime!, $closeDate:DateTime!){
        createPeriod(period:{ name: $name, code: $code, openDate: $openDate, closeDate: $closeDate}, validateOnly: false) {
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
    const variables = { name, code, openDate, closeDate }
    const response = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, closeDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    periodId = response.createPeriod.period.id
    expect(response.createPeriod.period.name).toEqual(name)
    expect(response.createPeriod.period.code).toEqual(code)
    expect(response.createPeriod.period.reviewed).toEqual(false)
  })

  test('Admin - Verify requirement configurations are configurable in new period', async ({ adminRequest }) => {
    const query = `
      query GetPeriodConfigurations($ids: [ID!]){
        periods(filter: {ids: $ids}) {
          id
          configurations{
            key
            data
            actions {
              view
              update
            }
          }
        }
      }
    `
    const variables = { ids: [periodId] }
    const { periods } = await adminRequest.graphql<{ periods: { id: number, configurations: { key: string, data: any, actions: { view: boolean, update: boolean } }[] }[] }>(query, variables)
    expect(periods[0].id).toEqual(periodId)
    expect(periods[0].configurations.length).toBeGreaterThan(0)
    const targetConfig = periods[0].configurations.find(c => c.key === requirementConfigKey)
    expect(targetConfig).toBeDefined()
    for (const config of periods[0].configurations) {
      expect(config.actions.view).toEqual(true)
      expect(config.actions.update).toEqual(true)
    }
  })

  test('Admin - Update requirement configuration in new (empty) period', async ({ adminRequest }) => {
    const query = `
      mutation UpdatePeriodConfiguration($periodId: ID!, $data: JsonData!, $key: String!, $validateOnly: Boolean) {
        updateConfiguration(periodId:$periodId, data: $data, key: $key, validateOnly: $validateOnly) {
          success
          messages{
            message
            arg
            type
          }
          configuration {
            key
            data
          }
        }
      }
    `
    const data = { minExerciseHoursWeekly: 10 }
    const variables = { periodId, key: requirementConfigKey, data, validateOnly: false }
    const response = await adminRequest.graphql<{ updateConfiguration: { success: boolean, configuration: { key: string, data: { minExerciseHoursWeekly: number } } } }>(query, variables)
    expect(response.updateConfiguration.success).toEqual(true)
    expect(response.updateConfiguration.configuration.data.minExerciseHoursWeekly).toEqual(data.minExerciseHoursWeekly)
  })

  test('Admin - Mark period reviewed to allow app request submission', async ({ adminRequest }) => {
    const query = `
      mutation MarkPeriodReviewed($periodId: ID!){
        markPeriodReviewed(periodId: $periodId) {
          period {
            id
            reviewed
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { periodId }
    const { markPeriodReviewed } = await adminRequest.graphql<{ markPeriodReviewed: { period: { id: number, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    expect(markPeriodReviewed.period.id).toEqual(periodId)
    expect(markPeriodReviewed.period.reviewed).toEqual(true)
  })

  test('Admin - Update requirement configuration in reviewed period prior to any app request submission', async ({ adminRequest }) => {
    const query = `
      mutation UpdatePeriodConfiguration($periodId: ID!, $data: JsonData!, $key: String!, $validateOnly: Boolean) {
        updateConfiguration(periodId:$periodId, data: $data, key: $key, validateOnly: $validateOnly) {
          success
          configuration {
            key
            data
          }
        }
      }
    `
    const data = { minExerciseHoursWeekly: 8 }
    const variables = { periodId, key: requirementConfigKey, data, validateOnly: false }
    const response = await adminRequest.graphql<{ updateConfiguration: { success: boolean, configuration: { key: string, data: { minExerciseHoursWeekly: number } } } }>(query, variables)
    expect(response.updateConfiguration.success).toEqual(true)
    expect(response.updateConfiguration.configuration.data.minExerciseHoursWeekly).toEqual(data.minExerciseHoursWeekly)
  })

  test('Applicant - Create app request in reviewed period', async ({ applicantRequest }) => {
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
    const response = await applicantRequest.graphql<{ createAppRequest: { appRequest: { id: number, applicant: { login: string } }, messages: { message: string }[] } }>(query, variables)
    appRequestId = response.createAppRequest.appRequest.id
    expect(response.createAppRequest.appRequest.applicant.login).toEqual(applicantLogin)
  })

  // test('Applicant - Recurring update next available and not answered prompts with qualified data', async ({ applicantRequest }) => {
  //   let availableUnasweredPromptsExist = true
  //   let promptIteration = 0
  //   while (availableUnasweredPromptsExist && (promptIteration < promptMapApplicantQualified.size)) {
  //     promptIteration++
  //     const query_get_prompts = `
  //       query GetPromptsForRequest($appRequestIds: [ID!]) {
  //         appRequests(filter: {ids:$appRequestIds}) {
  //           applications {
  //             programKey
  //             requirements {
  //               smartTitle
  //               prompts {
  //                 id
  //                 key
  //                 title
  //                 navTitle
  //                 answered
  //                 visibility
  //               }
  //             }
  //           }
  //         }
  //       }
  //     `
  //     const query_update_prompt = `
  //       mutation UpdatePrompt($promptId: ID!,$data: JsonData!,$validateOnly: Boolean, $dataVersion: Int){
  //         updatePrompt(promptId:$promptId, data:$data, validateOnly:$validateOnly, dataVersion: $dataVersion){
  //           success
  //           messages {
  //             message
  //             type
  //             arg
  //           }
  //         }
  //       }
  //     `
  //     const query_get_prompt_variables = { appRequestIds: [appRequestId] }
  //     const response = await applicantRequest.graphql<{ appRequests: { applications: { programKey: string, requirements: { smartTitle: string, prompts: { id: number, key: string, answered: string, visibility: string }[] }[] }[] }[] }>(query_get_prompts, query_get_prompt_variables)
  //     expect(response.appRequests[0].applications.length).toBeGreaterThanOrEqual(1)

  //     const allAvailableUnansweredPrompts = response.appRequests.flatMap(appReq => appReq.applications.flatMap(app => app.requirements.flatMap(req => req.prompts.filter(prompt => !prompt.answered && prompt.visibility === 'AVAILABLE'))))
  //     if (allAvailableUnansweredPrompts.length < 1) availableUnasweredPromptsExist = false
  //     for (const availablePrompt of allAvailableUnansweredPrompts) {
  //       const promptMapApplicant = promptMapApplicantQualified.get(availablePrompt.key)
  //       if (promptMapApplicant) {
  //         for (const value of promptMapApplicant) {
  //           const query_update_prompt_variables = { promptId: availablePrompt.id, data: value[1], validateOnly: false }
  //           const { updatePrompt } = await applicantRequest.graphql<{ updatePrompt: { success: boolean, messages: { message: string }[] } }>(query_update_prompt, query_update_prompt_variables)
  //           expect(updatePrompt.success).toEqual(true)
  //         }
  //       }
  //     }
  //   }
  // })

  // test('Applicant - Submit app request with passing data', async ({ applicantRequest }) => {
  //   const query = `
  //     mutation SubmitAppRequest($appRequestId:ID!) {
  //       submitAppRequest(appRequestId: $appRequestId) {
  //         success
  //         messages{
  //           message
  //           arg
  //           type
  //         }
  //         appRequest {
  //           id
  //           status
  //         }
  //       }
  //     }
  //   `
  //   const variables = { appRequestId }
  //   const response = await applicantRequest.graphql<{ submitAppRequest: { appRequest: { id: string, status: string }, messages: { arg: String, message: string, type: string }[], success: boolean } }>(query, variables)
  //   expect(response.submitAppRequest.success).toEqual(true)
  // })

  test('Admin - Verify requirement configurations are no longer configurable after submit', async ({ adminRequest }) => {
    const query = `
      query GetPeriodConfigurations($ids: [ID!]){
        periods(filter: {ids: $ids}) {
          id
          configurations{
            key
            actions {
              view
              update
            }
          }
        }
      }
    `
    const variables = { ids: [periodId] }
    const { periods } = await adminRequest.graphql<{ periods: { id: number, configurations: { key: string, actions: { view: boolean, update: boolean } }[] }[] }>(query, variables)
    expect(periods[0].id).toEqual(periodId)
    expect(periods[0].configurations.length).toBeGreaterThan(0)
    const targetConfig = periods[0].configurations.find(c => c.key === requirementConfigKey)
    expect(targetConfig).toBeDefined()
    expect(targetConfig!.actions.update).toEqual(false)
    for (const config of periods[0].configurations) {
      expect(config.actions.view).toEqual(true)
      expect(config.actions.update).toEqual(false)
    }
  })

  test('Admin - Attempt to update requirement configuration after app request submitted - blocked', async ({ adminRequest }) => {
    const query = `
      mutation UpdatePeriodConfiguration($periodId: ID!, $data: JsonData!, $key: String!, $validateOnly: Boolean) {
        updateConfiguration(periodId:$periodId, data: $data, key: $key, validateOnly: $validateOnly) {
          success
          configuration {
            key
            data
          }
        }
      }
    `
    const data = { minExerciseHoursWeekly: 12 }
    const variables = { periodId, key: requirementConfigKey, data, validateOnly: false }
    const response = await adminRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You are not allowed to update this configuration.')
  })
})
