import type { TagItem } from '@txstate-mws/carbon-svelte'
import { enumAppRequestStatus, enumRequirementType, type AppRequestStatus, type RequirementType } from './typed-client/schema.js'
import { longNumericTime } from './util.js'

interface AppStatusConfig {
  // Display information
  label: string
  description: string
  color: TagItem['type']
  waitingOn: 'Applicant' | 'System' | 'Reviewer' | 'No one, complete'
  navigation?: {
    label: string
    href: (requestId: string) => string
  }
  // UI actions
  buttonText: string
  actionType: 'navigate' | 'download' | 'export' | 'none'
  category: 'current' | 'past'
}

interface ApplicationStatusTagInfo {
  label: string
  description: string
  color: TagItem['type']
}

// ========================================
// === AppRequest Status ===
// ========================================

export const APP_REQUEST_STATUS_CONFIG: Record<AppRequestStatus, AppStatusConfig> = {
  STARTED: {
    label: 'In progress',
    description: 'Application is in progress and has not been submitted.',
    color: 'green',
    waitingOn: 'Applicant',
    buttonText: 'Edit Application',
    actionType: 'navigate',
    category: 'current',
    navigation: {
      label: 'Continue application',
      href: (requestId: string) => `/requests/${requestId}/apply`
    }
  },
  READY_TO_SUBMIT: {
    label: 'In progress',
    description: 'Application is complete and ready to submit.',
    color: 'green',
    waitingOn: 'Applicant',
    buttonText: 'Edit Application',
    actionType: 'navigate',
    category: 'current',
    navigation: {
      label: 'Continue application',
      href: (requestId: string) => `/requests/${requestId}/apply`
    }
  },
  PREAPPROVAL: {
    label: 'Review pending',
    description: 'Application submitted and waiting for pre-approval requirements.',
    color: 'blue',
    waitingOn: 'System',
    buttonText: 'Export Application',
    actionType: 'export',
    category: 'current'
  },
  APPROVAL: {
    label: 'In review',
    description: 'Application is being reviewed.',
    color: 'blue',
    waitingOn: 'Reviewer',
    buttonText: 'Export Application',
    actionType: 'export',
    category: 'current'
  },
  ACCEPTANCE: {
    label: 'Offer pending',
    description: 'Waiting for you to respond to the offer.',
    color: 'teal',
    waitingOn: 'Applicant',
    buttonText: 'Review Offer',
    actionType: 'navigate',
    category: 'current',
    navigation: {
      label: 'Review Offer',
      href: (requestId: string) => `/requests/${requestId}/accept`
    }
  },
  ACCEPTED: {
    label: 'Offer accepted',
    description: 'You have accepted an offer.',
    color: 'green',
    waitingOn: 'No one, complete',
    buttonText: 'Download Offer',
    actionType: 'download',
    category: 'past'
  },
  READY_TO_ACCEPT: {
    label: 'Offer pending',
    description: 'You have been offered and can now accept.',
    color: 'teal',
    waitingOn: 'Applicant',
    buttonText: 'Review Offer',
    actionType: 'navigate',
    category: 'current',
    navigation: {
      label: 'Review Offer',
      href: (requestId: string) => `/requests/${requestId}/accept`
    }
  },
  REVIEW_COMPLETE: {
    label: 'In review',
    description: 'Your application is being reviewed.',
    color: 'blue',
    waitingOn: 'Reviewer',
    buttonText: 'Export Application',
    actionType: 'export',
    category: 'current'
  },
  APPROVED: {
    label: 'Approved',
    description: 'Your application has been approved.',
    color: 'green',
    waitingOn: 'No one, complete',
    buttonText: '',
    actionType: 'none',
    category: 'past'
  },
  NOT_APPROVED: {
    label: 'Ineligible',
    description: 'Your application was not approved.',
    color: 'red',
    waitingOn: 'No one, complete',
    buttonText: '',
    actionType: 'none',
    category: 'past'
  },
  NOT_ACCEPTED: {
    label: 'Offer declined',
    description: 'The offer was not accepted.',
    color: 'gray',
    waitingOn: 'No one, complete',
    buttonText: '',
    actionType: 'none',
    category: 'past'
  },
  CANCELLED: {
    label: 'Cancelled',
    description: 'Application was cancelled before submission.',
    color: 'gray',
    waitingOn: 'No one, complete',
    buttonText: '',
    actionType: 'none',
    category: 'past'
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    description: 'Application was withdrawn after submission.',
    color: 'gray',
    waitingOn: 'No one, complete',
    buttonText: '',
    actionType: 'none',
    category: 'past'
  },
  DISQUALIFIED: {
    label: 'Ineligible',
    description: 'All applications have been disqualified.',
    color: 'red',
    waitingOn: 'Applicant',
    buttonText: '',
    actionType: 'none',
    category: 'past'
  }
}

