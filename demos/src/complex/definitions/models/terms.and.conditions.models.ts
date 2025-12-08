import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const TermsAndConditionsPromptSchema = {
  type: 'object',
  properties: {
    agree: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type TermsAndConditionsPromptData = FromSchema<typeof TermsAndConditionsPromptSchema>

export const TermsAndConditionsConfigPromptSchema = {
  type: 'object',
  properties: {
    text: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type TermsAndConditionsConfigPromptData = FromSchema<typeof TermsAndConditionsConfigPromptSchema>
