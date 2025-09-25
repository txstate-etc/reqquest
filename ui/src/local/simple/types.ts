import type { FieldUploadPreload } from '@txstate-mws/carbon-svelte'
import { inherits } from 'util'

export interface StateResidencePromptData {
  residentOfRequiredState: boolean
}

export interface StateResidencePromptReviewData extends StateResidencePromptData {
  residenceIsHome: boolean
}