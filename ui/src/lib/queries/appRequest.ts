import type { ApplicationStatus, AppRequestData, RequirementStatus, RequirementType } from './common'

export const APP_REQUEST_FIELDS = `
  id
`

export interface AppRequestInList {
  id: string
}

export interface AppRequestFilter {
  ids?: string[]
}

export const GET_APP_REQUESTS = `
  query GetAppRequests ($filter: AppRequestFilter) {
    appRequests (filter: $filter) {
      ${APP_REQUEST_FIELDS}
    }
  }
`
export interface GetAppRequestsResponse {
  appRequests: AppRequestInList[]
}

export interface PaginationParams {
  page?: number
  perPage?: number
  pageSize?: number
}

export const GET_NEXT_PROMPT = `
  id
  submitEligible
  applications {
    id
    status
    requirements {
      id
      type
      status
      prompts {
        id
        key
        hiddenInNavigation
      }
    }
  }
`
export interface GetNextPrompt {
  id: string
  submitEligible: boolean
  applications: {
    id: string
    status: ApplicationStatus
    requirements: {
      id: string
      type: RequirementType
      status: RequirementStatus
      prompts: {
        id: string
        key: string
        hiddenInNavigation: boolean
      }[]
    }[]
  }[]
}

export const GET_APP_REQUEST = `
  query GetAppRequest ($appRequestId: ID!, $schemaVersion: String, $requirementTypes: [RequirementType!]) {
    appRequests (filter: { ids: [$appRequestId] }) {
      id
      eligibleForSubmit
      data (schemaVersion: $schemaVersion)
      applications {
        id
        status
        statusReason
        requirements (filter: { types: $requirementTypes }) {
          id
          reachable
          status
          statusReason
          prompts {
            id
            key
            reachable
            hiddenInNavigation
            askedInEarlierRequirement
            askedInEarlierApplication
          }
        }
      }
    }
  }
`
export interface GetAppRequestResponse {
  appRequests: {
    id: string
    eligibleForSubmit: boolean
    data: AppRequestData
    applications: {
      id: string
      status: ApplicationStatus
      statusReason?: string
      requirements: {
        id: string
        status: RequirementStatus
        statusReason?: string
        prompts: {
          id: string
          key: string
          answered: boolean
          invalidated: boolean
          reachable: boolean
          hiddenInNavigation: boolean
          askedInEarlierRequirement: boolean
          askedInEarlierApplication: boolean
        }[]
      }[]
    }[]
  }[]
}
