import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { extractMergedFilters, extractPaginationParams } from '@txstate-mws/carbon-svelte'

export const load: PageLoad = async ({ params, url, depends }) => {
  const filters = extractMergedFilters(url)
  const { page, pagesize } = extractPaginationParams(url)
  const { activity, pageInfo } = await api.getRequestActivity(params.id, filters, { page, perPage: pagesize })
  depends('request:approve:activity')
  return { activity, pageInfo }
}
