import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidenceConfigRequirementData } from '../models/index.js'
import { StateResidencePromptData } from '../models/index.js'

export const state_residence_req: RequirementDefinition<StateResidenceConfigRequirementData> = {
  type: RequirementType.PREQUAL,
  key: 'state_residence_req',
  title: 'Provide state residency information',
  navTitle: 'State Residency',
  description: 'Provide identifying information for applicants state of residence',
  promptKeys: ['state_residence_prompt', 'state_residence_confirmation_prompt'],
  resolve: (data, config) => {
    const stateResidencePromptData = data.state_residence_prompt as StateResidencePromptData
    //if (stateResidencePromptData?.residentOfRequiredState == null) return { status: RequirementStatus.PENDING }
    //if (stateResidencePromptData?.residentOfRequiredState === true) return { status: RequirementStatus.MET }
    // query usps with input address to get details .. or is this done at the prompt level
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



