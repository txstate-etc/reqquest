import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { IDValuesExtraDataPromptData, IDValuesPromptData, Step1PostResidencePromptData, Step2PostResidencePromptData, Step3PostResidencePromptData, ThanksOrNoThanksPromptData } from '../models/index.js'

export const step1_post_residence_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'step1_post_residence_req',
  title: 'Accessible validation stop 1?',
  navTitle: 'Accessible validation stop 1?',
  description: 'Identifies whether requirement+prompts show post previous req that returns disqualifying',
  promptKeys: ['step1_post_residence_prompt', 'step2_post_residence_prompt'],
  resolve: (data, config) => {
    const promptData1 = data.step1_post_residence_prompt as Step1PostResidencePromptData
    const promptData2 = data.step2_post_residence_prompt as Step2PostResidencePromptData
    if (promptData1?.allow == null || promptData2?.allow == null) return { status: RequirementStatus.PENDING }
    if (promptData1?.allow === true && promptData2?.allow === true) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.DISQUALIFYING, reason: 'Not allowed.' }
  }
}

export const step3_post_residence_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'step3_post_residence_req',
  title: 'Accessible post hard req stop?',
  navTitle: 'Accessible post hard req stop?',
  description: 'Identifies whether requirement+prompts show post previous req that returns disqualifying',
  promptKeys: ['step3_post_residence_prompt'],
  resolve: (data, config) => {
    const promptData3 = data.step3_post_residence_prompt as Step3PostResidencePromptData
    if (promptData3?.allow == null) return { status: RequirementStatus.PENDING }
    if (promptData3?.allow === true) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.DISQUALIFYING, reason: 'Not allowed.' }
  }
}

export const thanks_or_no_thanks_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'thanks_or_no_thanks_req',
  title: 'May or may not want',
  navTitle: 'May or may not want',
  description: 'Simulate a requirement within a program/track that a user may not want',
  promptKeys: ['thanks_or_no_thanks_prompt'],
  resolve: (data, config) => {
    const promptData = data.thanks_or_no_thanks_prompt as ThanksOrNoThanksPromptData
    if (promptData?.thanks == null) return { status: RequirementStatus.PENDING }
    if (promptData?.thanks === true) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.DISQUALIFYING, reason: 'Not allowed.' }
  }
}

export const id_type_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'id_type_req',
  title: 'DODId or SSN',
  navTitle: 'DODId or SSN',
  description: 'Simulate collecting potential similar data from two different prompt screens',
  promptKeys: ['id_values_prompt', 'id_values_extra_data_prompt'],
  resolve: (data, config) => {
    const promptData1 = data.id_values_prompt as IDValuesPromptData
    const promptData2 = data.id_values_extra_data_prompt as IDValuesExtraDataPromptData
    if (promptData1?.type == null) return { status: RequirementStatus.PENDING }
    if (promptData1?.dodidValue == null && promptData1?.ssnValue == null) return { status: RequirementStatus.PENDING }
    if (promptData1?.dodidValue != null && promptData1?.ssnValue == null) return { status: RequirementStatus.PENDING }
    if (promptData1?.ssnValue == null && promptData2?.allow == null) return { status: RequirementStatus.PENDING }
    if (promptData1?.ssnValue != null && promptData2?.allow === true) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.DISQUALIFYING, reason: 'Not allowed.' }
  }
}
