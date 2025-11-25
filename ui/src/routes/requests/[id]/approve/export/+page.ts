import { api } from '$lib'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends }) => {
  const details = await api.getAppRequestForExport(params.id)

  depends('request:reviewer-export')
  return {
    ...details,
    appData: details.appRequest.data
  }
}
