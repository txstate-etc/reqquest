import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends }) => {
  const appRequestData = await api.getAppRequestData(params.id)
  depends('request:apply')
  return { appRequestData }
}
