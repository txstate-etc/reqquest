import { api, enumAppRequestStatus } from '$lib'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ params, depends }) => {
  const { appRequest, ...applicationInfo } = await api.getAppRequestForExport(params.id)
  depends('request:apply')
  if (![enumAppRequestStatus.ACCEPTANCE, enumAppRequestStatus.READY_TO_ACCEPT].includes(appRequest.status as any)) throw error(404, 'This application has already been accepted.')
  return { ...applicationInfo, appRequestForExport: { ...appRequest, applications: undefined } }
}
