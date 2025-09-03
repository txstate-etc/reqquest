import { api } from '$lib'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { ApplicationDetailsData } from '$lib/components/types'

export const load: PageLoad = async ({ params, depends, parent }) => {
  const { basicRequestData } = await parent()

  try {
    const [details, appData] = await Promise.all([
      api.getApplyNavigation(params.id),
      api.getAppRequestData(params.id)
    ])

    // Check if we have valid data (similar to dashboard pattern)
    if (!details.appRequest) {
      throw new Error('Application request not found')
    }

    // create selectedApplication and applicationDetails so they match the dashboard data and work with the ApplicationDetailsView component
    const selectedApplication = {
      id: details.appRequest.id,
      status: details.appRequest.status,
      period: basicRequestData.period,
      applications: details.appRequest.applications.map(app => ({
        title: app.navTitle,
        status: app.status
      }))
    }

    const applicationDetails: ApplicationDetailsData = {
      ...details.appRequest,
      data: appData,
      prequalPrompts: details.prequalPrompts,
      postqualPrompts: details.postqualPrompts,
      applications: details.appRequest.applications as ApplicationDetailsData['applications']
    }

    depends('request:export')
    return {
      selectedApplication,
      applicationDetails
    }
  } catch (err) {
    console.error('Error loading export data:', err)
    throw error(404, 'Application not found or you do not have permission to view it.')
  }
}
