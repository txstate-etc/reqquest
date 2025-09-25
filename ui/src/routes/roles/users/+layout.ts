import { api } from '$lib'
import { extractMergedFilters, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
import type { LayoutLoad } from '../$types'

export const load: LayoutLoad = async ({ url, depends }) => {
  const { search, institutionalRoles, applicationRoles } = extractMergedFilters(url)
  // Get access data
  const availableInstitutionalRoles: ComboMenuItem[] = [{ value: 'Faculty' }, { value: 'Staff' }, { value: 'Student' }]
  const appRoles = (await api.getRoleList()) ?? []
  const availableApplicationRoles: ComboMenuItem[] = appRoles.map(role => ({ label: role.name, value: role.id }))

  depends('api:getRoleList')
  return { availableApplicationRoles, availableInstitutionalRoles }
}
