import { expect, test } from './fixtures.js'

test('should be able get information about the logged in user', async ({ applicantRequest }) => {
  const { accessUsers } = await applicantRequest.graphql<{ accessUsers: { login: string }[] }>(`
    {
      accessUsers (filter: { self: true }) {
        login
      }
    }
  `)
  expect(accessUsers).toHaveLength(1)
  expect(accessUsers[0].login).toEqual('applicant')
})
