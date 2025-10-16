import { api } from '$lib'
import { extractMergedFilters, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import type { AccessUserFilter } from '$lib'

export const load: PageLoad = async ({ url, depends }) => {
  const { search, applicationRoles } = extractMergedFilters(url)
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
  const { users, pageInfo } = await api.getAccessUsers(accessUsersFilter)
  console.debug(`accessUsers pageInfo: ${JSON.stringify(pageInfo)}`)
  depends('api:getAccessUsers')
  return { users, pageInfo }
}
