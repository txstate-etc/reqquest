import { Hash } from 'crypto'
import { expect, test } from './fixtures.js'
import { DateTime } from 'luxon'
import { promptMapQualified, promptMapUnqualified } from './promptdata.js'

test.describe.serial('App Request - Review Phase - workflows', () => {
  const name = '2025 app-req Review Phase'
  const code = 'APP_REQ_REV-255'
  const openDate = '2025-07-01T00:00:00.000-05:00'
  const closeDate = '2025-09-01T00:00:00.000-05:00'
  const applicantLogin = 'applicant'
  const applicant2Login = 'applicant2'
  const timeZone = 'America/Chicago'
  let periodId = 0
  test('Admin - Create new period for review phase appRequests', async ({ adminRequest }) => {
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
})
