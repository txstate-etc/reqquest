import { api, enumAppRequestStatus } from '$lib'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ params, depends }) => {
  const { promptLookup, appRequest, prequalPrompts, postqualPrompts } = await api.getAppRequestForExport(params.id)
  depends('request:apply')
  if (!appRequest) throw error(404, 'Request not found.')
  if ([enumAppRequestStatus.APPROVAL, enumAppRequestStatus.REVIEW_COMPLETE, enumAppRequestStatus.PREAPPROVAL].includes(appRequest.status as any)) throw error(403, 'Your application is under review.')
  return { promptLookup, appRequestForExport: appRequest, prequalPrompts, postqualPrompts }
}
