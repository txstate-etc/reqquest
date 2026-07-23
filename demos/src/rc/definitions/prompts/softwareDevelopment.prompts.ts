import { PromptDefinition } from '@reqquest/api'
import { MutationMessageType } from '@txstate-mws/graphql-server'
import { AssessCriticalThinkingPromptData, AssessCriticalThinkingSchema, AssessOutsideClassExamplePromptData, AssessOutsideClassExampleSchema, AssessPuzzleSolutionPromptData, AssessPuzzleSolutionSchema, AuditSoftwareRegularPromptData, AuditSoftwareRegularPromptSchema, AuditSoftwareSubmittedPromptData, AuditSoftwareSubmittedPromptSchema, CriticalThinkingPromptData, CriticalThinkingSchema, DataRelatedPuzzlePromptData, DataRelatedPuzzleSchema, OutsideClassExamplePromptData, OutsideClassExampleSchema, ReviewSoftwarSecondEyesPromptData, ReviewSoftwarSecondEyesPromptSchema } from '../models/index.js'
import { fileHandler } from 'fastify-txstate'
import { OptOutData, OptOutSchema } from '../models/optOut.models.js'

export const software_dev_opt_out_prompt: PromptDefinition<OptOutData> = {
  key: 'software_dev_opt_out_prompt',
  title: 'Software development',
  description: 'Opt Out',
  schema: OptOutSchema,
  optOut: true,
  validate: (data, config) => {
    return []
  }
}

export const data_related_puzzle_prompt: PromptDefinition<DataRelatedPuzzlePromptData> = {
  key: 'data_related_puzzle_prompt',
  title: 'Data related puzzle',
  description: 'Data related puzzle',
  schema: DataRelatedPuzzleSchema,
  preProcessData: async (data, ctx, appRequest, appRequestData, config, db, validateOnly) => {
    if (validateOnly) return data
    if (data.additionalDocumentation) {
      for await (const file of ctx.files()) {
        const { checksum, size } = await fileHandler.put(file.stream)
        data.additionalDocumentation.shasum = checksum
        break // easy out for single file upload
      }
    }
    return data
  },
  validate: (data, config) => {
    const messages = []
    if (data.puzzleAnswer == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please complete the puzzle.', arg: 'puzzleAnswer' })
    }
    return messages
  }
}

export const assess_data_related_puzzle_prompt: PromptDefinition<AssessPuzzleSolutionPromptData> = {
  key: 'assess_data_related_puzzle_prompt',
  title: 'Assess puzzle solution',
  description: 'Assess puzzle solution',
  schema: AssessPuzzleSolutionSchema,
  validate: (data, config) => {
    const messages = []
    if (data.score == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please score puzzle solution', arg: 'score' })
    }
    return messages
  }
}

export const outside_class_example_prompt: PromptDefinition<OutsideClassExamplePromptData> = {
  key: 'outside_class_example_prompt',
  title: 'Outside Class Example',
  description: 'Outside Class Example',
  schema: OutsideClassExampleSchema,
  validate: (data, config) => {
    const messages = []
    if (!data.outsideClassExample) {
      messages.push({ type: MutationMessageType.warning, message: 'Might want to make something up', arg: 'outsideClassExample' })
    }
    if (data.description && data.description == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please add description.', arg: 'description' })
    }
    return messages
  }
}
export const assess_outside_class_example_prompt: PromptDefinition<AssessOutsideClassExamplePromptData> = {
  key: 'assess_outside_class_example_prompt',
  title: 'Assess Outside Class Example',
  description: 'Assess Outside Class Example',
  schema: AssessOutsideClassExampleSchema,
  validate: (data, config) => {
    const messages = []
    if (data.showCriticalThinking == null) messages.push({ type: MutationMessageType.error, message: 'Please indicate if the applicant shows interest in building or creating technical solutions.', arg: 'showCriticalThinking' })
    if (data.explanation == null) messages.push({ type: MutationMessageType.error, message: 'Please provide an explanation for your assessment.', arg: 'explanation' })
    return messages
  }
}

export const critical_thinking_prompt: PromptDefinition<CriticalThinkingPromptData> = {
  key: 'critical_thinking_prompt',
  title: 'Critical Thinking',
  description: 'Critical Thinking',
  schema: CriticalThinkingSchema,
  validate: (data, config) => {
    const messages = []
    if (data.criticalThinkingAnswer == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please add answer', arg: 'criticalThinkingAnswer' })
    }
    return messages
  }
}
export const assess_critical_thinking_prompt: PromptDefinition<AssessCriticalThinkingPromptData> = {
  key: 'assess_critical_thinking_prompt',
  title: 'Assess Critical Thinking',
  description: 'Assess Critical Thinking',
  schema: AssessCriticalThinkingSchema,
  validate: (data, config) => {
    const messages = []
    if (data.feasable == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please answer the question.', arg: 'feasable' })
    }
    if (data.realIssue == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please answer the question.', arg: 'realIssue' })
    }
    return messages
  }
}

export const audit_software_development_non_blocking_show_submitted_prompt: PromptDefinition<AuditSoftwareSubmittedPromptData> = {
  key: 'audit_software_development_non_blocking_show_submitted_prompt',
  title: 'Audit during review',
  description: 'Audit during review',
  schema: AuditSoftwareSubmittedPromptSchema,
  validate: (data, config) => {
    const messages = []
    if (data.ok == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please answer if review was performed appropriately during review.', arg: 'ok' })
    }
    return messages
  }
}

export const audit_software_development_non_blocking_show_submitted_prompt2: PromptDefinition<AuditSoftwareSubmittedPromptData> = {
  key: 'audit_software_development_non_blocking_show_submitted_prompt2',
  title: 'Second audit during review',
  description: 'Second audit during review',
  schema: AuditSoftwareSubmittedPromptSchema,
  validate: (data, config) => {
    const messages = []
    if (data.ok == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please confirm your previous answer if review was performed appropriately during review.', arg: 'ok' })
    }
    return messages
  }
}

export const audit_software_development_non_blocking_show_regular_prompt: PromptDefinition<AuditSoftwareRegularPromptData> = {
  key: 'audit_software_development_non_blocking_show_regular_prompt',
  title: 'Audit regular',
  description: 'Audit regular',
  schema: AuditSoftwareRegularPromptSchema,
  validate: (data, config) => {
    const messages = []
    if (data.ok == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please answer if review was performed appropriately.', arg: 'ok' })
    }
    return messages
  }
}

export const reviewer_software_development_second_eyes_prompt: PromptDefinition<ReviewSoftwarSecondEyesPromptData> = {
  key: 'reviewer_software_development_second_eyes_prompt',
  title: 'Second review score',
  description: 'Second review score',
  schema: ReviewSoftwarSecondEyesPromptSchema,
  validate: (data, config) => {
    const messages = []
    if (data.score == null || data.score > 100 || data.score < 0) {
      messages.push({ type: MutationMessageType.error, message: 'Please provide an overall score from 0 to 100.', arg: 'score' })
    }
    return messages
  }
}
