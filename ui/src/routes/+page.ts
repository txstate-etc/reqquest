import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { resolve } from '$app/paths'

export const load: PageLoad = async ({ parent }) => {
  const { access } = await parent()
  if (access.viewReviewerInterface) throw redirect(303, resolve('/dashboards/reviewer'))
  if (access.viewAppRequestList) throw redirect(303, resolve('/requests'))
  if (access.viewRoleManagement) throw redirect(303, resolve('/roles'))
  if (access.viewPeriodManagement) throw redirect(303, resolve('/periods'))
  throw redirect(303, resolve('/dashboards/applicant'))
}
