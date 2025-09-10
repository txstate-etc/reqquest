import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidencePromptSchema, StateResidencePromptData, StateResidenceConfigRequirementData } from '../models/index.js'

export const state_residence_prompt: PromptDefinition = {
  key: 'state_residence_prompt',
  title: 'State residency',
  description: 'Applicant will identify if they reside in the required state.',
  schema: StateResidencePromptSchema,
  fetch: async (data, config) => { console.log(`***FETCH CONFIG***${JSON.stringify(config)}`); return ({ residentOfState: config.residentOfState })},
  validate: (data, config, allConfig) => {
    console.log(`***VALIDATE CONFIG***${JSON.stringify(config)}`); 
    console.log(`***ALL CONFIG***${JSON.stringify(allConfig)}`); 
    const messages: MutationMessage[] = []
    if (data.residentOfRequiredState == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please confirm specify you are a resident of the state.', arg: 'residentOfRequiredState' })
    }
    return messages
  }
}
