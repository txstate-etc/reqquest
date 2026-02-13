import type { APIBase } from '@txstate-mws/sveltekit-utils'
import type { AppRequestStatus, createClient } from './typed-client/index.js'

export interface ReqquestAPI extends APIBase {
  client: ReturnType<typeof createClient>
  getDownloadTicket: () => Promise<string>
}
export interface ReviewerCardRequest<OtherInfoType = any> {
  complete: boolean
  status: AppRequestStatus
  closedAt: string
  applicant: ReviewerCardApplicant<OtherInfoType>
  period: {
    id: string
    name: string
    code: string
    openDate: string
    closeDate: string
    archiveDate: string
  }
  applications: {
    id: string
    navTitle: string
    programKey: string
  }[]
  actions: {
    acceptOffer: boolean
    cancel: boolean
    close: boolean
    completeRequest: boolean
    completeReview: boolean
    reopen: boolean
    returnToApplicant: boolean
    returnToNonBlocking: boolean
    returnToOffer: boolean
    returnToReview: boolean
    review: boolean
    submit: boolean
  }
}

export interface ReviewerCardApplicant<OtherInfoType = any> {
  login: string
  fullname: string
  otherIdentifiers: {
    id: string
    label: string
  }[]
  otherInfo: OtherInfoType
}
