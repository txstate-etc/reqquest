import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const YardPromptSchema = {
  type: 'object',
  properties: {
    haveYard: { type: 'boolean' },
    squareFootage: { type: 'number' },
    totalPets: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type YardPromptData = FromSchema<typeof YardPromptSchema>
