import { expect, test } from './fixtures.js'

test.describe('Manage periods', { tag: '@all' }, () => {
  const name = '2025 Per'
  const code = 'PER-255'
  const openDate = '2025-09-01T00:00:00.000-05:00'
  let periodId = 0
  test('Admin - Create new period', async ({ adminRequest }) => {
    const query = `
      mutation CreatePeriod($name: String!, $code: String!, $openDate:DateTime!){
        createPeriod(period:{ name: $name, code: $code, openDate: $openDate}, validateOnly: false) {
          period {
            id
            name
            code
            openDate
            reviewed
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { name, code, openDate }
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string, reviewed: boolean }, messages: { message: string }[] } }>(query, variables)
    periodId = createPeriod.period.id
    expect(createPeriod.period.name).toEqual(name)
    expect(createPeriod.period.code).toEqual(code)
    expect(createPeriod.period.openDate).toEqual(openDate)
    expect(createPeriod.period.reviewed).toEqual(false)
  })
  const closeDate = '2026-09-01T00:00:00.000-05:00'
  const archiveDate = '2026-09-02T00:00:00.000-05:00'
  test('Admin - Update period closeDate and archiveDate', async ({ adminRequest }) => {
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
    const { updatePeriod } = await adminRequest.graphql<{ updatePeriod: { period: { name: string, code: string, closeDate: string, openDate: string, archiveDate: string }, messages: { message: string }[] } }>(query, variables)
    expect(updatePeriod.period.name).toEqual(name)
    expect(updatePeriod.period.code).toEqual(code)
    expect(updatePeriod.period.openDate).toEqual(openDate)
    expect(updatePeriod.period.closeDate).toEqual(closeDate)
    expect(updatePeriod.period.archiveDate).toEqual(archiveDate)
  })
  test('Admin - Delete previously created new period', async ({ adminRequest }) => {
    const query = `
      mutation DeletePeriod($periodId: ID!){
        deletePeriod(periodId: $periodId) {
          messages {
            message
          }
        }
      }
    `
    const variables = { periodId }
    const { deletePeriod } = await adminRequest.graphql<{ deletePeriod: { messages: [] } }>(query, variables)
    expect(deletePeriod.messages.length).toEqual(0)
  })
  test('Admin - Create new period with previously removed code, confirm unique constraint cleared', async ({ adminRequest }) => {
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
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { period: { id: number, name: string, code: string, openDate: string }, messages: { message: string }[] } }>(query, variables)
    periodId = createPeriod.period.id
    expect(createPeriod.period.name).toEqual(name)
    expect(createPeriod.period.code).toEqual(code)
    expect(createPeriod.period.openDate).toEqual(openDate)
  })
  test('Admin - Create new period with previously used code, confirm unique constraint prevents creation', async ({ adminRequest }) => {
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
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { period: { id: string, name: string, code: string, openDate: string }, messages: { message: string }[] } }>(query, variables)
    expect(createPeriod.messages[0].message).toEqual('Name is already in use.')
  })
  test('Applicant - Create new period', async ({ applicantRequest }) => {
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
    const variables = { name: 'Applicant Period', code: 'PER-99', openDate }
    const response = await applicantRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You are not allowed to create a period.')
  })
  test('Applicant - Update period', async ({ applicantRequest }) => {
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
    const variables = { periodId, name, code: '100', openDate, closeDate, archiveDate }
    const response = await applicantRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You are not allowed to update this period.')
  })
  test('Applicant - Delete previously created new period', async ({ applicantRequest }) => {
    const query = `
      mutation DeletePeriod($periodId: ID!){
        deletePeriod(periodId: $periodId) {
          messages {
            message
          }
        }
      }
    `
    const variables = { periodId }
    const response = await applicantRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You are not allowed to delete this period.')
  })
  test('Reviewer - Create new period', async ({ reviewerRequest }) => {
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
    const variables = { name: 'Applicant Period', code: 'PER-99', openDate }
    const response = await reviewerRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You are not allowed to create a period.')
  })
  test('Reviewer - Update period', async ({ reviewerRequest }) => {
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
    const variables = { periodId, name, code: '100', openDate, closeDate, archiveDate }
    const response = await reviewerRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You are not allowed to update this period.')
  })
  test('Reviewer - Delete previously created new period', async ({ reviewerRequest }) => {
    const query = `
      mutation DeletePeriod($periodId: ID!){
        deletePeriod(periodId: $periodId) {
          messages {
            message
          }
        }
      }
    `
    const variables = { periodId }
    const response = await reviewerRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(response.errors[0].message).toEqual('You are not allowed to delete this period.')
  })
})
