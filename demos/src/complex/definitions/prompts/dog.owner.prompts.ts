import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PreviousDogOwnerPromptSchema } from '../models/index.js'


export const previous_dogowner_prompt: PromptDefinition = {
  key: 'previous_dogowner_prompt',
  title: 'Previous dog owner',
  description: 'Applicant will identify dog owner information.',
  schema: PreviousDogOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.owned == null) messages.push({ type: MutationMessageType.error, message: 'Previous dog ownership input required', arg: 'everOwnedADog' })
    if (data.owned) {
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide details such as breed and age', arg: 'details' })
    } else {
      messages.push({ type: MutationMessageType.warning, message: 'Previous dog ownership is usually required.  Exceptions on a case by case basis.' })
    }  
    return messages
  }
}

