import { expect, test } from './fixtures.js'
import { DateTime } from 'luxon'

test.describe.serial('Manage period configurations', () => {
  const name = '2025 Config'
  const code = '2025-config'
  const timeZone = 'America/Chicago'
  const openDate = DateTime.fromISO('2025-09-01T00:00:00.000-05:00').setZone(timeZone).toISO()
  const closeDate = DateTime.fromISO('2025-12-01T01:00:00.000-05:00').setZone(timeZone).toISO()
  let periodId = 0
  test('Admin - Create new unreviewed period for prompt configuration testing', async ({ adminRequest }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate:DateTime!, $closeDate:DateTime!, $reviewed:Boolean){
        createPeriod(period:{ name: $name, code: $code, openDate: $openDate, closeDate: $closeDate, reviewed:$reviewed}, validateOnly: false) {
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
    const variables = { name, code, openDate, closeDate, reviewed: false }
    const response = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, closeDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    periodId = response.createPeriod.period.id
    expect(response.createPeriod.period.name).toEqual(name)
    expect(response.createPeriod.period.code).toEqual(code)
    expect(response.createPeriod.period.openDate).toEqual(openDate)
    expect(response.createPeriod.period.closeDate).toEqual(closeDate)
    expect(response.createPeriod.period.reviewed).toEqual(false)
  })
  test('Admin - Get prompt configuration for period details with view and update access', async ({ adminRequest }) => {
    const query = `
      query GetPeriodConfigurations($ids: [ID!]){
        periods(filter: {ids: $ids}) {
          id
          name
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
    const { periods } = await adminRequest.graphql<{ periods: { id: number, name: string, configurations: { key: string, data: string, actions: { view: boolean, update: boolean } }[] }[] }>(query, variables)
    expect(periods[0].id).toEqual(periodId)
    expect(periods[0].name).toEqual(name)
    for (const config of periods[0].configurations) {
      expect(config.actions.update).toEqual(true)
      expect(config.actions.view).toEqual(true)
    }
  })
  test('Admin - Make exercise hours config changes', async ({ adminRequest }) => {
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
    const data = { minExerciseHours: 15 }
    const variables = { periodId, key: 'must_exercise_your_dog_req', data, validateOnly: false }
    const response = await adminRequest.graphql<{ updateConfiguration: { success: boolean, configuration: { key: string, data: { minExerciseHours: number} } } }>(query, variables)
    expect(response.updateConfiguration.success).toEqual(true)
    expect(response.updateConfiguration.configuration.data.minExerciseHours).toEqual(data.minExerciseHours)
  })
  test('Admin - Set period reviewed for prompt configuration update blocks', async ({ adminRequest }) => {
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
    const variables = { periodId, name, code, openDate, closeDate, reviewed: true }
    const { updatePeriod } = await adminRequest.graphql<{ updatePeriod: { period: { id: number, name: string, code: string, closeDate: string, openDate: string, archiveDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    expect(updatePeriod.period.id).toEqual(periodId)
    expect(updatePeriod.period.reviewed).toEqual(true)
    expect(updatePeriod.period.closeDate).toEqual(closeDate)
  })
  test('Admin - Make exercise hours config changes in reviewed period', async ({ adminRequest }) => {
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
    const data = { minExerciseHours: 5 }
    const variables = { periodId, key: 'must_exercise_your_dog_req', data, validateOnly: false }
    const response = await adminRequest.graphql<{ updateConfiguration: { success: boolean, configuration: { key: string, data: { minExerciseHours: number} } } }>(query, variables)
    expect(response.updateConfiguration.success).toEqual(false)
    expect(response.updateConfiguration.configuration.data.minExerciseHours).not.toEqual(data.minExerciseHours)
  })
  test('Reviewer - Get prompt configuration period details with view access, but no update access', async ({ reviewerRequest }) => {
    const query = `
      query GetPeriodConfigurations($ids: [ID!]){
        periods(filter: {ids: $ids}) {
          id
          name
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
    const response = await reviewerRequest.graphql<{ periods: { id: number, name: string, configurations: { key: string, data: string, actions: { view: boolean, update: boolean } }[] }[] }>(query, variables)
    expect(response.periods[0].id).toEqual(periodId)
    expect(response.periods[0].name).toEqual(name)
    for (const config of response.periods[0].configurations) {
      expect(config.actions.update).toEqual(false)
      expect(config.actions.view).toEqual(true)
    }
  })
  test('Applicant - Get prompt configuration period details with view access, but no update access', async ({ applicantRequest }) => {
    const query = `
      query GetPeriodConfigurations($ids: [ID!]){
        periods(filter: {ids: $ids}) {
          id
          name
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
    const response = await applicantRequest.graphql<{ periods: { id: number, name: string, configurations: { key: string, data: string, actions: { view: boolean, update: boolean } }[] }[] }>(query, variables)
    expect(response.periods[0].id).toEqual(periodId)
    expect(response.periods[0].name).toEqual(name)
    for (const config of response.periods[0].configurations) {
      expect(config.actions.update).toEqual(false)
      expect(config.actions.view).toEqual(true)
    }
  })
  test('Applicant 2 - Get prompt configuration period details with view access, but no update access', async ({ applicant2Request }) => {
    const query = `
      query GetPeriodConfigurations($ids: [ID!]){
        periods(filter: {ids: $ids}) {
          id
          name
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
    const { periods } = await applicant2Request.graphql<{ periods: { id: number, name: string, configurations: { key: string, data: string, actions: { view: boolean, update: boolean } }[] }[] }>(query, variables)
    expect(periods[0].id).toEqual(periodId)
    expect(periods[0].name).toEqual(name)
    for (const config of periods[0].configurations) {
      expect(config.actions.update).toEqual(false)
      expect(config.actions.view).toEqual(true)
    }
  })
})
