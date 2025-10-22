import type { FieldUploadPreload } from '@txstate-mws/carbon-svelte'
import { inherits } from 'util'

export interface UploadInfoWithSumSchema{
  _type: string,
  multipartIndex: number,
  name: string,
  mime: string,
  size: number,
  shasum: string
}

export interface StateResidencePromptData {
  residentOfRequiredState: boolean, 
  firstName: string,
  lastName: string,
  streetAddress: string,
  emailAddress: string,
  phoneNumber: string,
  city: string,
  state: string,
  zipCode: string,
  residentIdDoc: UploadInfoWithSumSchema,
}

export interface StateResidencePromptReviewData extends StateResidencePromptData {
  residenceIsHome: boolean
}