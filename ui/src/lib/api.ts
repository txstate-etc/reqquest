import { PUBLIC_API_BASE, PUBLIC_AUTH_REDIRECT } from '$env/static/public'
import { APIBase } from '@txstate-mws/sveltekit-utils'
import { GET_ACCESS, type IAccessResponse, GET_APP_REQUESTS, type GetAppRequestsResponse, type AppRequestFilter } from './queries'
import { createClient, enumRequirementType } from './typed-client/index.js'

class API extends APIBase {
  client = createClient({
    url: PUBLIC_API_BASE,
    fetcher: async operation => {
      if (Array.isArray(operation)) throw new Error('Batching not supported')
      const data = await this.graphql(operation.query, operation.variables)
      return { data }
    }
  })

  async getAccess () {
    return (await this.graphql<IAccessResponse>(GET_ACCESS))
  }

  async getApplicantRequests () {
    const response = await this.client.query({
      __name: 'GetApplicantRequests',
      appRequests: {
        __args: { filter: { own: true } },
        id: true,
        status: true,
        period: {
          name: true,
          openDate: true,
          closeDate: true
        }
      }
    })

    return response.appRequests
  }

  async getNextPrompt (appRequestId: string, currentPromptKey?: string) {
    const response = await this.client.query({
      __name: 'GetNextPrompt',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        applications: {
          requirements: {
            prompts: {
              id: true,
              key: true,
              answered: true,
              reachable: true
            }
          }
        }
      }
    })
    let currentKeyFound = false
    for (const applications of response.appRequests[0]?.applications ?? []) {
      for (const requirement of applications.requirements) {
        for (const prompt of requirement.prompts) {
          if ((!prompt.answered || currentKeyFound) && prompt.reachable) return prompt
          if (prompt.key === currentPromptKey && prompt.reachable) currentKeyFound = true
        }
      }
    }
  }

  async getApplyNavigation (appRequestId: string) {
    const response = await this.client.query({
      __name: 'GetApplyNavigation',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        id: true,
        status: true,
        applications: {
          id: true,
          status: true,
          statusReason: true,
          title: true,
          navTitle: true,
          requirements: {
            id: true,
            type: true,
            status: true,
            statusReason: true,
            prompts: {
              id: true,
              key: true,
              title: true,
              navTitle: true,
              answered: true,
              reachable: true
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) return { prequalPrompts: [], appRequest: undefined }
    const appRequest = response.appRequests[0]
    const prequalPrompts = appRequest.applications.flatMap(application => application.requirements.filter(r => r.type === enumRequirementType.PREQUAL).flatMap(r => r.prompts.filter(p => p.reachable)))
    const applications = appRequest.applications.map(application => ({
      ...application,
      requirements: application.requirements.filter(r => r.type === enumRequirementType.QUALIFICATION).map(requirement => ({
        ...requirement,
        prompts: requirement.prompts.filter(p => p.reachable)
      }))
    }))
    return { prequalPrompts, appRequest: { ...appRequest, applications } }
  }

  async getApplicantPrompt (appRequestId: string, promptKey: string) {
    const response = await this.client.query({
      __name: 'GetPromptData',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        applications: {
          id: true,
          requirements: {
            type: true,
            status: true,
            statusReason: true,
            prompts: {
              id: true,
              key: true,
              reachable: true,
              data: true,
              fetchedData: true
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) return undefined
    const appRequest = response.appRequests[0]
    for (const application of appRequest.applications) {
      for (const requirement of application.requirements.filter(r => r.type === enumRequirementType.PREQUAL || r.type === enumRequirementType.QUALIFICATION)) {
        for (const prompt of requirement.prompts) {
          if (prompt.key === promptKey && prompt.reachable) return prompt
        }
      }
    }
    return undefined
  }

  async updatePrompt (promptId: string, data: any, validateOnly: boolean) {
    const response = await this.client.mutation({
      __name: 'UpdatePrompt',
      updatePrompt: {
        __args: { promptId, data, validateOnly },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.updatePrompt)
  }

  async getAppRequestData (appRequestId: string) {
    const response = await this.client.query({
      __name: 'GetAppRequestData',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        id: true,
        data: true
      }
    })
    if (response.appRequests.length === 0) return {}
    const appRequest = response.appRequests[0]
    return appRequest.data
  }

  async submitAppRequest (appRequestId: string) {
    const response = await this.client.mutation({
      __name: 'SubmitAppRequest',
      submitAppRequest: {
        __args: { appRequestId },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.submitAppRequest)
  }

  async getAppRequests (filter: AppRequestFilter) {
    return (await this.graphql<GetAppRequestsResponse>(GET_APP_REQUESTS, { filter })).appRequests
  }

  async getReviewData (appRequestId: string) {
    const response = await this.client.query({
      __name: 'GetReviewData',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        id: true,
        status: true,
        data: true,
        applications: {
          id: true,
          status: true,
          statusReason: true,
          title: true,
          navTitle: true,
          requirements: {
            id: true,
            type: true,
            title: true,
            status: true,
            statusReason: true,
            reachable: true,
            prompts: {
              id: true,
              key: true,
              title: true,
              navTitle: true,
              answered: true,
              reachable: true
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) return undefined
    const appRequest = response.appRequests[0]
    return { ...appRequest, applications: appRequest.applications.map(a => ({ ...a, requirements: a.requirements.filter(r => r.reachable).map(r => ({ ...r, prompts: r.prompts.filter(p => p.reachable) })) })) }
  }
}

export const api = new API(PUBLIC_API_BASE, PUBLIC_AUTH_REDIRECT)
