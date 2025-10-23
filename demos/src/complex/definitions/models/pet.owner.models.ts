import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const PreviousPetsSchema = {
	type: 'object',
			properties: { 
				owned: { type: 'boolean' },
				count: { type: 'number' }
	},
	additionalProperties: false
} as const satisfies SchemaObject

export const CurrentPetsSchema = {
	type: 'object',
			properties: { 
				owned: { type: 'boolean' },
				count: { type: 'number' },
				details: { type: 'string' }
	},
	additionalProperties: false
} as const satisfies SchemaObject

export const PetOwnerPromptSchema = {
  type: 'object',
  properties: { 
    // previousPetOwnnership: PreviousPetsSchema,
    // currentPetOwnership: CurrentPetsSchema
    previousPetOwner: { type: 'boolean'},
    currentPetOwner: { type: 'boolean'},
    previousPetCount: { type: 'number'},
    currentPetCount: { type: 'number'},
    currentPetDetails: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type PetOwnerPromptData = FromSchema<typeof PetOwnerPromptSchema>