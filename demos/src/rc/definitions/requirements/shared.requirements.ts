import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { AssessReccomendationLettersData, OverrideGPAWarningData, ReccomendationLettersData } from '../models'

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

export const assess_reccomendation_letter_req: RequirementDefinition & { key: 'assess_reccomendation_lettern_req' } = {
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

export const reviewer_override_gpa_warning_req: RequirementDefinition = {
  type: RequirementType.WORKFLOW,
  key: 'reviewer_override_gpa_warning_req',
  title: 'Override GPA Warning',
  navTitle: 'Override GPA Warning',
  description: 'Override GPA minimum requirement to not show warning',
  promptKeys: ['reviewer_override_gpa_warning_prompt'],
  resolve: (data, config) => {
    const overrideGpaWarningData = data['reviewer_override_gpa_warning_prompt'] as OverrideGPAWarningData
    if (overrideGpaWarningData?.override == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
