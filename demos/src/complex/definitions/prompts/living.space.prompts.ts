import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { LivingSpacePromptSchema } from '../models/index.js'


export const living_space_prompt: PromptDefinition = {
  key: 'living_space_prompt',
  title: 'Living space',
  description: 'Applicant will identify size of indoor living space in square feet.',
  schema: LivingSpacePromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data) messages.push({ type: MutationMessageType.error, message: 'Square feet of current indoor living space is required', arg: 'sqftLivingSpace' })
    if (data.sqftLivingSpace == null || data.sqftLivingSpace < 1) messages.push({ type: MutationMessageType.error, message: 'Indoor living space is required', arg: 'sqftLivingSpace' })
    return messages
  }
}

