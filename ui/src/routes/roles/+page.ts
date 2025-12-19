import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, depends, parent }) => {
  const { access } = await parent()
  if (!access.viewRoleManagement) throw error(403)
  const roles = (await api.getRoleList()) ?? []
  depends('api:getRoleList')
  return { roles, access }
}
