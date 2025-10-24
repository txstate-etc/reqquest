import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const DogOwnerPromptSchema = {
  type: 'object',
  properties: { 
    everOwnedADog: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type DogOwnerPromptData = FromSchema<typeof DogOwnerPromptSchema>