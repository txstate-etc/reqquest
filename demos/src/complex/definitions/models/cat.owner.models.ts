import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const PreviousCatOwnerPromptSchema = {
  type: 'object',
  properties: { 
    owned: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type PreviousCatOwnerPromptData = FromSchema<typeof PreviousCatOwnerPromptSchema>

export const CurrentCatOwnerRequirementConfigSchema = {
  type: 'object',
  properties: { 
    maxCount: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CurrentCatOwnerRequirementConfigData = FromSchema<typeof CurrentCatOwnerRequirementConfigSchema>

export const CurrentCatOwnerPromptSchema = {
  type: 'object',
  properties: { 
    owned: { type: 'boolean' },
    count: { type: 'number'},
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CurrentCatOwnerPromptData = FromSchema<typeof CurrentCatOwnerPromptSchema>

export const OwnerCatAllergyPromptSchema = {
  type: 'object',
  properties: { 
    allergic: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type OwnerCatAllergyPromptData = FromSchema<typeof OwnerCatAllergyPromptSchema>

export const OwnerCatMicrochipServicePrompt = {
  type: 'object',
  properties: { 
    agreeToPay: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type OwnerCatMicrochipServiceData = FromSchema<typeof OwnerCatMicrochipServicePrompt>

export const ReviewApplicantCatInfoPromptSchema = {
  type: 'object',
  properties: { 
    previousCatAcceptable: { type: 'boolean' },
    currentCatAcceptable: { type: 'boolean' },
    livingSpaceAcceptable: { type: 'boolean' },
    allergyAcceptable: { type: 'boolean' },
    microchipAgree: { type: 'boolean' },
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ReviewApplicantCatInfoPromptData = FromSchema<typeof ReviewApplicantCatInfoPromptSchema>