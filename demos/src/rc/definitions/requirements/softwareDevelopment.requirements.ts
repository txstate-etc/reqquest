import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { DataRelatedPuzzlePromptData, AssessPuzzleSolutionPromptData, OutsideClassExamplePromptData, AssessOutsideClassExamplePromptData, CriticalThinkingPromptData, AssessCriticalThinkingPromptData } from '../models'

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
