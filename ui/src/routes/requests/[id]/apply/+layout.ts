import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ params, depends }) => {
  const { appRequest, prequalPrompts, postqualPrompts } = await api.getApplyNavigation(params.id)
  depends('request:apply')
  if (!appRequest) throw error(404, 'Request not found.')
  return { appRequestForNavigation: appRequest, prequalPrompts, postqualPrompts }
}
