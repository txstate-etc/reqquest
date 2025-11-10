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

export const PetOwnerOwnerRequirementConfigSchema = {
  type: 'object',
  properties: { 
    maxCount: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type PetOwnerOwnerRequirementConfigData = FromSchema<typeof PetOwnerOwnerRequirementConfigSchema>

export const ReviewApplicantFosterAPetPromptSchema = {
  type: 'object',
  properties: { 
    underAgeChildrenAcceptable: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ReviewApplicantFosterAPetPromptData = FromSchema<typeof ReviewApplicantFosterAPetPromptSchema>