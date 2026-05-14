import { PromptDefinition } from '@reqquest/api'
import { MutationMessageType } from '@txstate-mws/graphql-server'
import { AssessCriticalThinkingPromptData, AssessCriticalThinkingSchema, AssessOutsideClassExamplePromptData, AssessOutsideClassExampleSchema, AssessPuzzleSolutionPromptData, AssessPuzzleSolutionSchema, CriticalThinkingPromptData, CriticalThinkingSchema, DataRelatedPuzzlePromptData, DataRelatedPuzzleSchema, OutsideClassExamplePromptData, OutsideClassExampleSchema } from '../models/index.js'
import { fileHandler } from 'fastify-txstate'

export const data_related_puzzle_prompt: PromptDefinition<DataRelatedPuzzlePromptData> = {
  key: 'data_related_puzzle_prompt',
  title: 'Data related puzzle',
  description: 'Data related puzzle',
  schema: DataRelatedPuzzleSchema,
  preProcessData: async (data, ctx) => {
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
    console.log(data)
    console.log(!data.outsideClassExample)
    if (!data.outsideClassExample) {
      messages.push({ type: MutationMessageType.warning, message: 'Might want to make something up', arg: 'outsideClassExample' })
    }
    if (data.description && data.description == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please add description.', arg: 'description' })
    }
    console.log(messages)
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
