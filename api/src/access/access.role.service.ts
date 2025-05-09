import { BaseService, MutationMessageType, ValidatedResponse } from '@txstate-mws/graphql-server'
import { ManyJoinedLoader, OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { keyby, unique } from 'txstate-utils'
import { AuthService, AccessDatabase as database, AccessRoleFilter, AccessRoleValidatedResponse, AccessRoleGrant, AccessRole, AccessRoleGrantCreate, AccessRoleInput } from '../internal.js'

const accessRolesByIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return database.getAccessRoles({ ids })
  }
})

const accessRolesByUserIdLoader = new ManyJoinedLoader({
  fetch: async (userInternalIds: number[]) => {
    const rows = await database.getAccessRolesByUserIds(userInternalIds)
    const roles = await database.getAccessRoles({ ids: unique(rows.map(r => String(r.roleId))) })
    const rolesById = keyby(roles, 'id')
    return rows.map(row => ({ key: row.userId, value: rolesById[row.roleId] }))
  },
  idLoader: accessRolesByIdLoader
})

const accessRoleGrantsByIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => await database.getAccessRoleGrants({ ids })
})

const accessRoleGrantsByRoleIdLoader = new OneToManyLoader({
  fetch: async (roleIds: string[]) => await database.getAccessRoleGrants({ roleIds }),
  extractKey: grant => grant.roleId,
  idLoader: accessRoleGrantsByIdLoader
})

const accessRoleGrantControlsByGrantIdLoader = new OneToManyLoader({
  fetch: async (grantIds: string[]) => await database.getControlsByGrantIds(grantIds),
  extractKey: control => control.grantId
})

const accessTagsByGrantIdLoader = new OneToManyLoader({
  fetch: async (grantIds: number[]) => await database.getTagsByGrantIds(grantIds),
  extractKey: tag => tag.grantId
})

const groupsByRoleIdLoader = new ManyJoinedLoader({
  fetch: async (roleIds: string[]) => await database.getGroupsByRoleIds(roleIds)
})

export class AccessRoleServiceInternal extends BaseService<AccessRole> {
  async findAccessRoleById (id: string) {
    return await this.loaders.get(accessRolesByIdLoader).load(id)
  }

  async findAccessRolesByUserId (userInternalId: number) {
    return await this.loaders.get(accessRolesByUserIdLoader).load(userInternalId)
  }

  async findAccessRoleGrantById (grantId: string) {
    return await this.loaders.get(accessRoleGrantsByIdLoader).load(grantId)
  }
}

export class AccessRoleService extends AuthService<AccessRole> {
  raw = this.svc(AccessRoleServiceInternal)

  async findAccessRole (filter?: AccessRoleFilter) {
    const roles = await database.getAccessRoles(filter)
    for (const role of roles) {
      this.loaders.get(accessRolesByIdLoader).prime(role.id, role)
    }
    return this.removeUnauthorized(roles)
  }

  async findAccessRolesByUserId (userInternalId: number) {
    return this.removeUnauthorized(await this.raw.findAccessRolesByUserId(userInternalId))
  }

  /**
   * Groups and grants don't need to be authorized, they are always underneath roles
   * which are controlled by mayView already
   */

  async getGroupsByRoleId (id: string) {
    return await this.loaders.get(groupsByRoleIdLoader).load(id)
  }

  async getGroupsByRoleIds (roleIds: string[]) {
    return await this.loaders.loadMany(groupsByRoleIdLoader, roleIds)
  }

  async getGrantsByRoleId (roleId: string) {
    return await this.loaders.get(accessRoleGrantsByRoleIdLoader).load(roleId)
  }

  async getControlsByGrantId (grantId: string) {
    return await this.loaders.get(accessRoleGrantControlsByGrantIdLoader).load(grantId)
  }

  async getTagsByGrantId (grantId: number) {
    return await this.loaders.get(accessTagsByGrantIdLoader).load(grantId)
  }

  mayView (role: AccessRole) {
    return this.hasControl('Role', 'view')
  }

  mayViewRoleManagement () {
    return this.hasAnyControl('Role', 'view')
  }

  mayCreate () {
    return this.hasAnyControl('Role', 'create')
  }

  mayUpdate (role: AccessRole) {
    return this.hasControl('Role', 'update')
  }

  mayDelete (role: AccessRole) {
    return this.hasControl('Role', 'delete')
  }

