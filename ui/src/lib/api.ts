import { PUBLIC_API_BASE, PUBLIC_AUTH_REDIRECT, PUBLIC_SHOW_DUPLICATE_PROMPTS } from '$env/static/public'
import { APIBase } from '@txstate-mws/sveltekit-utils'
import type { Feedback } from '@txstate-mws/svelte-forms'
import { createClient, enumAppRequestIndexDestination, enumIneligiblePhases, enumPromptVisibility, enumRequirementStatus, enumRequirementType, type AccessRoleGrantCreate, type AccessRoleGrantUpdate, type AccessRoleGroup, type AccessRoleInput, type AccessUserFilter, type AppRequestActivityFilters, type AppRequestFilter, type IneligiblePhases, type Pagination, type PeriodUpdate, type PromptVisibility, type RequirementStatus, type RequirementType } from './typed-client/index.js'
import { DateTime } from 'luxon'
import { omit, pick } from 'txstate-utils'
import { error } from '@sveltejs/kit'
import type { PhaseChangeMutations } from './components/types.js'

export type CompletionStatus = 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING'
export const showDupePrompts = PUBLIC_SHOW_DUPLICATE_PROMPTS.trim() === 'true'

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

  async getAccessUsers (accessUsersFilter: AccessUserFilter, pageFilter: Pagination) {
    const filter = accessUsersFilter
    const paged = pageFilter
    const response = await this.client.query({
      __name: 'GetAccessUsers',
      accessUsers: {
        __args: { filter, paged },
        login: true,
        fullname: true,
        groups: true,
        roles: {
          name: true
        },
        otherIdentifiers: {
          id: true,
          label: true
        },
        otherInfo: true
      },
      pageInfo: {
        accessUsers: {
          currentPage: true,
          totalItems: true,
          hasNextPage: true,
          perPage: true,
          categories: {
            tags: {
              tag: true,
              label: true
            },
            category: true,
            label: true,
            useInFilters: true,
            useInList: true
          }
        }
      }
    })
    return { users: response.accessUsers, pageInfo: response.pageInfo.accessUsers }
  }

  async getApplicantRequests (additionalFilters = {}, paged?: Pagination) {
    // const filter = { own: true, ...additionalFilters }
    const filter = { ...additionalFilters }
    const response = await this.client.query({
      __name: 'GetApplicantRequests',
      appRequests: {
        __args: { filter, paged },
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        complete: true,
        applicant: {
          fullname: true,
          otherIdentifiers: {
            id: true
          }
        },
        period: {
          name: true,
          openDate: true,
          closeDate: true
        },
        applications: {
          id: true,
          title: true,
          status: true,
          statusReason: true,
          requirements: {
            id: true,
            status: true,
            statusReason: true,
            prompts: {
              id: true,
              visibility: true,
              invalidated: true,
              invalidatedReason: true
            }
          }
        },
        actions: {
          acceptOffer: true,
          cancel: true,
          reopen: true,
          returnToApplicant: true,
          returnToOffer: true,
          submit: true
        }
      }
    })

    return response.appRequests
  }

  async getApplicantPrompt (appRequestId: string, promptId: string) {
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
              title: true,
              description: true,
              answered: true,
              visibility: true,
              preloadData: true,
              fetchedData: true,
              configurationData: true,
              gatheredConfigData: true
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
          if (prompt.id === promptId) return { prompt }
        }
      }
    }
    return {}
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
        data: true,
        applications: {
          requirements: {
            prompts: {
              key: true,
              gatheredConfigData: true
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) return { data: {}, applications: [] as typeof response.appRequests[0]['applications'] }
    const appRequest = response.appRequests[0]
    return appRequest
  }

  static splitPromptsForApplicant<P extends { id: string, key: string, visibility: PromptVisibility, moot: boolean }, R extends { type: RequirementType, status: RequirementStatus, statusReason: string | null, prompts: P[] }, A extends { title: string, ineligiblePhase: IneligiblePhases | null, requirements: R[] }>(applications: A[]) {
    type ReturnPrompt = P & { statusReasons: { status: string, statusReason: string | null, programName: string }[] }
    type ReturnRequirement = R & { prompts: ReturnPrompt[] }
    type ReturnApplication = A & { requirements: ReturnRequirement[], completionStatus: CompletionStatus, hasWarning: boolean, warningReasons: string[], ineligibleReasons: string[] }
    const prequalPrompts: ReturnPrompt[] = []
    const postqualPrompts: ReturnPrompt[] = []
    const qualPrompts: ReturnPrompt[] = []
    const applicationsReviewWithDupes: ReturnApplication[] = []
    const applicationsReviewNoDupes: ReturnApplication[] = []
    const applicationsForNavWithDupes: ReturnApplication[] = []
    const applicationsForNavNoDupes: ReturnApplication[] = []
    const applicationsAcceptWithDupes: ReturnApplication[] = []
    const applicationsAcceptNoDupes: ReturnApplication[] = []
    const promptsById: Record<string, ReturnPrompt> = {}
    const promptsByKey: Record<string, ReturnPrompt[]> = {}

    const seenForReview = new Set<string>()
    const seenForNav = new Set<string>()
    const seenForAccept = new Set<string>()

    const visibilitiesToShow = new Set<PromptVisibility>([enumPromptVisibility.AVAILABLE, enumPromptVisibility.REQUEST_DUPE])
    const requirementTypesForNavigation = new Set<RequirementType>([enumRequirementType.PREQUAL, enumRequirementType.POSTQUAL, enumRequirementType.QUALIFICATION])
    const requirementTypesForReview = new Set<RequirementType>([enumRequirementType.QUALIFICATION, enumRequirementType.PREAPPROVAL, enumRequirementType.APPROVAL, enumRequirementType.WORKFLOW])
    for (const application of applications) {
      const requirementsReviewWithDupes: ReturnRequirement[] = []
      const requirementsReviewNoDupes: ReturnRequirement[] = []
      const requirementsForNavWithDupes: ReturnRequirement[] = []
      const requirementsForNavNoDupes: ReturnRequirement[] = []
      const requirementsAcceptWithDupes: ReturnRequirement[] = []
      const requirementsAcceptNoDupes: ReturnRequirement[] = []
      for (const requirement of application.requirements) {
        const promptsForNavWithDupes: ReturnPrompt[] = []
        const promptsForNavNoDupes: ReturnPrompt[] = []
        const promptsReviewNoDupes: ReturnPrompt[] = []
        const promptsReviewWithDupes: ReturnPrompt[] = []
        const promptsAcceptWithDupes: ReturnPrompt[] = []
        const promptsAcceptNoDupes: ReturnPrompt[] = []
        for (const prompt of requirement.prompts) {
          const retPrompt = { ...prompt, statusReasons: [{ ...pick(requirement, 'status', 'statusReason'), programName: application.title }] }
          const withDupesPrompt = { ...retPrompt }
          promptsById[prompt.id] = retPrompt
          if (prompt.moot || prompt.visibility === enumPromptVisibility.UNREACHABLE) continue
          promptsByKey[prompt.key] ??= []
          promptsByKey[prompt.key].push(retPrompt)
          if (!visibilitiesToShow.has(prompt.visibility)) continue
          promptsReviewWithDupes.push(withDupesPrompt)
          if (requirementTypesForNavigation.has(requirement.type)) promptsForNavWithDupes.push(withDupesPrompt)
          if (requirement.type === enumRequirementType.ACCEPTANCE) promptsAcceptWithDupes.push(withDupesPrompt)
          if (!seenForReview.has(prompt.key)) promptsReviewNoDupes.push(retPrompt)
          seenForReview.add(prompt.key)
          if (requirementTypesForNavigation.has(requirement.type)) {
            if (!seenForNav.has(prompt.key)) promptsForNavNoDupes.push(retPrompt)
            seenForNav.add(prompt.key)
          }
          if (requirement.type === enumRequirementType.ACCEPTANCE) {
            if (!seenForAccept.has(prompt.key)) promptsAcceptNoDupes.push(retPrompt)
            seenForAccept.add(prompt.key)
          }
        }
        if (requirement.type === enumRequirementType.PREQUAL) prequalPrompts.push(...promptsForNavNoDupes)
        else if (requirement.type === enumRequirementType.POSTQUAL) postqualPrompts.push(...promptsForNavNoDupes)
        else if (requirementTypesForReview.has(requirement.type)) {
          requirementsReviewWithDupes.push({ ...requirement, prompts: promptsReviewWithDupes })
          requirementsReviewNoDupes.push({ ...requirement, prompts: promptsReviewNoDupes })
          if (requirement.type === enumRequirementType.QUALIFICATION) {
            qualPrompts.push(...promptsForNavNoDupes)
            requirementsForNavWithDupes.push({ ...requirement, prompts: promptsForNavWithDupes })
            requirementsForNavNoDupes.push({ ...requirement, prompts: promptsForNavNoDupes })
          }
        } else if (requirement.type === enumRequirementType.ACCEPTANCE) {
          requirementsAcceptWithDupes.push({ ...requirement, prompts: promptsAcceptWithDupes })
          requirementsAcceptNoDupes.push({ ...requirement, prompts: promptsAcceptNoDupes })
        }
      }
      const reqsForCompletion = application.requirements.filter(r => r.type !== enumRequirementType.POSTQUAL)
      let completionStatus: CompletionStatus = 'ELIGIBLE'
      let completionStatusForNav: CompletionStatus = 'ELIGIBLE'
      const warningReasons: string[] = []
      const warningReasonsFull: string[] = []
      const ineligibleReasons: string[] = []
      const ineligibleReasonsFull: string[] = []
      let hasWarning = false
      let hasWarningForNav = false
      for (const req of reqsForCompletion) {
        const showWarnings = application.ineligiblePhase !== enumIneligiblePhases.PREQUAL || req.type === enumRequirementType.PREQUAL
        if (req.status === enumRequirementStatus.PENDING) {
          if (completionStatus !== 'INELIGIBLE') completionStatus = 'PENDING'
          if (completionStatusForNav !== 'INELIGIBLE' && requirementTypesForNavigation.has(req.type)) completionStatusForNav = 'PENDING'
        } else if (req.status === enumRequirementStatus.WARNING) {
          hasWarning = true
          if (requirementTypesForNavigation.has(req.type)) hasWarningForNav = true
          if (req.statusReason && showWarnings) {
            if (requirementTypesForNavigation.has(req.type)) warningReasons.push(req.statusReason)
            warningReasonsFull.push(req.statusReason)
          }
        } else if (req.status === enumRequirementStatus.DISQUALIFYING) {
          completionStatus = 'INELIGIBLE'
          if (requirementTypesForNavigation.has(req.type)) completionStatusForNav = 'INELIGIBLE'
          if (req.statusReason && showWarnings) {
            if (requirementTypesForNavigation.has(req.type)) ineligibleReasons.push(req.statusReason)
            if (application.ineligiblePhase !== enumIneligiblePhases.PREQUAL || req.type !== enumRequirementType.PREQUAL) ineligibleReasonsFull.push(req.statusReason)
          }
        }
      }
      applicationsReviewWithDupes.push({ ...application, requirements: requirementsReviewWithDupes, completionStatus, warningReasons: warningReasonsFull, ineligibleReasons: ineligibleReasonsFull, hasWarning })
      applicationsReviewNoDupes.push({ ...application, requirements: requirementsReviewNoDupes, completionStatus, warningReasons: warningReasonsFull, ineligibleReasons: ineligibleReasonsFull, hasWarning })
      applicationsForNavWithDupes.push({ ...application, requirements: requirementsForNavWithDupes, completionStatus: completionStatusForNav, warningReasons, ineligibleReasons, hasWarning: hasWarningForNav })
      applicationsForNavNoDupes.push({ ...application, requirements: requirementsForNavNoDupes, completionStatus: completionStatusForNav, warningReasons, ineligibleReasons, hasWarning: hasWarningForNav })
      applicationsAcceptWithDupes.push({ ...application, requirements: requirementsAcceptWithDupes, completionStatus, warningReasons: warningReasonsFull, ineligibleReasons: ineligibleReasonsFull, hasWarning })
      applicationsAcceptNoDupes.push({ ...application, requirements: requirementsAcceptNoDupes, completionStatus, warningReasons: warningReasonsFull, ineligibleReasons: ineligibleReasonsFull, hasWarning })
    }
    for (const prompts of Object.values(promptsByKey)) {
      const statusReasons = prompts.map(p => p.statusReasons[0])
      for (const prompt of prompts) prompt.statusReasons = statusReasons
    }
    return { prequalPrompts, postqualPrompts, qualPrompts, applicationsReviewWithDupes, applicationsReviewNoDupes, applicationsForNavWithDupes, applicationsForNavNoDupes, applicationsAcceptWithDupes, applicationsAcceptNoDupes, promptsByKey, promptsById }
  }

  async getAppRequestForExport (appRequestId: string) {
    const response = await this.client.query({
      __name: 'GetAppRequestForExport',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        id: true,
        status: true,
        data: true,
        dataVersion: true,
        period: {
          name: true
        },
        applications: {
          id: true,
          status: true,
          ineligiblePhase: true,
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
              visibility: true,
              moot: true,
              invalidated: true,
              invalidatedReason: true,
              configurationData: true,
              gatheredConfigData: true
            }
          }
        }
      }
    })
    if (response.appRequests.length === 0) throw error(404, 'Application request not found')
    type ResponseAppRequest = (typeof response)['appRequests'][0]
    type ResponseApplication = ResponseAppRequest['applications'][0]
    type ResponseRequirement = ResponseApplication['requirements'][0]
    type ResponsePrompt = ResponseRequirement['prompts'][0]

    const splitInfo = API.splitPromptsForApplicant<ResponsePrompt, ResponseRequirement, ResponseApplication>(response.appRequests[0]?.applications ?? [])
    return {
      ...omit(splitInfo, 'applicationsForNavNoDupes', 'applicationsForNavWithDupes', 'applicationsReviewNoDupes', 'applicationsReviewWithDupes'),
      applicationsForNav: showDupePrompts ? splitInfo.applicationsForNavWithDupes : splitInfo.applicationsForNavNoDupes,
      applicationsReview: showDupePrompts ? splitInfo.applicationsReviewWithDupes : splitInfo.applicationsReviewNoDupes,
      applicationsAccept: showDupePrompts ? splitInfo.applicationsAcceptWithDupes : splitInfo.applicationsAcceptNoDupes,
      appRequest: response.appRequests[0]
    }
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

  async appRequestPhaseChange (appRequestId: string, phaseChange: PhaseChangeMutations) {
    const response = await this.graphql<Record<string, { success: boolean, messages: { message: string, type: 'error' | 'warning' | 'success', arg?: string }[] }>>(`
      mutation AppRequestPhaseChange($appRequestId: ID!) {
        ${phaseChange}(appRequestId: $appRequestId) {
          success
          messages {
            message
            type
            arg
          }
        }
      }
    `, { appRequestId })
    return this.mutationForDialog(response[phaseChange])
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

  async advanceWorkflow (applicationId: string) {
    const response = await this.client.mutation({
      __name: 'AdvanceWorkflow',
      advanceWorkflow: {
        __args: { applicationId },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.advanceWorkflow)
  }

  async reverseWorkflow (applicationId: string) {
    const response = await this.client.mutation({
      __name: 'ReverseWorkflow',
      reverseWorkflow: {
        __args: { applicationId },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.reverseWorkflow)
  }

  async closeAppRequest (appRequestId: string) {
    const response = await this.client.mutation({
      __name: 'CloseAppRequest',
      closeAppRequest: {
        __args: { appRequestId },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.closeAppRequest)
  }

  async getAppRequests (
    filter?: Omit<AppRequestFilter, 'indexes'> & { indexes?: Record<string, string[]> },
    paged?: Pagination,
    dest = enumAppRequestIndexDestination.APP_REQUEST_LIST) {
    const processedFilter = {
      ...filter,
      indexes: filter?.indexes ? Object.entries(filter.indexes).map(([category, tags]) => ({ category, tags })) : undefined
    }
    const response = await this.client.query({
      __name: 'GetAppRequests',
      appRequests: {
        __args: { filter: processedFilter, paged },
        id: true,
        createdAt: true,
        closedAt: true,
        updatedAt: true,
        applications: {
          title: true
        },
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
          review: true
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
      },
      pageInfo: {
        appRequests: {
          currentPage: true,
          totalItems: true,
          hasNextPage: true,
          perPage: true,
          categories: {
            tags: {
              tag: true,
              label: true
            },
            category: true,
            label: true,
            useInFilters: true,
            useInList: true
          }
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
        complete: true,
        status: true,
        closedAt: true,
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
          name: true,
          code: true,
          openDate: true,
          closeDate: true,
          archiveDate: true
        },
        applications: {
          id: true,
          navTitle: true,
          programKey: true
        },
        actions: {
          acceptOffer: true,
          cancel: true,
          close: true,
          completeRequest: true,
          completeReview: true,
          reopen: true,
          returnToApplicant: true,
          returnToNonBlocking: true,
          returnToOffer: true,
          returnToReview: true,
          review: true,
          submit: true
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
          workflowStage: {
            blocking: true
          },
          nextWorkflowStage: {
            key: true,
            title: true
          },
          previousWorkflowStage: {
            key: true,
            title: true
          },
          actions: {
            advanceWorkflow: true,
            reverseWorkflow: true
          },
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
              configurationData: true,
              gatheredConfigData: true,
              moot: true,
              invalidated: true,
              invalidatedReason: true,
              preloadData: true,
              fetchedData: true,
              actions: {
                update: true
              }
            }
          }
        },
        actions: {
          acceptOffer: true,
          cancel: true,
          close: true,
          completeRequest: true,
          completeReview: true,
          reopen: true,
          returnToApplicant: true,
          returnToNonBlocking: true,
          returnToOffer: true,
          returnToReview: true,
          review: true,
          submit: true
        }
      }
    })
    if (response.appRequests.length === 0) return undefined
    const appRequest = response.appRequests[0]
    return { ...appRequest, applications: appRequest.applications.map(a => ({ ...a, requirements: a.requirements.map(r => ({ ...r, prompts: r.prompts.filter(p => visibilities.includes(p.visibility)) })) })) }
  }

  async getRequestActivity (appRequestId: string, filters?: AppRequestActivityFilters, paged?: Pagination) {
    const response = await this.client.query({
      __name: 'GetRequestActivity',
      appRequests: {
        __args: { filter: { ids: [appRequestId] } },
        activity: {
          __args: { filters, paged },
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
      },
      pageInfo: {
        appRequestsActivity: {
          currentPage: true,
          totalItems: true,
          hasNextPage: true,
          perPage: true
        }
      }
    })
    if (response.appRequests.length === 0) return undefined
    return {
      activity: response.appRequests[0].activity.map(activity => ({
        ...activity,
        createdAt: DateTime.fromISO(activity.createdAt)
      })),
      pageInfo: response.pageInfo.appRequestsActivity
    }
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
          configurationData: true,
          gatheredConfigData: true,
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
        reviewed: true,
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
        code: true,
        openDate: true,
        closeDate: true,
        archiveDate: true,
        reviewed: true
      }
    })
    return response.periods
  }

  async createPeriod (period: PeriodUpdate, validateOnly: boolean, copyPeriodId?: string) {
    const response = await this.client.mutation({
      __name: 'CreatePeriod',
      createPeriod: {
        __args: { period, validateOnly, copyPeriodId },
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

  async markPeriodReviewed (periodId: string, validateOnly: boolean) {
    const response = await this.client.mutation({
      __name: 'MarkPeriodReviewed',
      markPeriodReviewed: {
        __args: { periodId, validateOnly },
        success: true,
        messages: {
          message: true,
          type: true,
          arg: true
        }
      }
    })
    return this.mutationForDialog(response.markPeriodReviewed, { prefix: 'period' })
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
      updatePeriodRequirement: {
        __args: { periodId, requirementKey, disabled },
        success: true
      }
    })
    return response.updatePeriodRequirement.success
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
        reviewed: true,
        programs: {
          key: true,
          title: true,
          enabled: true,
          requirements: {
            key: true,
            title: true,
            description: true,
            enabled: true,
            type: true,
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

  async getConfigurationFetched (periodId: string, definitionKey: string) {
    const response = await this.client.query({
      __name: 'GetConfigurationFetched',
      periods: {
        __args: { filter: { ids: [periodId] } },
        configurations: {
          __args: { filter: { keys: [definitionKey] } },
          fetchedData: true
        }
      }
    })
    return response.periods[0].configurations[0]?.fetchedData ?? {}
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
          managers: {
            fullname: true,
            email: true
          },
          dateAdded: true,
          dateCreated: true
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
      dateAdded: DateTime.fromISO(group.dateAdded),
      dateCreated: group.dateCreated ? DateTime.fromISO(group.dateCreated) : undefined
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
          managers: {
            fullname: true,
            email: true
          },
          dateAdded: true,
          dateCreated: true
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
      dateAdded: DateTime.fromISO(group.dateAdded),
      dateCreated: group.dateCreated ? DateTime.fromISO(group.dateCreated) : undefined
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

  async upsertRole (roleId: string | undefined, role: AccessRoleInput, validateOnly: boolean, copyRoleId?: string) {
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
          __args: { role, copyRoleId, validateOnly },
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
