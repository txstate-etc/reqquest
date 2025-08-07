import { expect, test } from './fixtures.js'
test.describe('App Request workflows', () => {
  const name = '2025 app-req'
  const code = 'APP_REQ_PER-255'
  const openDate = '2025-07-01T00:00:00.000-05:00'
  const closeDate = '2025-09-01T00:00:00.000-05:00'
  const applicantLogin = 'applicant'
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
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, closeDate: string }, messages: { message: string }[] } }>(query, variables)
    periodId = createPeriod.period.id
    expect(createPeriod.period.name).toEqual(name)
    expect(createPeriod.period.code).toEqual(code)
    expect(createPeriod.period.openDate).toEqual(openDate)
    expect(createPeriod.period.closeDate).toEqual(closeDate)
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
    const { createAppRequest } = await applicantRequest.graphql<{ createAppRequest: { id: number, applicant: { login: string }, messages: { message: string }[] } }>(query, variables)
    expect(createAppRequest.messages[0].message.includes('is not currently accepting requests.')).toEqual(true)
  })
  test('Admin - set app request period to reviewed', async ({ adminRequest }) => {
    const query = `
      mutation UpdatePeriod($periodId: ID!, $name: String!, $code: String, $openDate:DateTime!, $reviewed:Boolean){
        updatePeriod(periodId: $periodId, update:{ name: $name, code: $code, openDate: $openDate, reviewed:$reviewed }, validateOnly: false) {
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
    const variables = { periodId, name, code, openDate, reviewed: true }
    const { updatePeriod } = await adminRequest.graphql<{ updatePeriod: { period: { id: number, name: string, code: string, closeDate: string, openDate: string, archiveDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    expect(updatePeriod.period.id).toEqual(periodId)
    expect(updatePeriod.period.reviewed).toEqual(true)
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
})
