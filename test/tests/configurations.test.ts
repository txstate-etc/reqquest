import { expect, test } from './fixtures.js'
import { DateTime } from 'luxon'

test.describe('Manage period configurations', () => {
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
  // TEST - Make config change for exercise hours - should succeeded
  // TEST - Make period reviewed
  // TEST - Make config change for exercise hours - shoudl fail and 'reviewed' no more change

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
