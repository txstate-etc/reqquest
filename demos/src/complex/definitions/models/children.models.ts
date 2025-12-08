import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const ChildrenPromptSchema = {
  type: 'object',
  properties: {
    underMinAge: { type: 'boolean' },
    count: { type: 'number' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ChildrenPromptData = FromSchema<typeof ChildrenPromptSchema>

export const ChildrenRequirementConfigSchema = {
  type: 'object',
  properties: {
    minAge: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ChildrenRequirementConfigData = FromSchema<typeof ChildrenRequirementConfigSchema>
