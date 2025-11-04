import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { ChildrenPromptSchema } from '../models/index.js'

export const children_prompt: PromptDefinition = {
  key: 'children_prompt',
  title: 'Young children',
  description: 'Applicant will identify if young children live in the hom.',
  schema: ChildrenPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.underMinAge == null) messages.push({ type: MutationMessageType.error, message: 'Children information required', arg: 'underMinAge' })
    if (data.underMinAge) {
      if (data.count == null) messages.push({ type: MutationMessageType.error, message: 'Number of young children is required', arg: 'count' })
      if (data.details == null) messages.push({ type: MutationMessageType.error, message: 'Please provide details such as ages, comfort with animals', arg: 'details' })
    } 
    return messages
  }
}