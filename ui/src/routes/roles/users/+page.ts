import { api } from '$lib'
import { extractMergedFilters, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import type { AccessUserFilter } from '$lib'

export const load: PageLoad = async ({ url, depends }) => {
  const { search, institutionalRoles, applicationRoles } = extractMergedFilters(url)
  // Get access data
  const groupings: { label: string, id: string }[] = []
  let searchFlag = false
  const accessUsersFilter: AccessUserFilter = {}
  if (search) {
    accessUsersFilter.search = search
    searchFlag = true
  }
  if (Array.isArray(institutionalRoles) && institutionalRoles.length > 0) {
    for (const id of institutionalRoles) {
      groupings.push({ label: 'institutionalRole', id })
    }
    searchFlag = true
  }
  if (Array.isArray(applicationRoles) && applicationRoles.length > 0) {
    for (const id of applicationRoles) {
      groupings.push({ label: 'applicationRole', id })
    }
    searchFlag = true
  }
  if (searchFlag) {
    if (groupings.length > 0) accessUsersFilter.otherGroupingsByLabel = groupings
    const users = await api.getAccessUsers(accessUsersFilter)
    depends('api:getAccessUsers')
    return { users, searchFlag }
  }
  return { users: [], searchFlag }
}
