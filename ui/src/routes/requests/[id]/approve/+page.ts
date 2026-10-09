import { redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { PageLoad } from './$types'
import { excludeApplicantRequirementIneligibleApps } from '$internal'

export const load: PageLoad = async ({ params, parent }) => {
  const { basicRequestData } = await parent()
  // exclude previously ineligible applications from default landing
  const eligibleApps = excludeApplicantRequirementIneligibleApps([basicRequestData])
  const key = eligibleApps[0]?.applications[0]?.programKey ?? basicRequestData.applications[0]?.programKey // if no eligibile get first ineligible
  // every program can be hidden from reviewers by showIneligiblePreSubmit: false, leaving only the activity log
  if (!key) throw redirect(303, `${base}/requests/${params.id}/approve/activity`)
  throw redirect(303, `${base}/requests/${params.id}/approve/${key}`)
}
