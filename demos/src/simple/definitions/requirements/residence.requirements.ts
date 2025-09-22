import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidenceConfigRequirementData, StateResidencePromptData } from '../models/index.js'

export const state_residence_req: RequirementDefinition<StateResidenceConfigRequirementData> = {
  type: RequirementType.QUALIFICATION,
  key: 'state_residence_req',
  title: 'Must be a resident of required state',
  navTitle: 'Residency',
  description: 'Applicant must be a resident of the required state',
  promptKeys: ['state_residence_prompt'],
  resolve: (data, config) => {
    const stateResidencePromptData = data.state_residence_prompt as StateResidencePromptData
    if (stateResidencePromptData?.residentOfRequiredState == null) return { status: RequirementStatus.PENDING }
    if (stateResidencePromptData?.residentOfRequiredState === true) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.DISQUALIFYING, reason: `You must reside in ${config.residentOfState} to qualify.` }
  },
  configuration: {
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.residentOfState == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the state to which an applicant must reside.', arg: 'residentOfState' })
      }
      return messages
    },
    default: { residentOfState: 'Texas' }
  }  
}
