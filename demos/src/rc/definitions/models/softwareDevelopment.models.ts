import { SchemaObject } from '@txstate-mws/fastify-shared'
import { FromSchema } from 'json-schema-to-ts'

export const DataRelatedPuzzleSchema = {
  type: 'object',
  properties: {
    puzzleAnswer: { type: 'string' },
    additionalDocumentation: { type: 'object' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type DataRelatedPuzzlePromptData = FromSchema<typeof DataRelatedPuzzleSchema>

export const AssessPuzzleSolutionSchema = {
  type: 'object',
  properties: {
    score: { type: 'string' },
    explanation: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessPuzzleSolutionPromptData = FromSchema<typeof AssessPuzzleSolutionSchema>

export const OutsideClassExampleSchema = {
  type: 'object',
  properties: {
    outsideClassExample: { type: 'boolean' },
    description: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type OutsideClassExamplePromptData = FromSchema<typeof OutsideClassExampleSchema>

export const AssessOutsideClassExampleSchema = {
  type: 'object',
  properties: {
    showCriticalThinking: { type: 'boolean' },
    explanation: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessOutsideClassExamplePromptData = FromSchema<typeof AssessOutsideClassExampleSchema>

export const CriticalThinkingSchema = {
  type: 'object',
  properties: {
    criticalThinkingAnswer: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CriticalThinkingPromptData = FromSchema<typeof CriticalThinkingSchema>

export const AssessCriticalThinkingSchema = {
  type: 'object',
  properties: {
    realIssue: { type: 'boolean' },
    feasable: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessCriticalThinkingPromptData = FromSchema<typeof AssessCriticalThinkingSchema>
