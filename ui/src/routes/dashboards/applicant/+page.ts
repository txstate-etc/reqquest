import { api } from '$lib'
import { extractMergedFilters } from '@txstate-mws/carbon-svelte'
import { uiRegistry } from '../../../local/index.js'
import type { PageLoad } from './$types'
import type { AppRequestFilter } from '$lib/typed-client/schema'

// TODO: This is pending a review of how apps should be categorized by tab...previously this was current/past and more status based
function getRecentCutoffDate (daysAgo: number): string {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - daysAgo)
  return cutoff.toISOString()
}

export const load: PageLoad = async ({ url, depends }) => {
  const filters = extractMergedFilters(url)
  const currentTab = filters.t ?? 'recent_applications'

  // Get configurable recent days (default 30)
  const recentDays = uiRegistry.config.applicantDashboardRecentDays ?? 30
  const recentCutoffIso = getRecentCutoffDate(recentDays)

  const apiFilters: AppRequestFilter = { own: true }

  if (currentTab === 'past_applications') {
    // Past applications: not updated within recent threshold
    apiFilters.updatedBefore = recentCutoffIso

    // Add year filtering if specified (based on creation year)
    if (filters.yearSubmitted?.length > 0) {
      const years = filters.yearSubmitted.map(Number)
      apiFilters.createdAfter = `${Math.min(...years)}-01-01T00:00:00Z`
      apiFilters.createdBefore = `${Math.max(...years)}-12-31T23:59:59Z`
    }

    // Add search if specified
    if (filters.search) {
      apiFilters.search = filters.search
    }
  } else {
    // Recent applications tab - shows applications updated within recent days
    apiFilters.updatedAfter = recentCutoffIso
  }

  // Load applications and open periods
  const [appRequests, openPeriods] = await Promise.all([
    api.getApplicantRequests(apiFilters),
    api.getOpenPeriods()
  ])

  // Extract available years for the year filter dropdown
  const requestsForYearExtraction = currentTab === 'past_applications'
    ? await api.getApplicantRequests({ own: true, updatedBefore: recentCutoffIso })
    : appRequests
  const availableYears = [...new Set(
    requestsForYearExtraction.map(req => new Date(req.createdAt).getFullYear())
  )].sort((a, b) => b - a) // Sort newest year first

  // Get access data
  const access = await api.getAccess()

  depends('api:getApplicantRequests')
  return { appRequests, availableYears, openPeriods, access, initialFilters: filters }
}
