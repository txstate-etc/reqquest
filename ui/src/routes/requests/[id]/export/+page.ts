import { api } from '$internal'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends, parent }) => {
  const details = await api.getAppRequestForExport(params.id)

  depends('request:export')
  return {
    ...details,
    appData: details.appRequest.data
  }
}
