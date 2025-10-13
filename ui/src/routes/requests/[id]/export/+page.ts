import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends, parent }) => {
  const details = await api.getAppRequestForExport(params.id)

  if (!details.appRequest) {
    error(404, 'Application request not found')
  }

  depends('request:export')
  return {
    appRequest: details.appRequest,
    appData: details.appRequest.data,
    prequalPrompts: details.prequalPrompts,
    postqualPrompts: details.postqualPrompts
  }
}