export const REVIEWER_STATUS_CONFIG: Record<AppRequestStatus, Pick<AppStatusConfig, 'label' | 'description' | 'color'>> = {
  STARTED: {
    label: 'In progress',
    description: 'Application is in progress and has not been submitted.',
    color: 'green'
  },
  READY_TO_SUBMIT: {
    label: 'In progress',
    description: 'Application is complete and ready to submit.',
    color: 'green'
  },
  PREAPPROVAL: {
    label: 'Review pending',
    description: 'Application submitted and waiting for pre-approval requirements.',
    color: 'blue'
  },
  APPROVAL: {
    label: 'In review',
    description: 'Application is being reviewed.',
    color: 'blue'
  },
  ACCEPTANCE: {
    label: 'Offer pending',
    description: 'Waiting for you to respond to the offer.',
    color: 'teal'
  },
  ACCEPTED: {
    label: 'Offer accepted',
    description: 'You have accepted an offer.',
    color: 'green'
  },
  READY_TO_ACCEPT: {
    label: 'Offer pending',
    description: 'You have been offered and can now accept.',
    color: 'teal'
  },
  REVIEW_COMPLETE: {
    label: 'Ready to release',
    description: 'Review is ready to be released to the applicant.',
    color: 'blue'
  },
  APPROVED: {
    label: 'Approved',
    description: 'Your application has been approved.',
    color: 'green'
  },
  NOT_APPROVED: {
    label: 'Ineligible',
    description: 'Your application was not approved.',
    color: 'red'
  },
  NOT_ACCEPTED: {
    label: 'Offer declined',
    description: 'The offer was not accepted.',
    color: 'gray'
  },
  CANCELLED: {
    label: 'Cancelled',
    description: 'Application was cancelled before submission.',
    color: 'gray'
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    description: 'Application was withdrawn after submission.',
    color: 'gray'
  },
  DISQUALIFIED: {
    label: 'Ineligible',
    description: 'All applications have been disqualified.',
    color: 'red'
  }
}

// Get complete AppRequest status information
export function getAppRequestStatusInfo (status: string): AppStatusConfig {
  return APP_REQUEST_STATUS_CONFIG[status] ?? {
    label: status,
    description: 'Status pending.',
    color: 'gray',
    waitingOn: 'No one, complete',
    buttonText: '',
    actionType: 'none',
    category: 'past'
  }
}

// Extract status categories
export function getCurrentStatuses (): AppRequestStatus[] {
  return Object.keys(APP_REQUEST_STATUS_CONFIG).filter(
    status => APP_REQUEST_STATUS_CONFIG[status as AppRequestStatus].category === 'current'
  ) as AppRequestStatus[]
}

export function getPastStatuses (): AppRequestStatus[] {
  return Object.keys(APP_REQUEST_STATUS_CONFIG).filter(
    status => APP_REQUEST_STATUS_CONFIG[status as AppRequestStatus].category === 'past'
  ) as AppRequestStatus[]
}

// Helper for navigation buttons
export function getNavigationButton (status: string, requestId: string): { label: string, href: string } | null {
  const navigation = APP_REQUEST_STATUS_CONFIG[status]?.navigation
  if (!navigation) return null

  return {
    label: navigation.label,
    href: navigation.href(requestId)
  }
}

// Helper functions for status actions
export function getSubmitButtonText (status: AppRequestStatus): string {
  return APP_REQUEST_STATUS_CONFIG[status].buttonText
}

export function getStatusActionType (status: AppRequestStatus): 'navigate' | 'download' | 'export' | 'none' {
  return APP_REQUEST_STATUS_CONFIG[status].actionType
}

// ========================================
// === Application Status ===
// ========================================

// Map ApplicationStatus enum to display info
export function getApplicationStatusInfo (status: string): ApplicationStatusTagInfo {
  const statusMap: Record<string, ApplicationStatusTagInfo> = {
    ACCEPTED: {
      label: 'Offer accepted',
      description: 'Offer accepted and all requirements met.',
      color: 'green'
    },
    ELIGIBLE: {
      label: 'Eligible',
      description: 'All requirements met, acceptance pending.',
      color: 'green'
    },
    INELIGIBLE: {
      label: 'Ineligible',
      description: 'One or more requirements not met.',
      color: 'red'
    },
    PENDING: {
      label: 'In progress',
      description: 'Awaiting further information.',
      color: 'purple'
    },
    REJECTED: {
      label: 'Offer declined',
      description: 'Offer rejected or requirements not met.',
      color: 'gray'
    }
  }
  return statusMap[status] ?? { label: status, description: 'Unknown status.', color: 'gray' }
}

export const applicantStatuses = new Set<AppRequestStatus>([
  enumAppRequestStatus.STARTED,
  enumAppRequestStatus.READY_TO_SUBMIT
])

export const applicantRequirementTypes = new Set<RequirementType>([
  enumRequirementType.PREQUAL,
  enumRequirementType.POSTQUAL,
  enumRequirementType.QUALIFICATION
])

// ========================================
// === Periods ===
// ========================================
const noClosePeriodDate = '9999-12-031T23:59:59.000-06:00'

export function getPeriodStatus (period: any) {
  if (!period.openDate) return 'unknown'
  const now = new Date()
  const openDate = new Date(period.openDate)
  const closeDate = (!period.closeDate) ? new Date(noClosePeriodDate) : new Date(period.closeDate)
  if (now < openDate) return 'upcoming'
  if (now > closeDate) return 'closed'
  return 'open'
}

export function getPeriodDisplayInfo (period: any) {
  const status = getPeriodStatus(period)
  return {
    status,
    openLabel: status === 'closed' ? 'TBD' : longNumericTime(period.openDate),
    openDateMachineFormat: period.openDate,
    closeLabel: status === 'closed' ? 'Application closed' : 'Application closes',
    closeDate: (!period.closeDate) ? longNumericTime(noClosePeriodDate) : longNumericTime(period.closeDate),
    closeDateMachineFormat: period.closeDate ?? new Date(noClosePeriodDate),
    canStartNew: status === 'open' && period.reviewed === true
  }
}
