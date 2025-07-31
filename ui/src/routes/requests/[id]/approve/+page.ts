import { error, redirect } from '@sveltejs/kit'
import { base } from '$app/paths'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, parent }) => {
  const { basicRequestData } = await parent()
  const key = basicRequestData.applications[0].programKey
  if (!key) throw error(404, 'Program not found')
  throw redirect(303, `${base}/requests/${params.id}/approve/${key}`)
}
