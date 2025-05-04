import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  const requests = await api.getAppRequests({})
  return { requests }
}
