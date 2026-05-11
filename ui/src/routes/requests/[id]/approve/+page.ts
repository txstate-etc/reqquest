import { error, redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { PageLoad } from './$types'
import { enumRequirementStatus, enumRequirementType } from '$lib'
import { excludeAppsByReqTypesAndStatus } from '$internal'

export const load: PageLoad = async ({ params, parent }) => {
  const { basicRequestData } = await parent()
  // exclude previously ineligible applications from default landing 
  excludeAppsByReqTypesAndStatus([basicRequestData], [enumRequirementType.PREQUAL, enumRequirementType.QUALIFICATION], [enumRequirementStatus.DISQUALIFYING])
  const key = basicRequestData.applications[0]?.programKey
  if (!key) throw error(404, 'Program not found')
  throw redirect(303, `${base}/requests/${params.id}/approve/${key}`)
}
