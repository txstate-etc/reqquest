export interface AppRequestData {
  [key: string]: any
  savedAtVersion: string
}

export enum RequirementStatus {
  MET = 'MET',
  DISQUALIFYING = 'DISQUALIFYING',
  WARNING = 'WARNING',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PENDING = 'PENDING'
}

export enum ApplicationStatus {
  PREQUAL = 'PREQUAL',
  FAILED_PREQUAL = 'FAILED_PREQUAL',
  QUALIFICATION = 'QUALIFICATION',
  FAILED_QUALIFICATION = 'FAILED_QUALIFICATION',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL',
  APPROVED = 'APPROVED',
  NOT_APPROVED = 'NOT_APPROVED',
  CANCELLED = 'CANCELLED'
}

export interface AppRequest {
  id: string
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
        answered: boolean
        invalidated: boolean
        reachable: boolean
        hiddenInNavigation: boolean
        askedInEarlierRequirement: boolean
        askedInEarlierApplication: boolean
      }[]
    }[]
  }[]
}
