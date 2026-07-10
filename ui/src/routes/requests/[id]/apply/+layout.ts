import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ params, depends }) => {
  const { appRequest, ...applicationInfo } = await api.getAppRequestForExport(params.id)
  depends('request:apply')
  if (!appRequest.actions.viewApplyUI) throw error(404, 'This application cannot be edited at this time.')
  console.log('LAYOUT.TS APPS FOR NAV---------')
  console.log(applicationInfo.applicationsForNav)
  return { ...applicationInfo, appRequestForExport: { ...appRequest, applications: undefined } }
}
