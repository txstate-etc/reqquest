import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const BridgeOfDeathPromptSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    quest: { type: 'string' },
    favoriteColor: { type: 'string' },
    capitalOfAssyria: { type: 'string' },
    airSpeedOfUnladenSwallow: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type BridgeOfDeathPromptData = FromSchema<typeof BridgeOfDeathPromptSchema>

export const ReviewMovieLoverAnswersPromptSchema = {
  type: 'object',
  properties: {
    impressed: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ReviewMovieLoverAnswersPromptData = FromSchema<typeof ReviewMovieLoverAnswersPromptSchema>
