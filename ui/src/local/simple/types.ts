import type { FieldUploadPreload } from '@txstate-mws/carbon-svelte'

export interface StateResidencePromptData {
  residentOfRequiredState: boolean
}

export interface StateResidenceConfigRequirementData {
  stateNames: string[]
  residentIdDoc: FieldUploadPreload
}