import { PUBLIC_API_BASE, PUBLIC_AUTH_REDIRECT } from '$env/static/public'
import type { ValidationMessage } from '@txstate-mws/fastify-shared'
import { APIBase } from '@txstate-mws/sveltekit-utils'
import { GET_ACCESS, type IAccessResponse, GET_APP_REQUESTS, type GetAppRequestsResponse, type AppRequestFilter, GET_NEXT_PROMPT, type GetNextPrompt, RequirementType, GET_APP_REQUEST, type GetAppRequestResponse } from './queries'

class API extends APIBase {
  async getAccess () {
    return (await this.graphql<IAccessResponse>(GET_ACCESS))
  }

  async getAppRequests (filter: AppRequestFilter) {
    return (await this.graphql<GetAppRequestsResponse>(GET_APP_REQUESTS, { filter })).appRequests
  }

  async getAppRequest (appRequestId: string, applicant = false): Promise<GetAppRequestResponse['appRequests'][0] | undefined> {
    const requirementTypes = applicant ? [RequirementType.PREQUAL, RequirementType.QUALIFICATION] : undefined
    return (await this.graphql<GetAppRequestResponse>(GET_APP_REQUEST, { appRequestId, requirementTypes })).appRequests[0]
  }

  async updatePrompt (promptId: string, data: any) {
    return (await this.graphql<{ updatePrompt: { success: boolean, messages: ValidationMessage[], appRequest: GetNextPrompt } }>(`
      mutation updatePrompt ($promptId: ID!, $data: JsonData!) {
        updatePrompt (promptId: $promptId, data: $data) {
          success
          messages
          appRequest {
            ${GET_NEXT_PROMPT}
          }
        }
      }
    `, { promptId, data })).updatePrompt
  }

  async validatePrompt (promptId: string, data: any) {
    return (await this.graphql<{ updatePrompt: { messages: ValidationMessage[] } }>(`
      mutation updatePrompt ($promptId: ID!, $data: JsonData!) {
        updatePrompt (promptId: $promptId, data: $data, validateOnly: true) {
          messages
        }
      }
    `, { promptId, data })).updatePrompt
  }
}

export const api = new API(PUBLIC_API_BASE, PUBLIC_AUTH_REDIRECT)
