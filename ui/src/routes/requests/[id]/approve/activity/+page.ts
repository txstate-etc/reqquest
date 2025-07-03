import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { extractMergedFilters } from '@txstate-mws/carbon-svelte'

export const load: PageLoad = async ({ params, url, depends }) => {
  const filters = extractMergedFilters(url)
  const activity = await api.getRequestActivity(params.id, filters)
  depends('request:approve:activity')
  if (!activity) throw error(404, 'App Request not found. It may have been deleted or you do not have permission to view it.')
  return { activity }
}
