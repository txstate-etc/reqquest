import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { AssessReccomendationLettersData, ReccomendationLettersData } from '../models'

export const reccomendation_letter_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'reccomendation_letter_req',
  title: 'Technical Troubleshooting',
  navTitle: 'Technical Troubleshooting',
  description: 'Technical Troubleshooting',
  promptKeys: ['reccomendation_letter_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['reccomendation_letter_prompt'] as ReccomendationLettersData
    if (writtenAutomationData?.reccomendationLetter == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const assess_reccomendation_letter_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_reccomendation_lettern_req',
  title: 'Assess Technical Troubleshooting',
  navTitle: 'Assess Technical Troubleshooting',
  description: 'Assess Technical Troubleshooting ',
  promptKeys: ['assess_reccomendation_letter_prompt'],
  resolve: (data, config) => {
    const niceData = data['assess_reccomendation_letter_prompt'] as AssessReccomendationLettersData
    if (niceData?.score == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
