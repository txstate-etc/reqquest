import { api } from '$lib'
import { extractMergedFilters } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

export type AdminManagementTabs = 'role_management' | 'users'
export const load: PageLoad = async ({ url, depends }) => {
  const filters = extractMergedFilters(url)
  const currentTab: AdminManagementTabs = filters.t ?? 'role_management'
  // Need filter with initial entry being empty
  const users = (currentTab === 'users') ? [] : []
  // Default to roles
  const roles = (currentTab === 'role_management') ? await api.getRoleList() : []

  // Get access data
  const access = await api.getAccess()
  depends('api:getRoleList')
  return { roles, users, access }
}
