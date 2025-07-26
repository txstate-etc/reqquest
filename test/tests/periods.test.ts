import { expect, test } from './fixtures.js'

test.describe('Manage periods as admin', () => {
  test.use({ login: 'admin_02' })
  const name = 'Auto 2025'
  const code = '25'
  const openDate = "2025-09-01T00:00:00.000-05:00"
  let periodId = 0
  test('Create new period as admin', async ({ request }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate:DateTime!){
        createPeriod(period:{ name: $name, code: $code, openDate: $openDate}, validateOnly: false) {
          period {
            id
            name
            code
            openDate
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { name, code, openDate }
    const { createPeriod } = await request.graphql<{ createPeriod: { period: { id: string, name: string, code: string, openDate: string}, messages: { message: string} } }>(query, variables)
    periodId = createPeriod.period.id
    expect(createPeriod.period.name).toEqual(name)
    expect(createPeriod.period.code).toEqual(code)
    expect(createPeriod.period.openDate).toEqual(openDate)
  })
  const closeDate = "2026-09-01T00:00:00.000-05:00"
  const archiveDate = "2026-09-02T00:00:00.000-05:00"
  test('Update period closeDate and archiveDate as admin', async ({ request }) => {
    const query = `
      mutation UpdatePeriod($periodId: ID!, $name: String!, $code: String!, $openDate:DateTime!, $closeDate:DateTime, $archiveDate:DateTime){
        updatePeriod(periodId: $periodId, update:{ name: $name, code: $code, openDate: $openDate, closeDate: $closeDate, archiveDate: $archiveDate}, validateOnly: false) {
          period {
            name
            code
            openDate
            closeDate
            archiveDate
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { periodId, name, code, openDate, closeDate, archiveDate }
    const { updatePeriod } = await request.graphql<{ updatePeriod: { period: { name: string, code: string, closeDate: string, archiveDate: string}, messages: { message: string} } }>(query, variables)
    expect(updatePeriod.period.name).toEqual(name)
    expect(updatePeriod.period.code).toEqual(code)
    expect(updatePeriod.period.openDate).toEqual(openDate)
    expect(updatePeriod.period.closeDate).toEqual(closeDate)
    expect(updatePeriod.period.archiveDate).toEqual(archiveDate)
  })
})
