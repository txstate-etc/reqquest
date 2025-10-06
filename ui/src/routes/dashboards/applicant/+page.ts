import { api } from '$lib'
import { extractMergedFilters } from '@txstate-mws/carbon-svelte'
import { uiRegistry } from '../../../local/index.js'
import type { PageLoad } from './$types'
import type { AppRequestFilter } from '$lib/typed-client/schema'

function getRecentCutoffDate (daysAgo: number): string {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - daysAgo)
  return cutoff.toISOString()
}

function buildApiFilters (
  currentTab: string,
  filters: ReturnType<typeof extractMergedFilters>,
  recentCutoffIso: string
): AppRequestFilter {
  const baseFilter: AppRequestFilter = { own: true }

  if (currentTab === 'past_applications') {
    return {
      ...baseFilter,
      updatedBefore: recentCutoffIso,
      ...(filters.yearSubmitted?.length > 0 && {
        createdAfter: `${Math.min(...filters.yearSubmitted.map(Number))}-01-01T00:00:00Z`,
        createdBefore: `${Math.max(...filters.yearSubmitted.map(Number))}-12-31T23:59:59Z`
      }),
      ...(filters.search && { search: filters.search })
    }
  }

  return {
    ...baseFilter,
    updatedAfter: recentCutoffIso
  }
}

export const load: PageLoad = async ({ url, depends }) => {
  const filters = extractMergedFilters(url)
  const currentTab = filters.t ?? 'recent_applications'

  // Get configurable recent days (default 30)
  const recentDays = uiRegistry.config.applicantDashboardRecentDays ?? 30
  const recentCutoffIso = getRecentCutoffDate(recentDays)

  const apiFilters = buildApiFilters(currentTab, filters, recentCutoffIso)

  const [appRequests, openPeriods, access] = await Promise.all([
    api.getApplicantRequests(apiFilters),
    api.getOpenPeriods(),
    api.getAccess()
  ])

  // Extract available years for the year filter dropdown (only used on past_applications tab)
  let availableYears: number[] = []
  if (currentTab === 'past_applications' && (!filters.yearSubmitted || filters.yearSubmitted.length === 0)) {
    const allPastRequests = await api.getApplicantRequests({
      own: true,
      updatedBefore: recentCutoffIso
    })
    availableYears = [...new Set(
      allPastRequests.map(req => new Date(req.createdAt).getFullYear())
    )].sort((a, b) => b - a)
  }

  // Register dependencies for cache invalidation
  depends('api:getApplicantRequests')
  depends('api:getOpenPeriods')
  depends('api:getAccess')

  return { appRequests, availableYears, openPeriods, access, initialFilters: filters }
}
