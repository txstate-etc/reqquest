import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { ReviewStateResidenceInfoPromptData, stateList, StateResidenceConfigRequirementData } from '../models/index.js'
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
    return { status: RequirementStatus.MET }
  },
  configuration: {
    fetch: async periodId => {
      return { states: stateList }
    },
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

export const review_applicant_state_residence_app_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'review_applicant_state_residence_app_req',
  title: 'Review applicant residency info',
  navTitle: 'Review applicant residency info',
  description: 'A Reviewer will confirm applicant residency info matches identifying documentation.',
  promptKeys: ['review_applicant_state_residence_info_prompt'],
  resolve: (data, config) => {
    const revResInfoData = data.review_applicant_state_residence_info_prompt as ReviewStateResidenceInfoPromptData
    if (revResInfoData == null) return { status: RequirementStatus.PENDING }
    // TODO: Question, should a correction flow leave in pending state for corrections or disqualify before reviewer return??
    if (!revResInfoData.residencyInfoAcceptable) return { status: RequirementStatus.DISQUALIFYING }
    return { status: RequirementStatus.MET }
  }
}
