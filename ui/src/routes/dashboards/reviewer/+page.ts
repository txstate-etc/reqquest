import { error, redirect } from '@sveltejs/kit'
import { extractMergedFilters, extractPaginationParams } from '@txstate-mws/carbon-svelte'
import { toQuery } from 'txstate-utils'
import { api, flattenStatusFilter } from '$internal'
import { enumAppRequestStatus, type AppRequestFilter } from '$lib'
import type { PageLoad } from './$types'

export const _reviewPendingStatuses = [enumAppRequestStatus.PREAPPROVAL, enumAppRequestStatus.APPROVAL]
export const _inReviewStatuses = [enumAppRequestStatus.REVIEW_IN_PROGRESS]
export const _reviewCompleteStatuses = [enumAppRequestStatus.REVIEW_COMPLETE, enumAppRequestStatus.ACCEPTANCE, enumAppRequestStatus.READY_TO_ACCEPT, enumAppRequestStatus.ACCEPTED, enumAppRequestStatus.NOT_ACCEPTED, enumAppRequestStatus.APPROVED, enumAppRequestStatus.NOT_APPROVED]
/** Everything the dashboard can show: the union of the three tabs. */
export const _reviewerDashboardStatuses = [..._reviewPendingStatuses, ..._inReviewStatuses, ..._reviewCompleteStatuses]
export const _defaultReviewerDashboardFilters = { t: { status: _reviewPendingStatuses } }

export const load: PageLoad = async ({ url, parent }) => {
  const { access } = await parent()
  if (!access.viewReviewerInterface) throw error(403)
  if (!url.search) redirect(302, '?' + toQuery(_defaultReviewerDashboardFilters))
  const { page, pagesize } = extractPaginationParams(url)
  const { status, ...rest } = extractMergedFilters(url)
  const merged: AppRequestFilter = { ...rest, status: flattenStatusFilter(status), closed: false }

  const [{ appRequests, pageInfo, appRequestIndexes }, pending, inReview, complete, applicantCounts, avgDecisionSeconds] = await Promise.all([
    api.getReviewerDashboardRequests(merged, {
      page,
      perPage: pagesize ?? 25
    }),
    api.getApplicationCount({ closed: false, status: _reviewPendingStatuses }),
    api.getApplicationCount({ closed: false, status: _inReviewStatuses }),
    api.getApplicationCount({ closed: false, status: _reviewCompleteStatuses }),
    api.getAppRequestApplicantCounts({ closed: false, status: _reviewerDashboardStatuses }),
    access.viewMetrics ? api.getReviewDecisionTiming() : Promise.resolve(null)
  ])

  return { appRequests, totalItems: pageInfo.appRequests!.totalItems ?? appRequests.length, filters: merged, appRequestIndexes, tabCounts: { pending, inReview, complete }, applicantCounts, avgDecisionSeconds }
}
