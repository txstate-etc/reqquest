import { ManyJoinedLoader, OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { appConfig, AuthService } from '../internal.js'
import { AccessDatabase as database } from './access.database.js'
import { type AccessUserFilter, AccessUser } from './access.model.js'
import { intersect } from 'txstate-utils'

const accessUsersByIdLoader = new PrimaryKeyLoader({
  fetch: async (internalIds: number[]) => await database.getAccessUsers({ internalIds }),
  extractId: 'internalId'
})

const accessUsersByLoginLoader = new PrimaryKeyLoader({
  fetch: async (logins: string[]) => await database.getAccessUsers({ logins }),
  extractId: 'login',
  idLoader: accessUsersByIdLoader
})
accessUsersByIdLoader.addIdLoader(accessUsersByLoginLoader)

const otherIdentifiersByUserIdLoader = new OneToManyLoader({
  fetch: async (userInternalIds: number[]) => await database.getOtherIdentifiersByUserIds(userInternalIds),
  extractKey: row => row.userInternalId
})

const groupsByUserInternalIdLoader = new ManyJoinedLoader({
  fetch: async (userInternalIds: number[]) => await database.getGroupsByUserIds(userInternalIds)
})

export class AccessUserService extends AuthService<AccessUser> {
  async find (filter?: AccessUserFilter) {
    if (filter?.self && this.user) {
      filter ??= {}
      filter.internalIds = intersect({ skipEmpty: true }, filter.internalIds, [this.user.internalId])
    }
    const users = await database.getAccessUsers(filter)

    if (appConfig.userLookups.searchUsers && Array.isArray(users) && users.length > 0) {
      const identifiers = users.map(u => ({ label: 'login', id: u.login }))
      // const query = { search: filter?.search, identifiers, groupings: filter?.otherGroupingsByLabel }
      // const remoteUsers = await appConfig.userLookups.searchUsers(query)
    }

    this.loaders.prime(accessUsersByIdLoader, users)
    return users
  }

  async findByInternalId (internalUserId: number) {
    return await this.loaders.get(accessUsersByIdLoader).load(internalUserId)
  }

  async findByLogin (login: string) {
    return await this.loaders.get(accessUsersByLoginLoader).load(login)
  }

  async getOtherIdentifiers (internalUserId: number) {
    return await this.loaders.get(otherIdentifiersByUserIdLoader).load(internalUserId)
  }

  async getGroupsByUserId (internalUserId: number) {
    return await this.loaders.get(groupsByUserInternalIdLoader).load(internalUserId)
  }
}
