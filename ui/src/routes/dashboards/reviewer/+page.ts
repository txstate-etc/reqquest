import { error, redirect } from '@sveltejs/kit'
import { extractMergedFilters, extractPaginationParams } from '@txstate-mws/carbon-svelte'
import { toQuery } from 'txstate-utils'
import { api, splitStatusFilter } from '$internal'
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
  const { status, closed: closedOnly, ...rest } = extractMergedFilters(url)
  // open requests by default; closed ones only when the Filter pop-out's "Closed or Cancelled only" is checked
  const closed = closedOnly === true
  const merged: AppRequestFilter = { ...rest, status: splitStatusFilter(status).status, closed }

  const [{ appRequests, pageInfo, appRequestIndexes }, pending, inReview, complete, applicantCounts, avgDecisionSeconds, programs, periods] = await Promise.all([
    api.getReviewerDashboardRequests(merged, {
      page,
      perPage: pagesize ?? 25
    }),
    // counts and tiles follow the same open/closed choice as the list, so they describe what it can show
    api.getApplicationCount({ closed, status: _reviewPendingStatuses }),
    api.getApplicationCount({ closed, status: _inReviewStatuses }),
    api.getApplicationCount({ closed, status: _reviewCompleteStatuses }),
    api.getAppRequestApplicantCounts({ closed, status: _reviewerDashboardStatuses }),
    access.viewMetrics ? api.getReviewDecisionTiming() : Promise.resolve(null),
    api.getPrograms(),
    api.getPeriodList()
  ])

  return { appRequests, totalItems: pageInfo.appRequests!.totalItems ?? appRequests.length, filters: merged, appRequestIndexes, tabCounts: { pending, inReview, complete }, applicantCounts, avgDecisionSeconds, viewMetrics: !!access?.viewMetrics, programs, periods }
}
