import { error, redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { PageLoad } from './$types'
import { excludePreSubmissionIneligibleApps } from '$internal'

export const load: PageLoad = async ({ params, parent }) => {
  const { basicRequestData } = await parent()
  // exclude previously ineligible applications from default landing
  const eligibleApps = excludePreSubmissionIneligibleApps([basicRequestData])
  const key = eligibleApps[0]?.applications[0]?.programKey
  if (!key) throw error(404, 'Program not found')
  throw redirect(303, `${base}/requests/${params.id}/approve/${key}`)
}
