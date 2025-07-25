import { expect, test } from './fixtures.js'

test.describe('Manage periods', () => {
  test.use({ login: 'admin_02' })
  test('Create new period as admin', async ({ request }) => {
    const name = 'Auto 2025'
    const code = '10'
    const openDate = "2025-09-01T00:00:00.000-05:00"
    const query = `
      mutation {
        createPeriod(period:{ name: "${name}", code: "${code}", openDate: "${openDate}", validateOnly: false) {
          period {
            name
            code
          }
        }
      }
    `
    const { period } = await request.graphql<{ createPeriod: { period: { name: string, code: string} } }>(query)
    expect(period.name).toEqual(name)
    expect(period.code).toEqual(code)
  })
})
