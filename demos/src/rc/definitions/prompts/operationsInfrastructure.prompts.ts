import { PromptDefinition } from '@reqquest/api'
import { EvidenceAutomationPromptData, EvidenceAutomationSchema, InvestigatedFutureCareerPromptData, InvestigatedFutureCareerSchema, RateFutureCareerPromptData, RateFutureCareerSchema, WrittenAutomationPromptData, WrittenAutomationSchema } from '../models/index.js'
import { MutationMessageType } from '@txstate-mws/graphql-server'

export const written_automation_prompt: PromptDefinition<WrittenAutomationPromptData> = {
  key: 'written_automation_prompt',
  title: 'Written automation',
  description: 'Applicants will indicate whether they have written an script to automate a task.',
  schema: WrittenAutomationSchema,
  validate: (data, config) => {
    const messages = []
    if (data.hasWrittenAutomation == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please indicate whether you have written automating task.', arg: 'hasWrittenAutomation' })
    } else if (!data.hasWrittenAutomation) {
      messages.push({ type: MutationMessageType.warning, message: 'You sure about that?', arg: 'hasWrittenAutomation' })
    }
    return messages
  }
}

export const evidence_automation_prompt: PromptDefinition<EvidenceAutomationPromptData> = {
  key: 'evidence_automation_prompt',
  title: 'Evidence written automation',
  description: 'Have the applicants selected an appropriate task for automation.',
  schema: EvidenceAutomationSchema,
  validate: (data, config) => {
    const messages = []
    if (data.appropriateAutomation == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please indicate whether applicant has selected an appropriate task fro automation.', arg: 'appropriateAutomation' })
    }
    return messages
  }
}

export const investigated_future_career_prompt: PromptDefinition<InvestigatedFutureCareerPromptData> = {
  key: 'investigated_future_career_prompt',
  title: 'Future career',
  description: 'Applicants will indicate whether they have investigated future career path.',
  schema: InvestigatedFutureCareerSchema,
  validate: (data, config) => {
    const messages = []
    if (data.interestInCareer == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please what interests you about operations as a career.', arg: 'hasWrittenAutomation' })
    }
    return messages
  }
}
export const rate_future_career_prompt: PromptDefinition<RateFutureCareerPromptData> = {
  key: 'rate_future_career_prompt',
  title: 'Rate future career',
  description: 'Score the applicants response',
  schema: RateFutureCareerSchema,
  validate: (data, config) => {
    const messages = []
    if (data.scoreInterestInCareer == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please score the applicants response.', arg: 'appropriateAutomation' })
    }
    return messages
  }
}
