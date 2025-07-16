import { extractMergedFilters } from '@txstate-mws/carbon-svelte'
import { api, type AppRequestFilter } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, url }) => {
  const filters: Omit<AppRequestFilter, 'indexes'> | undefined = extractMergedFilters(url)
  const [response, allPeriods] = await Promise.all([
    api.getAppRequests(filters),
    api.getPeriodList()
  ])
  const openPeriods = allPeriods.filter(p => p.actions.createAppRequest)
  return { ...response, allPeriods, openPeriods, filters }
}
