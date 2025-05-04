import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends }) => {
  const appRequest = await api.getReviewData(params.id)
  depends('request:approve')
  if (!appRequest) throw error(404, 'App Request not found')
  return { appRequest }
}
