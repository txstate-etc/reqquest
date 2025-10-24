import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { DogOwnerPromptSchema } from '../models/index.js'


export const dogowner_prompt: PromptDefinition = {
  key: 'dogowner_prompt',
  title: 'Dog owner',
  description: 'Applicant will identify dog owner information.',
  schema: DogOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.everOwnedADog == null) messages.push({ type: MutationMessageType.error, message: 'Previous dog ownership input required', arg: 'everOwnedADog' })
    if (data.everOwnedADog) {
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide details such as breed and age', arg: 'details' })
    } else {
      messages.push({ type: MutationMessageType.warning, message: 'Previous dog ownership is usually required.  Exceptions on a case by case basis.' })
    }  
    return messages
  }
}

