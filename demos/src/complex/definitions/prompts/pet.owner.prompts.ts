import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { ChildrenPromptData, PetOwnerPromptSchema, ReviewApplicantFosterAPetPromptSchema } from '../models/index.js'


export const petowner_prompt: PromptDefinition = {
  key: 'petowner_prompt',
  title: 'Pet owner',
  description: 'Applicant will identify previous and current pet owner information.',
  schema: PetOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.previousPetOwner == null) messages.push({ type: MutationMessageType.error, message: 'Previous pet ownership input required', arg: 'previousPetOwner' })
    if (data.previousPetOwner) {
      if (data.previousPetCount == null || data.previousPetCount < 1) messages.push({ type: MutationMessageType.error, message: 'Number of previous pets required', arg: 'previousPetCount' })
      if (data.currentPetOwner == null ) messages.push({ type: MutationMessageType.error, message: 'Current pet ownership input required', arg: 'currentPetOwner' })
      if (data.currentPetOwner) {
        if (data.currentPetCount == null || data.currentPetCount < 1) messages.push({ type: MutationMessageType.error, message: 'Number of current pets required', arg: 'currentPetCount' })
        if (data.currentPetDetails == null) messages.push({ type: MutationMessageType.error, message: 'Details of current pets required', arg: 'currentPetDetails' })
      }
    }  
    return messages
  }
}

export const review_applicant_foster_a_pet_info_prompt: PromptDefinition = {
  key: 'review_applicant_foster_a_pet_info_prompt',
  title: 'Review applicant foster info',
  description: 'Reviewer will evaluate applicant foster info for discrepancies.',
  schema: ReviewApplicantFosterAPetPromptSchema,
  validate: (data, config, appRequestData) => {
    const messages: MutationMessage[] = [] 
    if (!data) {
      messages.push({ type: MutationMessageType.error, message: 'Review applicant foster info required' })
    } else {      
      const childData = appRequestData.children_prompt as ChildrenPromptData // children_qual_req
      if (childData) {
        if (childData.underMinAge && data.underAgeChildrenAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'underAgeChildrenAcceptable' })
      } else {
        if (data.underAgeChildrenAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'underAgeChildrenAcceptable' })
      }
    }      
    return messages
  }
}