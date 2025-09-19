import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, depends }) => {
  const roles = await api.getRoleList()

  // Get access data
  const access = await api.getAccess()
  depends('api:getRoleList')
  return { roles, access }
}
