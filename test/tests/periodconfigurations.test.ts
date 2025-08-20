import { expect, test } from './fixtures.js'
import { DateTime } from 'luxon'

test.describe('Manage period configurations', () => {
  const name = '2025 Config'
  const code = '2025-config'
  const timeZone = 'America/Chicago'
  const openDate = DateTime.fromISO('2025-09-01T00:00:00.000-05:00').setZone(timeZone).toISO()
  const closeDate = DateTime.fromISO('2025-12-01T01:00:00.000-05:00').setZone(timeZone).toISO()
  let periodId = 0
  test('Admin - Create new unreviewed period for configuration testing', async ({ adminRequest }) => {
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
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, closeDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    periodId = createPeriod.period.id
    expect(createPeriod.period.name).toEqual(name)
    expect(createPeriod.period.code).toEqual(code)
    expect(createPeriod.period.openDate).toEqual(openDate)
    expect(createPeriod.period.closeDate).toEqual(closeDate)
    expect(createPeriod.period.reviewed).toEqual(true)
  })
})
