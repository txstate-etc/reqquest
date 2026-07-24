import { api } from '$internal'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ params, depends }) => {
  const { appRequest, ...applicationInfo } = await api.getAppRequestForExport(params.id)
  depends('request:apply')
  // separate depend key so the nav/answered state can be refreshed without re-running the prompt page load, which was remounting the current prompt and could flash a skeleton.
  depends('request:apply:nav')
  if (!appRequest.actions.viewApplyUI) throw error(404, 'This application cannot be edited at this time.')
  return { ...applicationInfo, appRequestForExport: { ...appRequest, applications: undefined } }
}
