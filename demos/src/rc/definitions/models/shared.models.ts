import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const UploadInfoWithSumSchema = {
  type: 'object',
  properties: {
    _type: { type: 'string' },
    multipartIndex: { type: 'number' },
    name: { type: 'string' },
    mime: { type: 'string' },
    size: { type: 'number' },
    shasum: { type: 'string' }
  },
  required: ['_type', 'multipartIndex', 'name', 'mime', 'size'],
  additionalProperties: false
} as const satisfies SchemaObject
export type UploadInfoWithSumData = FromSchema<typeof UploadInfoWithSumSchema>

export const ReccomendationLettersSchema = {
  type: 'object',
  properties: {
    reccomendationLetter: UploadInfoWithSumSchema
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
