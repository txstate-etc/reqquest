import { PUBLIC_API_BASE, PUBLIC_AUTH_REDIRECT } from '$env/static/public'
import { APIBase } from '@txstate-mws/sveltekit-utils'
import type { Feedback } from '@txstate-mws/svelte-forms'
import { createClient, enumAppRequestIndexDestination, enumPromptVisibility, enumRequirementType, type AccessRoleGrantCreate, type AccessRoleGrantUpdate, type AccessRoleGroup, type AccessRoleInput, type AppRequestActivityFilters, type AppRequestFilter, type PeriodUpdate, type PromptVisibility } from './typed-client/index.js'
import { DateTime } from 'luxon'

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
        user: {
          login: true,
          fullname: true
        },
        createPeriod: true,
        createRole: true,
        viewRoleManagement: true,
        viewPeriodManagement: true,
        viewReviewerInterface: true,
        viewApplicantDashboard: true,
        viewAppRequestList: true,
        createAppRequestSelf: true,
        createAppRequestOther: true
      }
    })
    return response.access
  }

  async getApplicantRequests (additionalFilters = {}) {
    const filter = { own: true, ...additionalFilters }
    const response = await this.client.query({
      __name: 'GetApplicantRequests',
      appRequests: {
        __args: { filter },
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        period: {
          name: true,
          openDate: true,
          closeDate: true
        },
        applications: {
          id: true,
          title: true,
          status: true
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
          if (prompt.visibility !== enumPromptVisibility.AVAILABLE) continue
          if (currentPromptKey == null) {
            if (!prompt.answered) return prompt
          } else {
            if (currentKeyFound) return prompt
            if (prompt.key === currentPromptKey) currentKeyFound = true
          }
        }
      }
    }
    return undefined
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
    const postqualPrompts = appRequest.applications.flatMap(application => application.requirements.filter(r => r.type === enumRequirementType.POSTQUAL).flatMap(r => r.prompts.filter(p => p.visibility === enumPromptVisibility.AVAILABLE)))
    const applications = appRequest.applications.map(application => ({
      ...application,
      requirements: application.requirements.filter(r => r.type === enumRequirementType.QUALIFICATION).map(requirement => ({
        ...requirement,
        prompts: requirement.prompts.filter(p => p.visibility === enumPromptVisibility.AVAILABLE)
      }))
    }))
    return { prequalPrompts, postqualPrompts, appRequest: { ...appRequest, applications } }
  }

  async getApplicantPrompt (appRequestId: string, promptKey: string) {
    const response = await this.client.query({
      __name: 'GetPromptData',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        data: true,
        dataVersion: true,
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
      for (const requirement of application.requirements.filter(r => r.type === enumRequirementType.PREQUAL || r.type === enumRequirementType.QUALIFICATION || r.type === enumRequirementType.POSTQUAL)) {
        for (const prompt of requirement.prompts) {
          if (prompt.key === promptKey && prompt.visibility === enumPromptVisibility.AVAILABLE) return { appRequestData: appRequest.data, prompt }
        }
      }
    }
    return { appRequestData: appRequest.data, dataVersion: appRequest.dataVersion }
  }

  async updatePrompt (promptId: string, data: any, validateOnly: boolean, dataVersion?: number) {
    const response = await this.graphqlWithUploads(`
      mutation UpdatePrompt($promptId: ID!, $data: JsonData!, $validateOnly: Boolean!, $dataVersion: Int) {
        updatePrompt(promptId: $promptId, data: $data, validateOnly: $validateOnly, dataVersion: $dataVersion) {
          success
          messages {
            message
            type
            arg
          }
        }
      }
    `, { promptId, data, validateOnly, dataVersion })
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

  async createAppRequest (periodId?: string, login?: string, validateOnly?: boolean) {
    const messages: Feedback[] = []
    if (!periodId) messages.push({ message: 'You must select a period to create an application.', type: 'error', path: 'periodId' })
    if (!login) messages.push({ message: 'You must provide a login to create an application.', type: 'error', path: 'login' })
    if (messages.length > 0) return { success: false, messages, data: { periodId, login }, id: undefined }

    const response = await this.client.mutation({
      __name: 'CreateAppRequest',
      createAppRequest: {
        __args: { periodId: periodId!, login: login!, validateOnly },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        },
        appRequest: {
          id: true
        }
      }
    })
    return { ...this.mutationForDialog(response.createAppRequest), id: response.createAppRequest.appRequest?.id }
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

  async cancelAppRequest (appRequestId: string, dataVersion?: number) {
    const response = await this.client.mutation({
      __name: 'CancelAppRequest',
      cancelAppRequest: {
        __args: { appRequestId, dataVersion },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.cancelAppRequest)
  }

  async reopenAppRequest (appRequestId: string) {
    const response = await this.client.mutation({
      __name: 'ReopenAppRequest',
      reopenAppRequest: {
        __args: { appRequestId },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.reopenAppRequest)
  }

  async returnAppRequest (appRequestId: string) {
    const response = await this.client.mutation({
      __name: 'ReturnAppRequest',
      returnAppRequest: {
        __args: { appRequestId },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.returnAppRequest)
  }

  async getAppRequests (filter?: Omit<AppRequestFilter, 'indexes'> & { indexes?: Record<string, string[]> }, dest = enumAppRequestIndexDestination.APP_REQUEST_LIST) {
    const processedFilter = {
      ...filter,
      indexes: filter?.indexes ? Object.entries(filter.indexes).map(([category, tags]) => ({ category, tags })) : undefined
    }
    const response = await this.client.query({
      __name: 'GetAppRequests',
      appRequests: {
        __args: { filter: processedFilter },
        id: true,
        applicant: {
          login: true,
          fullname: true
        },
        status: true,
        statusReason: true,
        period: {
          id: true,
          name: true
        },
        indexCategories: {
          __args: { for: dest },
          category: true,
          categoryLabel: true,
          values: {
            value: true,
            label: true
          }
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
      },
      appRequestIndexes: {
        category: true,
        categoryLabel: true,
        appRequestListPriority: true,
        listFiltersPriority: true,
        listable: true,
        values: {
          __args: { inUse: true },
          value: true,
          label: true
        }
      }
    })
    return response
  }

  async searchIndexItems (category: string, search: string) {
    const response = await this.client.query({
      __name: 'SearchIndexItems',
      appRequestIndexes: {
        __args: { categories: [category] },
        values: {
          __args: { search },
          value: true,
          label: true
        }
      }
    })
    return response.appRequestIndexes[0]?.values ?? []
  }

  async getBasicRequestData (appRequestId: string) {
    const response = await this.client.query({
      __name: 'GetBasicRequestData',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        applicant: {
          login: true,
          fullname: true,
          otherIdentifiers: {
            id: true,
            label: true
          },
          otherInfo: true
        },
        period: {
          id: true,
          name: true
        },
        applications: {
          id: true,
          navTitle: true,
          programKey: true
        }
      }
    })
    if (response.appRequests.length === 0) return undefined
    return response.appRequests[0]
  }

  async getReviewData (appRequestId: string, visibilities: PromptVisibility[] = [enumPromptVisibility.AVAILABLE, enumPromptVisibility.REQUEST_DUPE]) {
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
          programKey: true,
          requirements: {
            id: true,
            type: true,
            title: true,
            status: true,
            statusReason: true,
            workflowStage: {
              key: true,
              title: true,
              blocking: true
            },
            prompts: {
              id: true,
              key: true,
              title: true,
              navTitle: true,
              answered: true,
              visibility: true,
              configurationRelatedData: true,
              fetchedData: true,
              actions: {
                update: true
              }
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) return undefined
    const appRequest = response.appRequests[0]
    return { ...appRequest, applications: appRequest.applications.map(a => ({ ...a, requirements: a.requirements.map(r => ({ ...r, prompts: r.prompts.filter(p => visibilities.includes(p.visibility)) })) })) }
  }

  async getRequestActivity (appRequestId: string, filters?: AppRequestActivityFilters) {
    const response = await this.client.query({
      __name: 'GetRequestActivity',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        activity: {
          __args: { filters },
          id: true,
          user: {
            login: true,
            fullname: true
          },
          impersonatedBy: {
            login: true,
            fullname: true
          },
          action: true,
          description: true,
          data: true,
          createdAt: true
        }
      }
    })
    if (response.appRequests.length === 0) return undefined
    return response.appRequests[0].activity.map(activity => ({
      ...activity,
      createdAt: DateTime.fromISO(activity.createdAt)
    }))
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
        code: true,
        openDate: true,
        closeDate: true,
        archiveDate: true,
        actions: {
          update: true,
          delete: true,
          createAppRequest: true
        }
      }
    })
    return response.periods
  }

  async getOpenPeriods () {
    const response = await this.client.query({
      __name: 'GetOpenPeriods',
      periods: {
        __args: { filter: { openNow: true } },
        id: true,
        name: true,
        openDate: true,
        closeDate: true,
        archiveDate: true
      }
    })
    return response.periods
  }

  async createPeriod (period: PeriodUpdate, validateOnly: boolean) {
    const response = await this.client.mutation({
      __name: 'CreatePeriod',
      createPeriod: {
        __args: { period, validateOnly },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return api.mutationForDialog(response.createPeriod, { prefix: 'period' })
  }

  async updatePeriod (periodId: string, period: PeriodUpdate, validateOnly: boolean) {
    const response = await this.client.mutation({
      __name: 'UpdatePeriod',
      updatePeriod: {
        __args: { periodId, update: period, validateOnly },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.updatePeriod, { prefix: 'period' })
  }

  async deletePeriod (periodId: string) {
    const response = await this.client.mutation({
      __name: 'DeletePeriod',
      deletePeriod: {
        __args: { periodId },
        success: true
      }
    })
    return response.deletePeriod.success
  }

  async disablePeriodProgramRequirements (periodId: string, requirementKey: string, disabled: boolean) {
    const response = await this.client.mutation({
      __name: 'updatePeriodProgram',
      updatePeriodProgramRequirement: {
        __args: { periodId, requirementKey, disabled },
        success: true
      }
    })
    return response.updatePeriodProgramRequirement.success
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
        groups: {
          groupName: true,
          dateAdded: true
        },
        actions: {
          update: true,
          delete: true
        }
      }
    })
    if (response.roles.length === 0) return undefined
    const roles = response.roles
    return roles.map(role => ({ ...role, groups: role.groups.map((group: AccessRoleGroup) => ({
      ...group,
      dateAdded: DateTime.fromISO(group.dateAdded)
    })) }))
  }

  async getRoleDetails (roleId: string) {
    const response = await this.client.query({
      __name: 'GetRoleDetails',
      roles: {
        __args: { filter: { ids: [roleId] } },
        id: true,
        name: true,
        description: true,
        groups: {
          groupName: true,
          dateAdded: true
        },
        grants: {
          id: true,
          controlGroup: {
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
    return { ...role, groups: role.groups.map((group: AccessRoleGroup) => ({
      ...group,
      dateAdded: DateTime.fromISO(group.dateAdded)
    })) }
  }

  async getAuthorizationInfo () {
    const response = await this.client.query({
      __name: 'GetAuthorizationInfo',
      controlGroups: {
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
    return response.controlGroups
  }

  async upsertRole (roleId: string | undefined, role: AccessRoleInput, validateOnly: boolean) {
    if (roleId != null) {
      const response = await this.client.mutation({
        __name: 'UpdateRole',
        roleUpdate: {
          __args: { roleId, role, validateOnly },
          success: true,
          messages: {
            message: true,
            type: true,
            arg: true
          }
        }
      })
      return this.mutationForDialog(response.roleUpdate)
    } else {
      const response = await this.client.mutation({
        __name: 'CreateRole',
        roleCreate: {
          __args: { role, validateOnly },
          success: true,
          messages: {
            message: true,
            type: true,
            arg: true
          }
        }
      })
      return this.mutationForDialog(response.roleCreate)
    }
  }

  async deleteRole (roleId: string) {
    const response = await this.client.mutation({
      __name: 'DeleteRole',
      roleDelete: {
        __args: { roleId },
        success: true
      }
    })
    return response.roleDelete.success
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
