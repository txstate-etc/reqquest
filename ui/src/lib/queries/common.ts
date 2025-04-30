export interface Actions {
  update: boolean
  delete: boolean
}

export enum RequirementType {
  PREQUAL = 'PREQUAL',
  QUALIFICATION = 'QUALIFICATION',
  PREAPPROVAL = 'PREAPPROVAL',
  APPROVAL = 'APPROVAL'
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

export interface AppRequestData {
  [key: string]: any
  savedAtVersion: string
}
