import { error, redirect } from '@sveltejs/kit'
import { extractMergedFilters, extractPaginationParams } from '@txstate-mws/carbon-svelte'
import { DateTime } from 'luxon'
import { sortby, toQuery } from 'txstate-utils'
import { api, flattenStatusFilter } from '$internal'
import { enumAppRequestStatus, type AppRequestFilter } from '$lib'
import type { PageLoad } from './$types'

export const _reviewPendingStatuses = [enumAppRequestStatus.PREAPPROVAL, enumAppRequestStatus.APPROVAL]
export const _inReviewStatuses = [enumAppRequestStatus.REVIEW_IN_PROGRESS]
export const _reviewCompleteStatuses = [enumAppRequestStatus.REVIEW_COMPLETE, enumAppRequestStatus.ACCEPTANCE, enumAppRequestStatus.READY_TO_ACCEPT, enumAppRequestStatus.ACCEPTED, enumAppRequestStatus.NOT_ACCEPTED, enumAppRequestStatus.APPROVED, enumAppRequestStatus.NOT_APPROVED]
export const _reviewerDashboardInReviewStatuses = [..._reviewPendingStatuses, ..._inReviewStatuses]
export const _defaultReviewerDashboardFilters = { t: { status: _reviewPendingStatuses } }

export const load: PageLoad = async ({ url, parent }) => {
  const { access } = await parent()
  if (!access.viewReviewerInterface) throw error(403)
  if (!url.search) redirect(302, '?' + toQuery(_defaultReviewerDashboardFilters))
  const { page, pagesize } = extractPaginationParams(url)
  const { status, ...rest } = extractMergedFilters(url)
  const merged: AppRequestFilter = { ...rest, status: flattenStatusFilter(status), closed: false }
  const now = DateTime.now()

  const [{ appRequests, pageInfo, appRequestIndexes }, appCount, periods] = await Promise.all([
    api.getReviewerDashboardRequests(merged, {
      page,
      perPage: pagesize ?? 25
    }),
    api.getApplicationCount({ closed: false, status: _reviewerDashboardInReviewStatuses }),
    api.getPeriodList({ opensAfter: now.minus({ years: 2 }).toISO() })
  ])

  const openPeriods = sortby(periods.filter(p => DateTime.fromISO(p.openDate) <= now && (p.closeDate == null || DateTime.fromISO(p.closeDate) >= now)), 'openDate', true)
  const futurePeriods = sortby(periods.filter(p => DateTime.fromISO(p.openDate) > now), 'openDate', false)
  const pastPeriods = sortby(periods.filter(p => p.closeDate != null && DateTime.fromISO(p.closeDate) < now), 'closeDate', true)
  const period = openPeriods.at(0) ?? futurePeriods.at(0) ?? pastPeriods.at(0)

  return { appRequests, totalItems: pageInfo.appRequests!.totalItems ?? appRequests.length, period, filters: merged, appCount, appRequestIndexes }
}
