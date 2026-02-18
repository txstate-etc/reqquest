import { api, APP_REQUEST_STATUS_CONFIG, getPastStatuses } from '$internal'
import type { DashboardAppRequest } from '$internal'
import type { AppRequestStatus } from '$lib'
import { error } from '@sveltejs/kit'
import { extractMergedFilters } from '@txstate-mws/carbon-svelte'
import { sortby, unique } from 'txstate-utils'
import { uiRegistry } from '../../../local/index.js'
import type { PageLoad } from './$types'

function statusLabelsToEnums (labels: string[]): AppRequestStatus[] {
  const keys = Object.keys(APP_REQUEST_STATUS_CONFIG) as AppRequestStatus[]
  return keys.filter(k => labels.includes(APP_REQUEST_STATUS_CONFIG[k].tags[0].label))
}

export const load: PageLoad = async ({ url, depends, parent }) => {
  const { access } = await parent()
  if (!access.viewApplicantDashboard) throw error(403)

  depends('api:getApplicantRequests')
  depends('api:getOpenPeriods')
  depends('api:getAccess')

  const filters = extractMergedFilters(url)
  const currentTab = filters.t ?? 'recent_applications'
  const recentDays = uiRegistry.config.applicantDashboardRecentDays ?? 30
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - recentDays)
  const recentCutoffIso = cutoff.toISOString()

  const pastStatuses = new Set(getPastStatuses())
  // an app is "past" only if it's both older than the cutoff AND in a terminal status;
  // apps with active statuses (e.g. APPROVAL) always stay on the recent tab regardless of age
  function isPastApp (r: DashboardAppRequest) {
    return r.updatedAt < recentCutoffIso && pastStatuses.has(r.status)
  }

  // fetch for all own apps, then split
  const [allRequests, openPeriods] = await Promise.all([
    api.getApplicantRequests({ own: true }),
    api.getOpenPeriods()
  ])

  if (currentTab === 'past_applications') {
    const allPastRequests = allRequests.filter(isPastApp)

    const hasActiveFilters = filters.periodIds?.length > 0 || filters.status?.length > 0 || !!filters.search

    let displayRequests: typeof allPastRequests
    if (hasActiveFilters) {
      displayRequests = await api.getApplicantRequests({
        own: true,
        updatedBefore: recentCutoffIso,
        status: filters.status?.length > 0 ? statusLabelsToEnums(filters.status) : getPastStatuses(),
        ...(filters.search && { search: filters.search }),
        ...(filters.periodIds?.length > 0 && { periodIds: filters.periodIds })
      })
    } else {
      displayRequests = allPastRequests
    }

    // get the period options available for filtering from the unfiltered past set
    const periods = allPastRequests.filter(r => r.period.id).map(r => ({ id: r.period.id, name: r.period.name }))
    const availablePeriods = sortby(unique(periods, 'id'), 'name')

    // get status options available for filtering
    const statusesInData = new Set(allPastRequests.map(r => r.status))
    const configKeys = Object.keys(APP_REQUEST_STATUS_CONFIG) as AppRequestStatus[]
    const availableStatuses = unique(
      configKeys.filter(k => statusesInData.has(k)).map(k => APP_REQUEST_STATUS_CONFIG[k].tags[0].label)
    )

    return {
      appRequests: hasActiveFilters ? displayRequests : allPastRequests,
      availablePeriods, availableStatuses, openPeriods, access, recentCutoffIso, recentDays
    }
  } else {
    return {
      appRequests: allRequests.filter(r => !isPastApp(r)),
      openPeriods, access, recentCutoffIso, recentDays,
      availablePeriods: [] as { id: string, name: string }[],
      availableStatuses: [] as string[]
    }
  }
}
