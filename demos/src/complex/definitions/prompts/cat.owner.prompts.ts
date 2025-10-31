import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { CurrentCatOwnerPromptSchema, PreviousCatOwnerPromptSchema } from '../models/cat.owner.models.js'

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
  }
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
  }
}