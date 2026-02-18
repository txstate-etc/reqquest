import { error } from '@sveltejs/kit'
import { extractFilters, extractPaginationParams } from '@txstate-mws/carbon-svelte'
import { DateTime } from 'luxon'
import { sortby } from 'txstate-utils'
import { api } from '$internal'
import { enumAppRequestStatus, type AppRequestFilter } from '$lib'
import type { PageLoad } from './$types'

export const _dashboardStatuses = [enumAppRequestStatus.PREAPPROVAL, enumAppRequestStatus.APPROVAL, enumAppRequestStatus.ACCEPTANCE, enumAppRequestStatus.READY_TO_ACCEPT, enumAppRequestStatus.REVIEW_COMPLETE]
export const _defaultReviewerDashboardFilters = { closed: false, complete: false, reviewStarted: false, status: _dashboardStatuses }

export const load: PageLoad = async ({ url, parent }) => {
  const { access } = await parent()
  if (!access.viewReviewerInterface) throw error(403)
  const { page, pagesize } = extractPaginationParams(url)
  const filters = extractFilters(url)
  const merged: AppRequestFilter = { ...filters.f, ...filters.q, ...filters.t, search: filters.search, closed: false }
  if (!merged.reviewStarted && !merged.complete) {
    for (const key in _defaultReviewerDashboardFilters) {
      merged[key] = merged[key] ?? _defaultReviewerDashboardFilters[key]
    }
  }
  /** Previous - url.search check resulted in page params only on default 'Awaiting Review' view, excluded additional filters since not in url */
  // const merged: AppRequestFilter = url.search ? { ...filters.f, ...filters.q, ...filters.t, search: filters.search, closed: false } : { reviewStarted: false, ..._defaultReviewerDashboardFilters }
  const now = DateTime.now()

  const [{ appRequests, pageInfo, appRequestIndexes }, appCount, periods] = await Promise.all([
    api.getReviewerDashboardRequests(merged, {
      page,
      perPage: pagesize ?? 25
    }),
    api.getApplicationCount(_defaultReviewerDashboardFilters),
    api.getPeriodList({ opensAfter: now.minus({ years: 2 }).toISO() })
  ])

  const openPeriods = sortby(periods.filter(p => DateTime.fromISO(p.openDate) <= now && (p.closeDate == null || DateTime.fromISO(p.closeDate) >= now)), 'openDate', true)
  const futurePeriods = sortby(periods.filter(p => DateTime.fromISO(p.openDate) > now), 'openDate', false)
  const pastPeriods = sortby(periods.filter(p => p.closeDate != null && DateTime.fromISO(p.closeDate) < now), 'closeDate', true)
  const period = openPeriods.at(0) ?? futurePeriods.at(0) ?? pastPeriods.at(0)

  return { appRequests, totalItems: pageInfo.appRequests!.totalItems ?? appRequests.length, period, filters: merged, appCount, appRequestIndexes }
}
