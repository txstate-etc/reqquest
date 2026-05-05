import { SchemaObject } from '@txstate-mws/fastify-shared'
import { FromSchema } from 'json-schema-to-ts'

export const WrittenAutomationSchema = {
  type: 'object',
  properties: {
    hasWrittenAutomation: { type: 'boolean' },
    writtenAutomation: { type: 'string' }

  },
  additionalProperties: false
} as const satisfies SchemaObject
export type WrittenAutomationPromptData = FromSchema<typeof WrittenAutomationSchema>

export const EvidenceAutomationSchema = {
  type: 'object',
  properties: {
    appropriateAutomation: { type: 'boolean' },
    comments: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type EvidenceAutomationPromptData = FromSchema<typeof EvidenceAutomationSchema>

export const InvestigatedFutureCareerSchema = {
  type: 'object',
  properties: {
    interestInCareer: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type InvestigatedFutureCareerPromptData = FromSchema<typeof InvestigatedFutureCareerSchema>

export const RateFutureCareerSchema = {
  type: 'object',
  properties: {
    scoreInterestInCareer: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type RateFutureCareerPromptData = FromSchema<typeof RateFutureCareerSchema>
