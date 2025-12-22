import { api, enumAppRequestStatus } from '$lib'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ params, depends }) => {
  const { appRequest, ...applicationInfo } = await api.getAppRequestForExport(params.id)
  depends('request:apply')
  if (![enumAppRequestStatus.STARTED, enumAppRequestStatus.READY_TO_SUBMIT].includes(appRequest.status as any)) throw error(404, 'This application cannot be edited at this time.')
  return { ...applicationInfo, appRequestForExport: { ...appRequest, applications: undefined } }
}
