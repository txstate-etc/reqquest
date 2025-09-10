import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ depends }) => {
  const roles = await api.getRoleList()
  depends('api:getRoleList')
  return { roles: roles?.map(role => ({ ...role, groupNames: role.groups.map(group => group.groupName) })) }
}
