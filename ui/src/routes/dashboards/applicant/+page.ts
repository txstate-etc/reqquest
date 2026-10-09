import { api, APP_REQUEST_STATUS_CONFIG, getPastStatuses } from '$internal'
import type { DashboardAppRequest } from '$internal'
import type { AppRequestStatus } from '$lib'
import { error } from '@sveltejs/kit'
import { extractMergedFilters } from '@txstate-mws/carbon-svelte'
import { sortby, unique } from 'txstate-utils'
import { uiRegistry } from '../../../local/index.js'
import type { PageLoad } from './$types'
import { excludeApplicantRequirementIneligibleApps } from '$internal'

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
  // an app is "past" only if it's both older than the cutoff AND finished - in a terminal status
  // or closed (closing leaves the status where it was, e.g. APPROVAL); other apps with active
  // statuses always stay on the recent tab regardless of age
  function isPastApp (r: DashboardAppRequest) {
    return r.updatedAt < recentCutoffIso && (r.closedAt != null || pastStatuses.has(r.status))
  }


  // fetch for all own apps, then split
  const [allRequests, openPeriods, announcement] = await Promise.all([
    api.getApplicantRequests({ own: true }),
    api.getOpenPeriods(),
    api.getAnnouncement(true)
  ])

  const allRequestsSansIneligibleApps = excludeApplicantRequirementIneligibleApps(allRequests)
  if (currentTab === 'past_applications') {
    const allPastRequests = allRequestsSansIneligibleApps.filter(isPastApp)

    const hasActiveFilters = filters.periodIds?.length > 0 || filters.status?.length > 0 || !!filters.search

    let displayRequests: typeof allPastRequests
    if (hasActiveFilters) {
      // "past" is terminal status OR closed, which the API filter cannot express, so narrow on
      // the server by the user's filters and apply isPastApp here
      displayRequests = (await api.getApplicantRequests({
        own: true,
        updatedBefore: recentCutoffIso,
        ...(filters.status?.length > 0 && { status: statusLabelsToEnums(filters.status) }),
        ...(filters.search && { search: filters.search }),
        ...(filters.periodIds?.length > 0 && { periodIds: filters.periodIds })
      })).filter(isPastApp)
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
      availablePeriods, availableStatuses, openPeriods, access, recentCutoffIso, recentDays,
      announcement
    }
  } else {
    return {
      appRequests: allRequestsSansIneligibleApps.filter(r => !isPastApp(r)),
      openPeriods, access, recentCutoffIso, recentDays,
      availablePeriods: [] as { id: string, name: string }[],
      availableStatuses: [] as string[],
      announcement
    }
  }
}
