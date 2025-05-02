import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const appRequests = await api.getApplicantRequests()
  return { appRequests }
}
