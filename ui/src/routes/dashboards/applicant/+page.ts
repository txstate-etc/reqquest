import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ depends }) => {
  const [appRequests, openPeriods] = await Promise.all([
    api.getApplicantRequests(),
    api.getOpenPeriods()
  ])
  depends('api:getApplicantRequests')
  return { appRequests, openPeriods }
}
