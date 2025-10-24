import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const PreviousDogOwnerPromptSchema = {
  type: 'object',
  properties: { 
    owned: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type PreviousDogOwnerPromptData = FromSchema<typeof PreviousDogOwnerPromptSchema>