import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidencePromptSchema, StateResidencePromptData, StateResidenceConfigRequirementData } from '../models/index.js'

export const state_residence_prompt: PromptDefinition = {
  key: 'state_residence_prompt',
  title: 'State residency',
  description: 'Applicant will identify if they reside in the required state.',
  schema: StateResidencePromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (data.residentOfRequiredState == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please confirm specify you are a resident of the state.', arg: 'residentOfRequiredState' })
    }
    return messages
  }
}
