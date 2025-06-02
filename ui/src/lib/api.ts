import { PUBLIC_API_BASE, PUBLIC_AUTH_REDIRECT } from '$env/static/public'
import { APIBase } from '@txstate-mws/sveltekit-utils'
import { createClient, enumAppRequestIndexDestination, enumPromptVisibility, enumRequirementType, type AccessRoleGrantCreate, type AccessRoleGrantUpdate, type AppRequestFilter } from './typed-client/index.js'

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
    const response = await this.client.query({
      __name: 'GetAccess',
      access: {
        createPeriod: true,
        createRole: true,
        viewRoleManagement: true,
        viewPeriodManagement: true,
        viewReviewerInterface: true,
        viewApplicantDashboard: true,
        viewAppRequestList: true
      }
    })
    return response.access
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
              visibility: true
            }
          }
        }
      }
    })
    let currentKeyFound = false
    for (const applications of response.appRequests[0]?.applications ?? []) {
      for (const requirement of applications.requirements) {
        for (const prompt of requirement.prompts) {
          if ((!prompt.answered || currentKeyFound) && prompt.visibility === enumPromptVisibility.AVAILABLE) return prompt
          if (prompt.key === currentPromptKey && prompt.visibility === enumPromptVisibility.AVAILABLE) currentKeyFound = true
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
              visibility: true
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) return { prequalPrompts: [], appRequest: undefined }
    const appRequest = response.appRequests[0]
    const prequalPrompts = appRequest.applications.flatMap(application => application.requirements.filter(r => r.type === enumRequirementType.PREQUAL).flatMap(r => r.prompts.filter(p => p.visibility === enumPromptVisibility.AVAILABLE)))
    const applications = appRequest.applications.map(application => ({
      ...application,
      requirements: application.requirements.filter(r => r.type === enumRequirementType.QUALIFICATION).map(requirement => ({
        ...requirement,
        prompts: requirement.prompts.filter(p => p.visibility === enumPromptVisibility.AVAILABLE)
      }))
    }))
    return { prequalPrompts, appRequest: { ...appRequest, applications } }
  }

  async getApplicantPrompt (appRequestId: string, promptKey: string) {
    const response = await this.client.query({
      __name: 'GetPromptData',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        data: true,
        applications: {
          id: true,
          requirements: {
            type: true,
            status: true,
            statusReason: true,
            prompts: {
              id: true,
              key: true,
              visibility: true,
              fetchedData: true,
              configurationRelatedData: true
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) return {}
    const appRequest = response.appRequests[0]
    for (const application of appRequest.applications) {
      for (const requirement of application.requirements.filter(r => r.type === enumRequirementType.PREQUAL || r.type === enumRequirementType.QUALIFICATION)) {
        for (const prompt of requirement.prompts) {
          if (prompt.key === promptKey && prompt.visibility === enumPromptVisibility.AVAILABLE) return { appRequestData: appRequest.data, prompt }
        }
      }
    }
    return { appRequestData: appRequest.data }
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

  async updateConfiguration (periodId: string, definitionKey: string, data: any, validateOnly: boolean) {
    const response = await this.client.mutation({
      __name: 'UpdateConfiguration',
      updateConfiguration: {
        __args: { periodId, key: definitionKey, data, validateOnly },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.updateConfiguration)
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

  async getAppRequests (filter: AppRequestFilter, dest = enumAppRequestIndexDestination.APP_REQUEST_LIST) {
    const response = await this.client.query({
      __name: 'GetAppRequests',
      appRequests: {
        __args: { filter },
        id: true,
        status: true,
        statusReason: true,
        period: {
          id: true,
          name: true
        },
        indexCategories: {
          __args: { for: dest }
        },
        actions: {
          cancel: true,
          close: true,
          reopen: true,
          return: true,
          review: true,
          offer: true,
          submit: true
        }
      }
    })
    return response.appRequests
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
              visibility: true
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) return undefined
    const appRequest = response.appRequests[0]
    return { ...appRequest, applications: appRequest.applications.map(a => ({ ...a, requirements: a.requirements.filter(r => r.reachable).map(r => ({ ...r, prompts: r.prompts.filter(p => p.visibility !== enumPromptVisibility.UNREACHABLE) })) })) }
  }

  async getPromptData (appRequestId: string, promptId: string) {
    const response = await this.client.query({
      __name: 'GetPromptData',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        prompt: {
          __args: { promptId },
          data: true,
          preloadData: true,
          configurationRelatedData: true,
          fetchedData: true
        }
      }
    })
    const appRequest = response.appRequests[0]
    return appRequest.prompt
  }

  async getPeriodList () {
    const response = await this.client.query({
      __name: 'GetPeriodList',
      periods: {
        id: true,
        name: true,
        openDate: true,
        closeDate: true,
        archiveDate: true
      }
    })
    return response.periods
  }

  async getPeriodConfigurations (periodId: string) {
    const response = await this.client.query({
      __name: 'GetPeriodConfigurations',
      periods: {
        __args: { filter: { ids: [periodId] } },
        id: true,
        name: true,
        code: true,
        openDate: true,
        closeDate: true,
        archiveDate: true,
        programs: {
          key: true,
          title: true,
          enabled: true,
          requirements: {
            key: true,
            title: true,
            description: true,
            enabled: true,
            configuration: {
              data: true,
              actions: {
                update: true
              }
            },
            prompts: {
              key: true,
              title: true,
              description: true,
              configuration: {
                data: true,
                actions: {
                  update: true
                }
              }
            }
          }
        }
      }
    })
    if (!response.periods.length) return { period: undefined, programs: [] }
    const period = response.periods[0]
    return { programs: period.programs, period }
  }

  async getRoleList () {
    const response = await this.client.query({
      __name: 'GetRoleList',
      roles: {
        id: true,
        name: true,
        description: true,
        groups: true,
        actions: {
          update: true,
          delete: true
        }
      }
    })
    return response.roles
  }

  async getRoleDetails (roleId: string) {
    const response = await this.client.query({
      __name: 'GetRoleDetails',
      roles: {
        __args: { filter: { ids: [roleId] } },
        id: true,
        name: true,
        description: true,
        groups: true,
        grants: {
          id: true,
          subjectType: {
            name: true,
            title: true,
            description: true
          },
          allow: true,
          controls: true,
          tags: {
            category: true,
            categoryLabel: true,
            tag: true,
            label: true
          },
          actions: {
            update: true,
            delete: true
          }
        },
        actions: {
          update: true,
          delete: true
        }
      }
    })
    if (!response.roles.length) return undefined
    const role = response.roles[0]
    return role
  }

  async getAuthorizationInfo () {
    const response = await this.client.query({
      __name: 'GetAuthorizationInfo',
      subjectTypes: {
        name: true,
        title: true,
        description: true,
        tags: {
          category: true,
          label: true,
          description: true,
          listable: true,
          tags: {
            value: true,
            label: true
          }
        },
        controls: {
          name: true,
          description: true
        }
      }
    })
    return response.subjectTypes
  }

  async updateGrant (grantId: string, grant: AccessRoleGrantUpdate, validateOnly: boolean) {
    const response = await this.client.mutation({
      __name: 'UpdateGrant',
      roleUpdateGrant: {
        __args: { grantId, grant, validateOnly },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.roleUpdateGrant)
  }

  async createGrant (roleId: string, grant: AccessRoleGrantCreate, validateOnly: boolean) {
    const response = await this.client.mutation({
      __name: 'CreateGrant',
      roleAddGrant: {
        __args: { roleId, grant, validateOnly },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.roleAddGrant)
  }

  async deleteGrant (grantId: string) {
    const response = await this.client.mutation({
      __name: 'DeleteGrant',
      roleDeleteGrant: {
        __args: { grantId },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.roleDeleteGrant)
  }
}

export const api = new API(PUBLIC_API_BASE, PUBLIC_AUTH_REDIRECT)
