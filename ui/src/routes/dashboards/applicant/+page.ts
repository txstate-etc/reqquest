import { api, APP_REQUEST_STATUS_CONFIG } from '$internal'
import type { AppRequestFilter, AppRequestStatus } from '$lib'
import { error } from '@sveltejs/kit'
import { extractMergedFilters } from '@txstate-mws/carbon-svelte'
import { sortby, unique } from 'txstate-utils'
import { uiRegistry } from '../../../local/index.js'
import type { PageLoad } from './$types'

function statusLabelsToEnums (labels: string[]): AppRequestStatus[] {
  const keys = Object.keys(APP_REQUEST_STATUS_CONFIG) as AppRequestStatus[]
  return keys.filter(k => labels.includes(APP_REQUEST_STATUS_CONFIG[k].label))
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

  if (currentTab === 'past_applications') {
    const baseFilter: AppRequestFilter = { own: true, updatedBefore: recentCutoffIso }
    const hasActiveFilters = filters.periodIds?.length > 0 || filters.status?.length > 0 || !!filters.search
    const filteredFilter: AppRequestFilter = {
      ...baseFilter,
      ...(filters.periodIds?.length > 0 && { periodIds: filters.periodIds }),
      ...(filters.status?.length > 0 && { status: statusLabelsToEnums(filters.status) }),
      ...(filters.search && { search: filters.search })
    }

    // fetch all past requests and, if the user applied filters, a second filtered set
    const [allPastRequests, openPeriods, filteredRequests] = await Promise.all([
      api.getApplicantRequests(baseFilter),
      api.getOpenPeriods(),
      hasActiveFilters ? api.getApplicantRequests(filteredFilter) : undefined
    ] as const)

    // derive the period options available for filtering
    const periods = allPastRequests.filter(r => r.period?.id).map(r => ({ id: r.period!.id, name: r.period!.name }))
    const availablePeriods = sortby(unique(periods, 'id'), 'name')

    // derive the status options available for filtering
    const statusesInData = new Set(allPastRequests.map(r => r.status))
    const configKeys = Object.keys(APP_REQUEST_STATUS_CONFIG) as AppRequestStatus[]
    const availableStatuses = unique(
      configKeys.filter(k => statusesInData.has(k)).map(k => APP_REQUEST_STATUS_CONFIG[k].label)
    )

    // return filtered results when filters are active, otherwise all past requests
    return {
      appRequests: hasActiveFilters ? (filteredRequests ?? []) : allPastRequests,
      availablePeriods, availableStatuses, openPeriods, access, recentCutoffIso, recentDays
    }
  } else {
    // rencent apps
    const [appRequests, openPeriods] = await Promise.all([
      api.getApplicantRequests({ own: true, updatedAfter: recentCutoffIso }),
      api.getOpenPeriods()
    ])

    return {
      appRequests, openPeriods, access, recentCutoffIso, recentDays,
      availablePeriods: [] as { id: string, name: string }[],
      availableStatuses: [] as string[]
    }
  }
}
