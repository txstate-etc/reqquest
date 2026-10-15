import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, depends, parent }) => {
  const { access } = await parent()
  // access is missing only when the layout failed; it renders layoutError in place of the page, so don't mask it
  if (!access) return {} as never
  if (!access.viewRoleManagement) throw error(403)
  const roles = (await api.getRoleList()) ?? []
  depends('api:getRoleList')
  return { roles, access }
}
