import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const LivingSpaceConfigRequirementSchema = {
  type: 'object',
  properties: {
    minSqftPerCat: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type LivingSpaceConfigRequirementData = FromSchema<typeof LivingSpaceConfigRequirementSchema>

export const LivingSpacePromptSchema = {
  type: 'object',
  properties: {
    sqftLivingSpace: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type LivingSpacePromptData = FromSchema<typeof LivingSpacePromptSchema>