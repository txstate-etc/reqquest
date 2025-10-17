import { ManyJoinedLoader, OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { appConfig, AuthService, Pagination, PaginationInfoWithTotalItems } from '../internal.js'
import { AccessDatabase, AccessDatabase as database } from './access.database.js'
import { type AccessUserFilter, AccessUser } from './access.model.js'
import { Cache, intersect } from 'txstate-utils'

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

const allCategoryCache = new Cache(async () => {
  const indexes = appConfig.userLookups.indexes
  if (!indexes || !indexes.length) return []
  const ids = await Promise.all(indexes.map(i => AccessDatabase.getaccessUserCategoryIdsByLabel(i.label)))
  const categories = []
  for (const i in indexes) {
    const index = indexes[i]
    categories.push({ label: index.label, displayLabel: index.displayLabel, ids: ids[i], useInFilters: index.useInFilters, useInList: index.useInList })
  }
  return categories
}, { freshseconds: 30, staleseconds: 600 }) // 30 seconds, 5 minutes

export class AccessUserService extends AuthService<AccessUser> {
  async find (pageInfo: PaginationInfoWithTotalItems, filter?: AccessUserFilter, paged?: Pagination) {
    if (filter?.self && this.user) {
      filter ??= {}
      filter.internalIds = intersect({ skipEmpty: true }, filter.internalIds, [this.user.internalId])
    }
    // PAGING
    // TODO: Push counting and paging/limit to database
    let start = 0
    let end = undefined
    const users = await database.getAccessUsers(filter)
    this.loaders.prime(accessUsersByIdLoader, users)
    const total = users.length
    pageInfo.categories = await allCategoryCache.get()
    if (paged?.page || paged?.perPage) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      pageInfo.perPage = paged?.perPage || 100 // 0 should also be overridden, so || is better than nullish coalescing ??
      pageInfo.totalItems = total
      pageInfo.hasNextPage = total > pageInfo.currentPage * pageInfo.perPage
      start = ((paged.page ?? 1) - 1) * pageInfo.perPage
      end = start + pageInfo.perPage
      return users.slice(start, end)
    } else {
      pageInfo.totalItems = total
      pageInfo.currentPage = 1
      pageInfo.perPage = undefined
      pageInfo.hasNextPage = false
      return users
    }
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
