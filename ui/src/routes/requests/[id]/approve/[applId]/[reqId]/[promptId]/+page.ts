import { api } from '$lib'
import { error, type Load } from '@sveltejs/kit'

export const load: Load = async ({ params }) => {
  const { id: appRequestId, applId, reqId, promptId } = params
  if (!appRequestId || !applId || !reqId || !promptId) error(404, 'Invalid URL.')
  const appRequest = await api.getAppRequest(appRequestId)

  if (!appRequest) error(404, 'App Request not found.')

  return { appRequest, applId, reqId, promptId }
}
