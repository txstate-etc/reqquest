import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, depends, parent }) => {
  const { basicRequestData } = await parent()

  try {
    const [details, appData] = await Promise.all([
      api.getApplyNavigation(params.id),
      api.getAppRequestData(params.id)
    ])

    if (!details.appRequest) {
      throw new Error('Application request not found')
    }

    const appRequest = {
      ...details.appRequest,
      period: basicRequestData.period
    }

    depends('request:export')
    return {
      appRequest,
      appData,
      prequalPrompts: details.prequalPrompts,
      postqualPrompts: details.postqualPrompts
    }
  } catch (err) {
    console.error('Error loading export data:', err)
    throw error(404, 'Application not found or you do not have permission to view it.')
  }
}
