import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidenceConfigRequirementData, StateResidenceConfirmationPromptData, StateResidenceConfirmationRequirementData, StateResidencePromptData, Step1PostResidencePromptData } from '../models/index.js'

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

export const step1_post_residence_req: RequirementDefinition<StateResidenceConfigRequirementData> = {
  type: RequirementType.QUALIFICATION,
  key: 'step1_post_residence_req',
  title: 'Accessible post hard req stop?',
  navTitle: 'Accessible post hard req stop?',
  description: 'Identifies whether requirement+prompts show post previous req that returns disqualifying',
  promptKeys: ['state_residence_prompt'],
  resolve: (data, config) => {
    const promptData = data.state_residence_prompt as Step1PostResidencePromptData
    if (promptData?.allow == null) return { status: RequirementStatus.PENDING }
    if (promptData?.allow === true) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.DISQUALIFYING, reason: 'Not allowed.' }
  }
}

export const state_residence_confirmation_req: RequirementDefinition<StateResidenceConfirmationRequirementData> = {
  type: RequirementType.APPROVAL,
  key: 'state_residence_confirmation_req',
  title: 'Confirm resident of required state',
  navTitle: 'Confirm residency',
  description: 'Reviewer must validate ID provided and confirm as resident of state.',
  promptKeys: ['state_residence_confirmation_prompt'],
  resolve: (data, config, allConfig) => {
    const resPromptData = data['state_residence_confirmation_prompt'] as StateResidenceConfirmationPromptData
    if (resPromptData == null) {
      return { status: RequirementStatus.PENDING }
    } else {
      if (resPromptData.residentOfRequiredState && resPromptData.residenceIsHome) return { status: RequirementStatus.MET }
    }
    return { status: RequirementStatus.DISQUALIFYING, reason: `Applicant does not reside in a home in ${allConfig.state_residence_req.residentOfState}.` }
  }
}
