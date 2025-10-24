import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const YardConfigRequirementSchema = {
  type: 'object',
  properties: {
    minSqftPerDog: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type YardConfigRequirementData = FromSchema<typeof YardConfigRequirementSchema>

export const YardPromptSchema = {
  type: 'object',
  properties: {
    sqftYardSize: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type YardPromptData = FromSchema<typeof YardPromptSchema>