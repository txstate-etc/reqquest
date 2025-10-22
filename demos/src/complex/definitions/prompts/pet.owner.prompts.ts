import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PreviousPetOwnerPromptSchema } from '../models/index.js'


export const previous_petowner_prompt: PromptDefinition = {
  key: 'previous_petowner_prompt',
  title: 'Previous pet owner',
  description: 'Applicant will identify previous pet owner information.',
  schema: PreviousPetOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []  
    if (!data.previousPetOwnnership?.owned) messages.push({ type: MutationMessageType.error, message: 'Previous pet ownership input required', arg: 'previousPetOwnership.owned' })
    if (data.previousPetOwnnership.owned) {
      if (!data.previousPetOwnnership.count) messages.push({ type: MutationMessageType.error, message: 'Number of previous pets required', arg: 'previousPetOwnnership.count' })
      if (data.previousPetOwnnership.count > 0) {
        if (!data.currentPetOwnership.count) messages.push({ type: MutationMessageType.error, message: 'Number of current pets required', arg: 'currentPetOwnnership.count' })
        if (!data.currentPetOwnership.details) messages.push({ type: MutationMessageType.error, message: 'Details of current pets required', arg: 'currentPetOwnnership.details' })
      }
    } 
    return messages
  }
}

