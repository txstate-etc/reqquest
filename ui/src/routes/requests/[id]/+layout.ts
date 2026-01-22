import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async input => {
  const appRequest = await api.getBasicRequestData(input.params.id)
  input.depends('request:id')
  if (!appRequest) throw error(404, 'App Request not found. It may have been deleted or you do not have permission to view it.')
  return { basicRequestData: appRequest, requestId: input.params.id }
}
