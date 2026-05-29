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

// Exclusively tests prestage values that can only be gen'd API side, not input from UI side...read only client side
export const YardPromptPreStageSchema = {
  type: 'object',
  properties: {
    haveCityWater: { type: 'boolean' },
  },
  additionalProperties: false // FOR TEST leave false:  Will be overriden automatically to true for additional props as needed for signing
} as const satisfies SchemaObject
export type YardPromptPreStageData = FromSchema<typeof YardPromptPreStageSchema>