  async createAccessRole (roleInput: AccessRoleInput, validateOnly?: boolean) {
    if (!this.mayCreate()) throw new Error('Access forbidden')
    const response = await this.validateAccessRole(null, roleInput)
    if (response.hasErrors() || validateOnly) return response
    try {
      const roleId = await database.createAccessRole(roleInput)
      this.loaders.clear()
      response.accessRole = await this.raw.findAccessRoleById(String(roleId))
    } catch (e: any) {
      if (e.errno === 1022) response.addMessage(`Role with name '${roleInput.name}' already exists`, 'name', MutationMessageType.error)
      else throw e
    }
    return response
  }

  async updateAccessRole (id: string, roleInput: AccessRoleInput, validateOnly?: boolean) {
    const role = await this.raw.findAccessRoleById(id)
    if (!role) throw new Error('Role does not exist.')
    if (!this.mayUpdate(role)) throw new Error('Access forbidden')
    const response = await this.validateAccessRole(id, roleInput)
    if (response.hasErrors() || validateOnly) return response
    try {
      await database.updateAccessRole(id, roleInput)
      this.loaders.clear()
      response.accessRole = await this.raw.findAccessRoleById(id)
    } catch (e: any) {
      if (e.errno === 1022) response.addMessage(`Role with name '${roleInput.name}' already exists`, 'name', MutationMessageType.error)
      else throw e
    }
    return response
  }

  async validateAccessRole (id: string | null, roleInput: AccessRoleInput): Promise<AccessRoleValidatedResponse> {
    const valid = new AccessRoleValidatedResponse({ success: true, messages: [] })
    const role = (await database.getAccessRoles({ names: [roleInput.name] }))[0] // check if role already exists
    if (role && role.id !== id) {
      valid.addMessage(`Role with name '${roleInput.name}' already exists`, 'name', MutationMessageType.error)
    }
    return valid
  }

  async deleteAccessRole (roleId: string) {
    const role = await this.raw.findAccessRoleById(roleId)
    if (!role) throw new Error('Role does not exist.')
    if (!this.mayDelete(role)) throw new Error('Access forbidden')
    const response = new ValidatedResponse({ success: true, messages: [] })
    await database.deleteAccessRole(roleId)
    return response
  }

  async addAccessRoleGrant (roleId: string, grant: AccessRoleGrantCreate, validateOnly?: boolean) {
    const role = await this.raw.findAccessRoleById(roleId)
    if (!role) throw new Error('Role does not exist.')
    if (!this.mayUpdate(role)) throw new Error('Access forbidden')
    const response = new AccessRoleValidatedResponse({ success: true, messages: [] })
    if (!grant.controls?.length) response.addMessage('At least one control must be selected.', 'controls', MutationMessageType.error)
    if (response.hasErrors() || validateOnly) return response
    try {
      await database.addAccessRoleGrant(roleId, grant)
      this.loaders.clear()
      response.accessRole = await this.raw.findAccessRoleById(roleId)
    } catch (e: any) {
      if (e.errno === 1022) response.addMessage(`Grant already exists for role '${role.name}'`, 'grant', MutationMessageType.error)
      else throw e
    }
    return response
  }

  async updateAccessRoleGrant (grantId: string, grantInput: AccessRoleGrantCreate, validateOnly?: boolean) {
    const grant = await this.raw.findAccessRoleGrantById(grantId)
    if (!grant) throw new Error('Grant does not exist.')
    const role = await this.raw.findAccessRoleById(grant.roleId)
    if (!role) throw new Error('Role does not exist.')
    if (!this.mayUpdate(role)) throw new Error('Access forbidden')
    const response = new AccessRoleValidatedResponse({ success: true, messages: [] })
    if (!grantInput.controls?.length) response.addMessage('At least one control must be selected.', 'controls', MutationMessageType.error)
    if (response.hasErrors() || validateOnly) return response
    await database.updateAccessRoleGrant(grantId, grantInput)
    this.loaders.clear()
    response.accessRole = await this.raw.findAccessRoleById(role.id)
    return response
  }

  async deleteAccessRoleGrant (grantId: string) {
    const grant = await this.raw.findAccessRoleGrantById(grantId)
    if (!grant) throw new Error('Grant does not exist.')
    const role = await this.raw.findAccessRoleById(grant.roleId)
    if (!role) throw new Error('Role does not exist.')
    if (!this.mayUpdate(role)) throw new Error('Access forbidden')
    const response = new AccessRoleValidatedResponse({ success: true, messages: [] })
    await database.deleteAccessRoleGrant(grantId)
    this.loaders.clear()
    return await this.raw.findAccessRoleById(role.id)
  }
}
