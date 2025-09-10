import { expect, test } from './fixtures.js'

test.describe('Manage roles', () => {
  let name = 'Applicant Parent 1'
  let description = 'Applicant parent group.  Reduced scope applicant group'
  let scope = 'Parental'
  let groups = ['applicant 1']
  let accessRoleId = 0
  test('Admin - Create Applicant Parent role', async ({ adminRequest }) => {
    const query = `
      mutation RoleCreate($name: String!, $description: String!, $scope:String, $groups:[String!]!){
        roleCreate(role:{ name: $name, description: $description, scope: $scope, groups: $groups}, validateOnly: false) {
          accessRole {
            id
            name
            scope
            description
            groups {
              roleId
              groupName
              dateAdded
            }
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { name, description, scope, groups }
    const { roleCreate: { accessRole } } = await adminRequest.graphql<{ roleCreate: { accessRole: { id: number, name: string, scope: string, description: string, groups: { roleId: string, groupName: string, date: string }[] }, messages: { message: string }[] } }>(query, variables)
    accessRoleId = accessRole.id
    expect(accessRole.name).toEqual(name)
    expect(accessRole.scope).toEqual(scope)
    expect(accessRole.description).toEqual(description)
    expect(accessRole.groups.map(group => group.groupName)[0]).toEqual(groups[0])
  })
  test('Admin - Update Applicant Parent role with three groups, one dupe, one empty', async ({ adminRequest }) => {
    name = 'Applicant Parent'
    scope = 'Parent'
    description = 'Applicant parent group.  Reduced scope applicant group'
    groups = ['applicants', 'aPPlicants', '']
    const query = `
      mutation RoleUpdate($roleId: ID!, $name: String!, $description: String!, $scope:String, $groups:[String!]!){
        roleUpdate(roleId: $roleId,  role:{ name: $name, description: $description, scope: $scope, groups: $groups}, validateOnly: false) {
          accessRole {
            id
            name
            scope
            description
            groups {
              roleId
              groupName
              dateAdded
            }
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { roleId: accessRoleId, name, description, scope, groups }
    const { roleUpdate: { accessRole } } = await adminRequest.graphql<{ roleUpdate: { accessRole: { id: number, name: string, scope: string, description: string, groups: string[] }, messages: { message: string }[] } }>(query, variables)
    expect(accessRole.name).toEqual(name)
    expect(accessRole.scope).toEqual(scope)
    expect(accessRole.description).toEqual(description)
    expect(accessRole.groups.length).toEqual(1)
  })
  test('Admin - Update non existing role', async ({ adminRequest }) => {
    name = 'Applicant Parent'
    scope = 'Parent'
    description = 'Applicant parent group.  Reduced scope applicant group'
    groups = ['applicants', 'aPPlicants', '']
    const query = `
      mutation RoleUpdate($roleId: ID!, $name: String!, $description: String!, $scope:String, $groups:[String!]!){
        roleUpdate(roleId: $roleId,  role:{ name: $name, description: $description, scope: $scope, groups: $groups}, validateOnly: false) {
          accessRole {
            id
            name
            scope
            description
            groups {
              roleId
              groupName
              dateAdded
            }
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { roleId: 5555, name, description, scope, groups }
    const { errors } = await adminRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(errors[0].message).toEqual('Role does not exist.')
  })
  test('Applicant - Update Applicant Parent role', async ({ applicantRequest }) => {
    name = 'Bad juju'
    scope = 'AppChild'
    description = 'Applicant parent group.  Reduced scope applicant group'
    groups = ['one', 'two']
    const query = `
      mutation RoleUpdate($roleId: ID!, $name: String!, $description: String!, $scope:String, $groups:[String!]!){
        roleUpdate(roleId: $roleId,  role:{ name: $name, description: $description, scope: $scope, groups: $groups}, validateOnly: false) {
          accessRole {
            id
            name
            scope
            description
            groups {
              roleId
              groupName
              dateAdded
            }
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { roleId: accessRoleId, name, description, scope, groups }
    const { errors } = await applicantRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(errors[0].message).toEqual('Access forbidden')
  })
  test('Reviewer - Update Applicant Parent role', async ({ reviewerRequest }) => {
    name = 'Bad juju'
    scope = 'AppChild'
    description = 'Applicant parent group.  Reduced scope applicant group'
    groups = ['one', 'two']
    const query = `
      mutation RoleUpdate($roleId: ID!, $name: String!, $description: String!, $scope:String, $groups:[String!]!){
        roleUpdate(roleId: $roleId,  role:{ name: $name, description: $description, scope: $scope, groups: $groups}, validateOnly: false) {
          accessRole {
            id
            name
            scope
            description
            groups {
              roleId
              groupName
              dateAdded
            }
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { roleId: accessRoleId, name, description, scope, groups }
    const { errors } = await reviewerRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(errors[0].message).toEqual('Access forbidden')
  })
  test('Applicant - Create new role', async ({ applicantRequest }) => {
    const query = `
      mutation RoleCreate($name: String!, $description: String!, $scope:String, $groups:[String!]!){
        roleCreate(role:{ name: $name, description: $description, scope: $scope, groups: $groups}, validateOnly: false) {
          accessRole {
            id
            name
            scope
            description
            groups {
              roleId
              groupName
              dateAdded
            }
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { name: 'New', description: 'New', scope: 'New', groups: ['New'] }
    const { errors } = await applicantRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(errors[0].message).toEqual('Access forbidden')
  })
  test('Reviewer - Create new role', async ({ reviewerRequest }) => {
    const query = `
      mutation RoleCreate($name: String!, $description: String!, $scope:String, $groups:[String!]!){
        roleCreate(role:{ name: $name, description: $description, scope: $scope, groups: $groups}, validateOnly: false) {
          accessRole {
            id
            name
            scope
            description
            groups {
              roleId
              groupName
              dateAdded
            }
          }
          messages {
            message
          }
        }
      }
    `
    const variables = { name: 'New', description: 'New', scope: 'New', groups: ['New'] }
    const { errors } = await reviewerRequest.graphql<{ errors: { message: string }[] }>(query, variables)
    expect(errors[0].message).toEqual('Access forbidden')
  })

  test('Admin - Delete Applicant Parent role', async ({ adminRequest }) => {
    const query = `
      mutation RoleDelete($roleId: ID!){
        roleDelete(roleId: $roleId) {
          messages {
            message
          }
        }
      }
    `
    const variables = { roleId: accessRoleId }
    const { roleDelete } = await adminRequest.graphql<{ roleDelete: { messages: { message: string }[] } }>(query, variables)
    expect(roleDelete.messages.length).toEqual(0)
  })
})
