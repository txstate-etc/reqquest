import { extractMergedFilters, extractPaginationParams } from '@txstate-mws/carbon-svelte'
import { api } from '$internal'
import type { AppRequestFilter } from '$lib'
import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

export const _defaultRequestListFilters = {}

export const load: PageLoad = async ({ url, parent }) => {
  const { access } = await parent()
  if (!access.viewAppRequestList) throw error(403)
  const { page, pagesize } = extractPaginationParams(url)
  const filters: Omit<AppRequestFilter, 'indexes'> | undefined = extractMergedFilters(url)
  const [response, allPeriods] = await Promise.all([
    api.getAppRequests(filters, { page, perPage: pagesize }),
    api.getPeriodList()
  ])
  const openPeriods = allPeriods.filter(p => p.actions.createAppRequest)
  return { ...response, allPeriods, openPeriods, filters }
}
