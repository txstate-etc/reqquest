import { api } from '$lib'
import { extractMergedFilters, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import type { AccessUserFilter } from '$lib'

export const load: PageLoad = async ({ url, depends }) => {
  const { search, institutionalRoles, applicationRoles } = extractMergedFilters(url)
  // Get access data
  const groupings: { label: string, id: string }[] = []
  const accessUsersFilter: AccessUserFilter = {}
  if (search) accessUsersFilter.search = search
  if (Array.isArray(institutionalRoles) && institutionalRoles.length > 0) {
    for (const id of institutionalRoles) groupings.push({ label: 'institutionalRole', id })
  }
  if (Array.isArray(applicationRoles) && applicationRoles.length > 0) {
    for (const id of applicationRoles) groupings.push({ label: 'applicationRole', id })
  }
  if (groupings.length > 0) accessUsersFilter.otherGroupingsByLabel = groupings
  const users = await api.getAccessUsers(accessUsersFilter)
  depends('api:getAccessUsers')
  return { users }
}
