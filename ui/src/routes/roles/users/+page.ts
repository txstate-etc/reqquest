import { api } from '$lib'
import type { PageLoad } from '../../$types'

export const load: PageLoad = async ({ url, depends }) => {
  const users = []

  // Get access data
  const access = await api.getAccess()
  depends('api:getAccess')
  return { users, access }
}
