import { api } from '$lib'
import { extractMergedFilters, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import type { AccessUserFilter } from '$lib'

export const load: PageLoad = async ({ url, depends }) => {
  const { search, institutionalRoles, applicationRoles } = extractMergedFilters(url)
  // Get access data
  let searchFlag = false
  const accessUsersFilter: AccessUserFilter = {}
  if (search) {
    accessUsersFilter.search = search
    searchFlag = true
  }
  if (Array.isArray(institutionalRoles) && institutionalRoles.length > 0) {
    // TODO: Setup way to search by Institutional Roles
    searchFlag = true
  }
  if (Array.isArray(applicationRoles) && applicationRoles.length > 0) {
    // TODO: Find way to search by Application Roles
    searchFlag = true
  }
  if (searchFlag) {
    const users = await api.getAccessUsers(accessUsersFilter)
    depends('api:getAccessUsers')
    return { users }
  }
  return { users: [] }
}
