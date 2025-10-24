import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const PetOwnerPromptSchema = {
  type: 'object',
  properties: { 
    previousPetOwner: { type: 'boolean'},
    currentPetOwner: { type: 'boolean'},
    previousPetCount: { type: 'number'},
    currentPetCount: { type: 'number'},
    currentPetDetails: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type PetOwnerPromptData = FromSchema<typeof PetOwnerPromptSchema>