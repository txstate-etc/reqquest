import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  const response = await api.getAppRequests({})
  return response
}
