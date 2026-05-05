import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { WrittenAutomationPromptData, EvidenceAutomationPromptData, RateFutureCareerPromptData, InvestigatedFutureCareerPromptData } from '../models'

export const written_automation_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'written_automation_req',
  title: 'Written Automation',
  navTitle: 'Written Automation',
  description: 'Written Automation',
  promptKeys: ['written_automation_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['written_automation_prompt'] as WrittenAutomationPromptData
    if (writtenAutomationData?.hasWrittenAutomation == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const evidence_automation_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'evidence_automation_req',
  title: 'Assess Automation',
  navTitle: 'Assess Automation',
  description: 'Assess Automation ',
  promptKeys: ['evidence_automation_prompt'],
  resolve: (data, config) => {
    const niceData = data['evidence_automation_prompt'] as EvidenceAutomationPromptData
    if (niceData?.appropriateAutomation == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const investigated_future_career_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'investigated_future_career_req',
  title: 'Investigated Career',
  navTitle: 'Investigated Career',
  description: 'Has shown interests in operations career',
  promptKeys: ['investigated_future_career_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['investigated_future_career_prompt'] as InvestigatedFutureCareerPromptData
    if (writtenAutomationData?.interestInCareer == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const rate_future_career_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'rate_future_career_req',
  title: 'Rate future career response',
  navTitle: 'Rate future career',
  description: 'Rate future career response',
  promptKeys: ['rate_future_career_prompt'],
  resolve: (data, config) => {
    const niceData = data['rate_future_career_prompt'] as RateFutureCareerPromptData
    if (niceData?.scoreInterestInCareer == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
