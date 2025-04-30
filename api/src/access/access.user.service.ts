import { ManyJoinedLoader, OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { AuthService } from '../internal.js'
import { AccessDatabase as database } from './access.database.js'
import { type AccessUserFilter, AccessUser } from './access.model.js'

const accessUsersByIdLoader = new PrimaryKeyLoader({
  fetch: async (internalIds: number[]) => await database.getAccessUsers({ internalIds }),
  extractId: 'internalId'
})

const otherIdentifiersByUserIdLoader = new OneToManyLoader({
  fetch: async (userInternalIds: number[]) => await database.getOtherIdentifiersByUserIds(userInternalIds),
  extractKey: row => row.userInternalId
})

const groupsByUserInternalIdLoader = new ManyJoinedLoader({
  fetch: async (userInternalIds: number[]) => await database.getGroupsByUserIds(userInternalIds)
})

export class AccessUserService extends AuthService<AccessUser> {
  async find (filter?: AccessUserFilter) {
    const users = await database.getAccessUsers(filter)
    const primaryLoader = this.loaders.get(accessUsersByIdLoader)
    for (const user of users) primaryLoader.prime(user.internalId, user)
    return users
  }

  async findByInternalId (internalUserId: number) {
    return await this.loaders.get(accessUsersByIdLoader).load(internalUserId)
  }

  async getOtherIdentifiers (internalUserId: number) {
    return await this.loaders.get(otherIdentifiersByUserIdLoader).load(internalUserId)
  }

  async getGroupsByUserId (internalUserId: number) {
    return await this.loaders.get(groupsByUserInternalIdLoader).load(internalUserId)
  }
}
