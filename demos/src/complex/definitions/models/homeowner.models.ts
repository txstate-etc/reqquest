import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'
import { stateNames } from './residence.models.js'

export const HomeownerPromptSchema = {
  type: 'object',
  properties: { 
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    streetAddress: { type: 'string' },
    emailAddress: { type: 'string' },
    phoneNumber: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string', enum: stateNames},
    zipCode: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type HomeownerPromptData = FromSchema<typeof HomeownerPromptSchema>