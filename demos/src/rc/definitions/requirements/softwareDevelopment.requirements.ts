import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { DataRelatedPuzzlePromptData, AssessPuzzleSolutionPromptData, OutsideClassExamplePromptData, AssessOutsideClassExamplePromptData, CriticalThinkingPromptData, AssessCriticalThinkingPromptData, AuditSoftwareSubmittedPromptData, AuditSoftwareRegularPromptData, ReviewSoftwarSecondEyesPromptData } from '../models'
import { OptOutData } from '../models/optOut.models'

export const software_dev_opt_out_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'software_dev_opt_out_req',
  title: 'Opt Out',
  navTitle: 'Opt Out',
  description: 'Opt Out',
  promptKeys: ['software_dev_opt_out_prompt'],
  resolve: (data, config) => {
    const promptData = data['software_dev_opt_out_prompt'] as OptOutData
    if (promptData?.optOut) return { status: RequirementStatus.DISQUALIFYING, response: 'Applicant opted out of the program' }
    return { status: RequirementStatus.NOT_APPLICABLE }
  }
}

export const data_related_puzzle_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'data_related_puzzle_req',
  title: 'Data related puzzle',
  navTitle: 'Data related puzzle',
  description: 'Data related puzzle',
  promptKeys: ['data_related_puzzle_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['data_related_puzzle_prompt'] as DataRelatedPuzzlePromptData
    if (writtenAutomationData?.puzzleAnswer == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const assess_data_related_puzzle_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_data_related_puzzle_req',
  title: 'Assess data related puzzle',
  navTitle: 'Assess data related puzzle',
  description: 'Assess data related puzzle',
  promptKeys: ['assess_data_related_puzzle_prompt'],
  resolve: (data, config) => {
    const niceData = data['assess_data_related_puzzle_prompt'] as AssessPuzzleSolutionPromptData
    if (niceData?.score == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const outside_class_example_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'outside_class_example_req',
  title: 'Outside class example',
  navTitle: 'Outside class example',
  description: 'Outside class example',
  promptKeys: ['outside_class_example_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['outside_class_example_prompt'] as OutsideClassExamplePromptData
    if (writtenAutomationData?.outsideClassExample == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const assess_outside_class_example_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_outside_class_example_req',
  title: 'Outside class example',
  navTitle: 'Outside class example',
  description: 'Outside class example',
  promptKeys: ['assess_outside_class_example_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['assess_outside_class_example_prompt'] as AssessOutsideClassExamplePromptData
    if (writtenAutomationData?.explanation == null) return { status: RequirementStatus.PENDING }
    if (writtenAutomationData?.showCriticalThinking == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const critical_thinking_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'critical_thinking_req',
  title: 'Critical Thinking',
  navTitle: 'Critical Thinking',
  description: 'Critical Thinking',
  promptKeys: ['critical_thinking_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['critical_thinking_prompt'] as CriticalThinkingPromptData
    if (writtenAutomationData?.criticalThinkingAnswer == null) return { status: RequirementStatus.PENDING }
    if (writtenAutomationData?.criticalThinkingAnswer == 'NA') return { status: RequirementStatus.DISQUALIFYING, reason: 'NA for critical thinking answer is disqualifying' }
    return { status: RequirementStatus.MET }
  }
}

export const assess_critical_thinking_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_critical_thinking_req',
  title: 'Critical Thinking',
  navTitle: 'Critical Thinking',
  description: 'Critical Thinking',
  promptKeys: ['assess_critical_thinking_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['assess_critical_thinking_prompt'] as AssessCriticalThinkingPromptData
    if (writtenAutomationData?.feasable == null) return { status: RequirementStatus.PENDING }
    if (writtenAutomationData?.realIssue == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const audit_software_development_non_blocking_show_submitted_req: RequirementDefinition = {
  type: RequirementType.WORKFLOW,
  key: 'audit_software_development_non_blocking_show_submitted_req',
  title: 'Audit during review',
  navTitle: 'Audit during review',
  description: 'Audit during review',
  promptKeys: ['audit_software_development_non_blocking_show_submitted_prompt'],
  resolve: (data, config) => {
    const audit = data['audit_software_development_non_blocking_show_submitted_prompt'] as AuditSoftwareSubmittedPromptData
    if (audit?.ok == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const audit_software_development_non_blocking_show_submitted_req2: RequirementDefinition = {
  type: RequirementType.WORKFLOW,
  key: 'audit_software_development_non_blocking_show_submitted_req2',
  title: 'Second audit during review ',
  navTitle: 'Second audit during review',
  description: 'Second audit during review',
  promptKeys: ['audit_software_development_non_blocking_show_submitted_prompt2'],
  resolve: (data, config) => {
    const audit = data['audit_software_development_non_blocking_show_submitted_prompt2'] as AuditSoftwareSubmittedPromptData
    if (audit?.ok == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const audit_software_development_non_blocking_show_regular_req: RequirementDefinition = {
  type: RequirementType.WORKFLOW,
  key: 'audit_software_development_non_blocking_show_regular_req',
  title: 'Audit regular`',
  navTitle: 'Audit regular',
  description: 'Audit regular',
  promptKeys: ['audit_software_development_non_blocking_show_regular_prompt'],
  resolve: (data, config) => {
    const audit = data['audit_software_development_non_blocking_show_regular_prompt'] as AuditSoftwareRegularPromptData
    if (audit?.ok == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const reviewer_software_development_second_eyes_req: RequirementDefinition = {
  type: RequirementType.WORKFLOW,
  key: 'reviewer_software_development_second_eyes_req',
  title: 'Second reviewer score`',
  navTitle: 'Second reviewer score',
  description: 'Second reviewer score',
  promptKeys: ['reviewer_software_development_second_eyes_prompt'],
  resolve: (data, config) => {
    const secondEyes = data['reviewer_software_development_second_eyes_prompt'] as ReviewSoftwarSecondEyesPromptData
    if (secondEyes?.score == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
