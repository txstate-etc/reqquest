import { api } from '$internal'
import { extractPaginationParams } from '@txstate-mws/carbon-svelte'
import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ url, parent }) => {
  const { access } = await parent()
  if (!access.viewReviewerInterface) throw error(403)
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
