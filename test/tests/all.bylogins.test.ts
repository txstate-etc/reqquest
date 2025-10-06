import { expect, test } from './fixtures.js'

test.describe('ByLogins admin flow', { tag: '@all' }, () => {
  const uniqueAdmin: string = 'admin_01'
  test.use({ login: uniqueAdmin })
  test('Account details should be updated from seed data post upsert', async ({ request }) => {
    const { accessUsers } = await request.graphql<{ accessUsers: { login: string, fullname: string, otherInfo: { email: string } }[] }>(`
      {
        accessUsers (filter: { self: true }) {
          login
          fullname
          otherInfo
        }
      }
    `)
    expect(accessUsers).toHaveLength(1)
    expect(accessUsers[0].login).toEqual(uniqueAdmin)
    expect(accessUsers[0].fullname).toEqual(`${uniqueAdmin} Full Name`)
    expect(accessUsers[0].otherInfo.email).toEqual(`${uniqueAdmin}@txstate.edu`)
  })
})
