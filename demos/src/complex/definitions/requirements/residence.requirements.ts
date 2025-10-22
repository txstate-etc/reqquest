import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidenceConfigRequirementData } from '../models/index.js'
import { StateResidencePromptData } from '../models/index.js'

export const state_residence_prequal_req: RequirementDefinition<StateResidenceConfigRequirementData> = {
  type: RequirementType.PREQUAL,
  key: 'state_residence_prequal_req',
  title: 'Provide residency information',
  navTitle: 'Residency',
  description: 'Provide identifying information for applicants state of residence',
  promptKeys: ['state_residence_prompt'],
  resolve: (data, config) => {
    const stateResidencePromptData = data.state_residence_prompt as StateResidencePromptData
    if (stateResidencePromptData?.state == null) return { status: RequirementStatus.PENDING }
    if (!config.residentOfState.find(state => stateResidencePromptData!.state === state)) return { status: RequirementStatus.DISQUALIFYING, reason: `You must reside in one of the following states to qualify: ${config.residentOfState.join(', ')}.` }
    return { status: RequirementStatus.PENDING }
  },
  configuration: {
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.residentOfState == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the state(s) to which an applicant must reside to qualify for any programs.', arg: 'residentOfState' })
      }
      return messages
    },
    default: { residentOfState: ['Texas', 'Oklahoma', 'Louisiana'] }
  }  
}



