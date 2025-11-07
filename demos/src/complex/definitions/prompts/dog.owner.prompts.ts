import { type PromptDefinition } from '@reqquest/api'
import { InvalidatedResponse } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PreviousDogOwnerPromptSchema, CurrentDogOwnerPromptSchema, OwnerDogAllergyPromptSchema, DogExercisePromptSchema, ReviewApplicantDogInfoPromptSchema } from '../models/index.js'


export const previous_dogowner_prompt: PromptDefinition = {
  key: 'previous_dogowner_prompt',
  title: 'Previous dog owner',
  description: 'Applicant will identify previous dog owner information.',
  schema: PreviousDogOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.owned == null) messages.push({ type: MutationMessageType.error, message: 'Previous dog ownership input required', arg: 'owned' })
    if (data.owned) {
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide details such as breed and age', arg: 'details' })
    } else {
      messages.push({ type: MutationMessageType.warning, message: 'Previous dog ownership is usually required.  Exceptions on a case by case basis.' })
    }  
    return messages
  },
  invalidUponChange: [{promptKey: 'review_applicant_dog_info_prompt'}]
}

export const current_dogowner_prompt: PromptDefinition = {
  key: 'current_dogowner_prompt',
  title: 'Current dog owner',
  description: 'Applicant will identify current dog owner information.',
  schema: CurrentDogOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.owned == null) messages.push({ type: MutationMessageType.error, message: 'Current dog ownership input required', arg: 'owned' })
    if (data.owned) {
      if (data.count == null || data.count < 1) messages.push({ type: MutationMessageType.error, message: 'Please provide current dog count', arg: 'count' })
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide additional details', arg: 'details' })
    }   
    return messages
  },
  invalidUponChange: [{promptKey: 'review_applicant_dog_info_prompt'}]
}

export const owner_dog_allergy_prompt: PromptDefinition = {
   key: 'owner_dog_allergy_prompt',
  title: 'Owner dog allergies',
  description: 'Applicant will identify any current dog allergies',
  schema: OwnerDogAllergyPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.allergic == null) messages.push({ type: MutationMessageType.error, message: 'Owner allergy information required', arg: 'allergic' })
    if (data.allergic) {
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide additional details', arg: 'details' })
    }
    return messages
  },
  invalidUponChange: [{promptKey: 'review_applicant_dog_info_prompt'}]
}

export const dog_min_exercise_prompt: PromptDefinition = {
  key: 'dog_exercise_prompt',
  title: 'Dog exercise',
  description: 'Applicant will identify expected exercise hours for dog.',
  schema: DogExercisePromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.agreeToExercise == null) messages.push({ type: MutationMessageType.error, message: 'Dog exericse consent requirement', arg: 'agreeToExercise' })
    if (!data.agreeToExercise) {
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide additional details', arg: 'details' })
    }  
    return messages
  },
  invalidUponChange: [{promptKey: 'review_applicant_dog_info_prompt'}]
}

export const review_applicant_dog_info_prompt: PromptDefinition = {
  key: 'review_applicant_dog_info_prompt',
  title: 'Review applicant dog info',
  description: 'Reviewer will evaluate appicant dog info for discrepancies.',
  schema: ReviewApplicantDogInfoPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data) {
      messages.push({ type: MutationMessageType.error, message: 'Review applicant dog info required' })
    } else {
      if (data.previousDogAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'previousDogAcceptable' })
      if (data.currentDogAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'currentDogAcceptable' })
      if (data.yardAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'yardAcceptable' })
      if (data.allergyAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Acceptance designation required', arg: 'allergyAcceptable' })
      if (data.exerciseMinMet == null) {
        messages.push({ type: MutationMessageType.error, message: 'Exercise minimum met required', arg: 'exerciseMinMet' })
      } else {
        if (data.exerciseException == null) messages.push({ type: MutationMessageType.error, message: 'Exception determination required', arg: 'exerciseException' })
      }
    }
    return messages
  }
}

