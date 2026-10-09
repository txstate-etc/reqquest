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
  let copyPeriodId = ''

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
    copyPeriodId = String(createPeriod.period.id)
    const dog = (await getPrograms(adminRequest, copyPeriodId)).find(p => p.key === programKey)!
    expect(dog.title).toEqual('Canine Companions')
    expect(dog.navTitle).toEqual('Dogs')
  })

  test('Admin - a name used by one program cannot be given to another', async ({ adminRequest }) => {
    const conflictQuery = `
      mutation UpdateConfiguration($periodId: ID!, $key: String!, $data: JsonData!, $validateOnly: Boolean) {
        updateConfiguration(periodId: $periodId, key: $key, data: $data, validateOnly: $validateOnly) {
          success
          messages { message arg type }
        }
      }
    `
    type ConflictResponse = { updateConfiguration: { success: boolean, messages: { message: string, arg?: string, type: string }[] } }
    const save = async (key: string, data: any, validateOnly = false) => (await adminRequest.graphql<ConflictResponse>(conflictQuery, { periodId, key, data, validateOnly })).updateConfiguration

    // another program's override title, matched ignoring case and extra spaces - in validation and on
    // save - summarizing the periods when more than one still holds it
    for (const validateOnly of [true, false]) {
      const resp = await save('adopt_a_cat_program', { title: '  canine   COMPANIONS ' }, validateOnly)
      const message = resp.messages.find(m => m.arg === 'title' && m.type === 'error')?.message
      expect(message).toContain('is currently used by Adopt a Dog in multiple periods')
    }
    // another program's override navTitle
    const navResp = await save('adopt_a_cat_program', { navTitle: 'dogs' })
    expect(navResp.messages.some(m => m.arg === 'navTitle' && m.type === 'error')).toEqual(true)
    // another program's code title
    const codeResp = await save('adopt_a_cat_program', { title: 'Adopt a Dog' })
    expect(codeResp.messages.find(m => m.arg === 'title' && m.type === 'error')?.message).toEqual('"Adopt a Dog" is the default name of the program Adopt a Dog.')

    // none of the rejected saves landed
    const cat = (await getPrograms(adminRequest, periodId)).find(p => p.key === 'adopt_a_cat_program')!
    expect(cat.title).toEqual('Adopt a Cat')

    // removing the name from one unlocked period is not enough while another still holds it
    expect((await save(programKey, {})).success).toEqual(true)
    const stillHeld = await save('adopt_a_cat_program', { title: 'Canine Companions' })
    expect(stillHeld.messages.find(m => m.arg === 'title')?.message).toContain('Adopt a Dog in Program Labels Copy.')
    // once no period holds it, it is free for another program
    expect((await adminRequest.graphql<ConflictResponse>(conflictQuery, { periodId: copyPeriodId, key: programKey, data: {} })).updateConfiguration.success).toEqual(true)
    expect((await save('adopt_a_cat_program', { title: 'Canine Companions' })).success).toEqual(true)
    // put things back for the tests below: the cat lets go, the dog takes its names again in both periods
    expect((await save('adopt_a_cat_program', {})).success).toEqual(true)
    expect((await adminRequest.graphql<ConflictResponse>(conflictQuery, { periodId: copyPeriodId, key: programKey, data: { title: 'Canine Companions', navTitle: 'Dogs' } })).updateConfiguration.success).toEqual(true)

    // a program may reuse its own names, and take one nobody has used
    expect((await save(programKey, { title: 'Canine Companions', navTitle: 'Dogs' })).success).toEqual(true)
    expect((await save('adopt_a_cat_program', { title: 'Feline Friends' })).success).toEqual(true)
    expect((await save('adopt_a_cat_program', {})).success).toEqual(true)
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

  // createPeriod copies the configurations of the most recent period, labels included, so leaving the dog renamed
  // would carry "Canine Companions" into whatever period the next spec creates
  test.afterAll(async ({ adminRequest }) => {
    for (const id of [periodId, copyPeriodId].filter(Boolean)) {
      await adminRequest.graphql(updateQuery, { periodId: id, key: programKey, data: {}, validateOnly: false })
    }
  })
})
