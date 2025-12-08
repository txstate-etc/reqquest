import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { YardPromptSchema } from '../models/index.js'

export const yard_prompt: PromptDefinition = {
  key: 'yard_prompt',
  title: 'Yard',
  description: 'Applicant will identify size of yard in square feet.',
  schema: YardPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (!data) messages.push({ type: MutationMessageType.error, message: 'Square feet of current yard is required', arg: 'sqftYardSize' })
    if (data.sqftYardSize == null || data.sqftYardSize < 1) messages.push({ type: MutationMessageType.error, message: 'Outdoor space is required', arg: 'sqftYardSize' })
    return messages
  }
}
