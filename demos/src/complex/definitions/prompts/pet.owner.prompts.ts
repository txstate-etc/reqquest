import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PetOwnerPromptSchema } from '../models/index.js'


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

