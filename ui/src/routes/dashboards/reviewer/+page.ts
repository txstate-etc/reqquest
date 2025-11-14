import { api } from '$lib'
import { extractPaginationParams } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url }) => {
  const { page, pagesize } = extractPaginationParams(url)
  const [appRequests, periods] = await Promise.all([
    api.getApplicantRequests({}, {
      page,
      perPage: pagesize
    }),
    api.getPeriodList()
  ])

  return { appRequests, period: periods[0] }
}
