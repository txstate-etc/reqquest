import { expect, test } from './fixtures.js'

interface PeriodProgramLabels {
  key: string
  title: string
  navTitle: string
  configuration: { data: { title?: string, navTitle?: string }, actions: { update: boolean } }
}

const programsQuery = `
  query GetPeriodPrograms($ids: [ID!]) {
    periods(filter: { ids: $ids }) {
      id
      programs {
        key
        title
        navTitle
        configuration {
          data
          actions { update }
        }
      }
    }
  }
`

const updateQuery = `
  mutation UpdateConfiguration($periodId: ID!, $key: String!, $data: JsonData!, $validateOnly: Boolean) {
    updateConfiguration(periodId: $periodId, key: $key, data: $data, validateOnly: $validateOnly) {
      success
      configuration { key data }
    }
  }
`

const createPeriodQuery = `
  mutation CreatePeriod($period: PeriodUpdate!, $copyPeriodId: String) {
    createPeriod(period: $period, copyPeriodId: $copyPeriodId, validateOnly: false) {
      success
      period { id }
    }
  }
`

test.describe.serial('Per-period program labels', { tag: '@default' }, () => {
  const programKey = 'adopt_a_dog_program'
  let periodId = ''

  async function getPrograms (request: { graphql: <T>(query: string, variables?: Record<string, any>) => Promise<T> }, id: string) {
    const { periods } = await request.graphql<{ periods: { id: string, programs: PeriodProgramLabels[] }[] }>(programsQuery, { ids: [id] })
    return periods[0].programs
  }

  test('Admin - create an empty period to label', async ({ adminRequest }) => {
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { success: boolean, period: { id: string } } }>(createPeriodQuery, {
      period: { name: 'Program Labels', code: 'program-labels', openDate: '2099-01-01T00:00:00.000Z', closeDate: '2099-06-01T00:00:00.000Z' }
    })
    expect(createPeriod.success).toEqual(true)
    periodId = String(createPeriod.period.id)
  })

  test('Admin - programs start with code titles and are editable', async ({ adminRequest }) => {
    const dog = (await getPrograms(adminRequest, periodId)).find(p => p.key === programKey)!
    expect(dog.title).toEqual('Adopt a Dog')
    expect(dog.navTitle).toEqual('Adopt a Dog')
    expect(dog.configuration.data).toEqual({})
    expect(dog.configuration.actions.update).toEqual(true)
  })

  test('Admin - overriding only the title also replaces the navigation title', async ({ adminRequest }) => {
    const { updateConfiguration } = await adminRequest.graphql<{ updateConfiguration: { success: boolean, configuration: { data: any } } }>(updateQuery, { periodId, key: programKey, data: { title: '  Canine Companions  ' }, validateOnly: false })
    expect(updateConfiguration.success).toEqual(true)
    expect(updateConfiguration.configuration.data).toEqual({ title: 'Canine Companions' })
    const dog = (await getPrograms(adminRequest, periodId)).find(p => p.key === programKey)!
    expect(dog.title).toEqual('Canine Companions')
    expect(dog.navTitle).toEqual('Canine Companions')
  })

  test('Admin - a navigation title override is used when present', async ({ adminRequest }) => {
    await adminRequest.graphql(updateQuery, { periodId, key: programKey, data: { title: 'Canine Companions', navTitle: 'Dogs' }, validateOnly: false })
    const dog = (await getPrograms(adminRequest, periodId)).find(p => p.key === programKey)!
    expect(dog.title).toEqual('Canine Companions')
    expect(dog.navTitle).toEqual('Dogs')
  })

  test('Admin - unknown label fields are rejected', async ({ adminRequest }) => {
    const resp = await adminRequest.graphql<{ errors?: any[] }>(updateQuery, { periodId, key: programKey, data: { title: 'X', key: 'some_other_program' }, validateOnly: false })
    expect(resp.errors?.length).toBeGreaterThan(0)
    const dog = (await getPrograms(adminRequest, periodId)).find(p => p.key === programKey)!
    expect(dog.title).toEqual('Canine Companions')
  })

  test('Admin - labels carry forward to a period copied from this one', async ({ adminRequest }) => {
    const { createPeriod } = await adminRequest.graphql<{ createPeriod: { success: boolean, period: { id: string } } }>(createPeriodQuery, {
      period: { name: 'Program Labels Copy', code: 'program-labels-copy', openDate: '2099-07-01T00:00:00.000Z', closeDate: '2099-12-01T00:00:00.000Z' },
      copyPeriodId: periodId
    })
    expect(createPeriod.success).toEqual(true)
    const dog = (await getPrograms(adminRequest, String(createPeriod.period.id))).find(p => p.key === programKey)!
    expect(dog.title).toEqual('Canine Companions')
    expect(dog.navTitle).toEqual('Dogs')
  })

  test('Admin - grant restriction options list the other names a program has gone by', async ({ adminRequest }) => {
    const { controlGroups } = await adminRequest.graphql<{ controlGroups: { name: string, tags: { category: string, tags: { value: string, description?: string }[] }[] }[] }>(`
      query { controlGroups { name tags { category tags { value description } } } }
    `)
    const programTags = controlGroups.find(g => g.name === 'Program')!.tags.find(c => c.category === 'program')!.tags
    expect(programTags.find(t => t.value === programKey)!.description).toEqual('aka Canine Companions')
    expect(programTags.find(t => t.value === 'adopt_a_cat_program')!.description).toBeNull()
  })

  test('Admin - saved grant restrictions list the other names a program has gone by', async ({ adminRequest }) => {
    const { roleCreate } = await adminRequest.graphql<{ roleCreate: { success: boolean, accessRole: { id: string } } }>(`
      mutation { roleCreate(role: { name: "Program alias test", groups: ["program-alias-test"] }) { success accessRole { id } } }
    `)
    expect(roleCreate.success).toEqual(true)
    const roleId = roleCreate.accessRole.id
    const { roleAddGrant } = await adminRequest.graphql<{ roleAddGrant: { success: boolean } }>(`
      mutation AddGrant($roleId: ID!, $grant: AccessRoleGrantCreate!) { roleAddGrant(roleId: $roleId, grant: $grant) { success } }
    `, { roleId, grant: { controlGroup: 'Program', controls: ['view'], allow: true, tags: [{ category: 'program', tag: programKey }] } })
    expect(roleAddGrant.success).toEqual(true)
    const { roles } = await adminRequest.graphql<{ roles: { grants: { tags: { tag: string, label: string, description?: string }[] }[] }[] }>(`
      query GetRole($ids: [ID!]) { roles(filter: { ids: $ids }) { grants { tags { tag label description } } } }
    `, { ids: [roleId] })
    const tag = roles[0].grants[0].tags[0]
    expect(tag.label).toEqual('Adopt a Dog')
    expect(tag.description).toEqual('aka Canine Companions')
  })

  test('Admin - blank labels revert to the code titles', async ({ adminRequest }) => {
    const { updateConfiguration } = await adminRequest.graphql<{ updateConfiguration: { success: boolean, configuration: { data: any } } }>(updateQuery, { periodId, key: programKey, data: { title: '', navTitle: '   ' }, validateOnly: false })
    expect(updateConfiguration.success).toEqual(true)
    expect(updateConfiguration.configuration.data).toEqual({})
    const dog = (await getPrograms(adminRequest, periodId)).find(p => p.key === programKey)!
    expect(dog.title).toEqual('Adopt a Dog')
    expect(dog.navTitle).toEqual('Adopt a Dog')
  })

  test('Admin - labels lock once a period has app requests', async ({ adminRequest, applicantRequest }) => {
    // the applicant's own request, since an unsubmitted request is not visible to admins
    const { appRequests } = await applicantRequest.graphql<{ appRequests: { period: { id: string } }[] }>('query { appRequests { period { id } } }')
    expect(appRequests.length).toBeGreaterThan(0)
    const lockedPeriodId = String(appRequests[0].period.id)
    const programs = await getPrograms(adminRequest, lockedPeriodId)
    for (const program of programs) expect(program.configuration.actions.update).toEqual(false)
    const resp = await adminRequest.graphql<{ errors?: any[] }>(updateQuery, { periodId: lockedPeriodId, key: programs[0].key, data: { title: 'Too late' }, validateOnly: false })
    expect(resp.errors?.length).toBeGreaterThan(0)
  })
})
