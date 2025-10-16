import { api } from '$lib'
import { extractMergedFilters, extractPaginationParams } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import type { AccessUserFilter, Pagination } from '$lib'

export const load: PageLoad = async ({ url, depends }) => {
  const { search, applicationRoles } = extractMergedFilters(url)
  const { page, pagesize } = extractPaginationParams(url)
  const pageFilter: Pagination = { page, perPage: pagesize }
  // Get access data
  const accessUsersFilter: AccessUserFilter = {}
  if (search) accessUsersFilter.search = search
  // groupings is a map<label, ids>
  if (Array.isArray(applicationRoles) && applicationRoles.length > 0) {
    accessUsersFilter.roles = applicationRoles
  }
  // Dynamically add groupings
  // const groupings = new Map<string, string[]>()
  // if (Array.isArray(institutionalRoles) && institutionalRoles.length > 0) {
  //   for (const id of institutionalRoles) groupings.push({ label: 'institutionalRole', id })
  // }
  // if (groupings.size > 0) accessUsersFilter.otherGroupingsByLabel = Array.from(groupings).map(g => ({ label: g[0], ids: g[1] }))
  const { users, pageInfo } = await api.getAccessUsers(accessUsersFilter, pageFilter)
  depends('api:getAccessUsers')
  return { users, pageInfo }
}
