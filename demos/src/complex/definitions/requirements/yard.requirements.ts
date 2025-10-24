import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { YardConfigRequirementData } from '../models/index.js'
import { YardPromptData } from '../models/index.js'

export const yard_qual_req: RequirementDefinition<YardConfigRequirementData> = {
  type: RequirementType.QUALIFICATION,
  key: 'yard_qual_req',
  title: 'Provide yard information',
  navTitle: 'Yard',
  description: 'Provide information for applicants yard',
  promptKeys: ['yard_prompt'],
  resolve: (data, config) => {
    const YardPromptData = data.yard_prompt as YardPromptData
    //if (stateResidencePromptData?.state == null) return { status: RequirementStatus.PENDING }
    //if (!config.residentOfState.find(state => stateResidencePromptData!.state === state)) return { status: RequirementStatus.DISQUALIFYING, reason: `You must reside in one of the following states to qualify: ${config.residentOfState.join(', ')}.` }
    return { status: RequirementStatus.MET }
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



