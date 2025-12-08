import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { AcceptCatPromptSchema, AdoptACatList, CurrentCatOwnerPromptSchema, OwnerCatAllergyPromptSchema, OwnerCatMicrochipServicePrompt, PreviousCatOwnerPromptSchema, ReviewApplicantCatInfoPromptSchema } from '../models/cat.owner.models.js'
import { getRandomUniqueElements } from '../util.js'

export const previous_catowner_prompt: PromptDefinition = {
  key: 'previous_catowner_prompt',
  title: 'Previous cat owner',
  description: 'Applicant will identify previous cat owner information.',
  schema: PreviousCatOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (!data || data.owned == null) messages.push({ type: MutationMessageType.error, message: 'Previous cat ownership input required', arg: 'owned' })
    if (data.owned) {
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide details such as breed and age', arg: 'details' })
    } else {
      messages.push({ type: MutationMessageType.warning, message: 'Previous cat ownership is usually required.  Exceptions on a case by case basis.' })
    }
    return messages
  },
  invalidUponChange: [{ promptKey: 'review_applicant_cat_info_prompt' }]
}

export const current_catowner_prompt: PromptDefinition = {
  key: 'current_catowner_prompt',
  title: 'Current cat owner',
  description: 'Applicant will identify current cat owner information.',
  schema: CurrentCatOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (!data || data.owned == null) messages.push({ type: MutationMessageType.error, message: 'Current cat ownership input required', arg: 'owned' })
    if (data.owned) {
      if (data.count == null || data.count < 1) messages.push({ type: MutationMessageType.error, message: 'Please provide current cat count', arg: 'count' })
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide additional details', arg: 'details' })
    }
    return messages
  },
  invalidUponChange: [{ promptKey: 'review_applicant_cat_info_prompt' }]
}

export const owner_cat_allergy_prompt: PromptDefinition = {
  key: 'owner_cat_allergy_prompt',
  title: 'Owner cat allergies',
  description: 'Applicant will identify any current cat allergies',
  schema: OwnerCatAllergyPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (!data || data.allergic == null) messages.push({ type: MutationMessageType.error, message: 'Owner allergy information required', arg: 'allergic' })
    if (data.allergic) {
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide additional details', arg: 'details' })
    }
    return messages
  },
  invalidUponChange: [{ promptKey: 'review_applicant_cat_info_prompt' }]
}

export const owner_cat_microchip_service_prompt: PromptDefinition = {
  key: 'owner_cat_microchip_service_prompt',
  title: 'Microchip service',
  description: 'Applicant will pay for microchip service',
  schema: OwnerCatMicrochipServicePrompt,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (!data || data.agreeToPay == null) messages.push({ type: MutationMessageType.error, message: 'Owner microship service information required', arg: 'agreeToPat' })
    if (!data.agreeToPay) {
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide additional details', arg: 'details' })
    }
    return messages
  },
  invalidUponChange: [{ promptKey: 'review_applicant_cat_info_prompt' }]
}

export const review_applicant_cat_info_prompt: PromptDefinition = {
  key: 'review_applicant_cat_info_prompt',
  title: 'Review applicant cat info',
  description: 'Reviewer will evaluate appicant cat info for discrepancies.',
  schema: ReviewApplicantCatInfoPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (!data) {
      messages.push({ type: MutationMessageType.error, message: 'Review applicant cat info required' })
    } else {
      if (data.previousCatAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'previousCatAcceptable' })
      if (data.currentCatAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'currentCatAcceptable' })
      if (data.livingSpaceAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'livingSpaceAcceptable' })
      if (data.allergyAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'allergyAcceptable' })
      if (data.microchipAgree == null) messages.push({ type: MutationMessageType.error, message: 'Agreement designation required', arg: 'microchipAgree' })
    }
    return messages
  }
}

export const accept_cat_prompt: PromptDefinition = {
  key: 'accept_cat_prompt',
  title: 'Accept a cat for adoption',
  description: 'Applicant will decided if and which cat to adopt.',
  schema: AcceptCatPromptSchema,
  fetch: (appRequest, config, appRequestData, allPeriodConfig, ctx) => {
    return getRandomUniqueElements(AdoptACatList)
  },
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (!data) {
      messages.push({ type: MutationMessageType.error, message: 'Acceptance info required' })
    } else {
      if (data.accept == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'accept' })
      if (data.accept) {
        // for complex demo / simulation we are trusting that data is consistent, normally sending id would be all required and we'd look up related detail
        if (data.id == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance cat id required', arg: 'id' })
      }
    }
    return messages
  }
}
