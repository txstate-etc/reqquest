import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const PreviousCatOwnerPromptSchema = {
  type: 'object',
  properties: { 
    owned: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type PreviousCatOwnerPromptData = FromSchema<typeof PreviousCatOwnerPromptSchema>

export const CurrentCatOwnerRequirementConfigSchema = {
  type: 'object',
  properties: { 
    maxCount: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CurrentCatOwnerRequirementConfigData = FromSchema<typeof CurrentCatOwnerRequirementConfigSchema>

export const CurrentCatOwnerPromptSchema = {
  type: 'object',
  properties: { 
    owned: { type: 'boolean' },
    count: { type: 'number'},
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CurrentCatOwnerPromptData = FromSchema<typeof CurrentCatOwnerPromptSchema>