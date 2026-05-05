import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const ReccomendationLettersSchema = {
  type: 'object',
  properties: {
    reccomendationLetter: { type: 'object' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ReccomendationLettersData = FromSchema<typeof ReccomendationLettersSchema>

export const AssessReccomendationLettersSchema = {
  type: 'object',
  properties: {
    score: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessReccomendationLettersData = FromSchema<typeof AssessReccomendationLettersSchema>
