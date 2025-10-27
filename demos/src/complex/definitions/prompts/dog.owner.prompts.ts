import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PreviousDogOwnerPromptSchema, CurrentDogOwnerPromptSchema, OwnerDogAllergyPromptSchema } from '../models/index.js'


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
  }
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
      if (data.count == null) messages.push({ type: MutationMessageType.error, message: 'Please provide current dog count', arg: 'count' })
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide additional details', arg: 'details' })
    }   
    return messages
  }
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
  }
}

