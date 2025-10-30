import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const PreviousDogOwnerPromptSchema = {
  type: 'object',
  properties: { 
    owned: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type PreviousDogOwnerPromptData = FromSchema<typeof PreviousDogOwnerPromptSchema>

export const CurrentDogOwnerRequirementConfigSchema = {
  type: 'object',
  properties: { 
    maxCount: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CurrentDogOwnerRequirementConfigData = FromSchema<typeof CurrentDogOwnerRequirementConfigSchema>

export const CurrentDogOwnerPromptSchema = {
  type: 'object',
  properties: { 
    owned: { type: 'boolean' },
    count: { type: 'number'},
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CurrentDogOwnerPromptData = FromSchema<typeof CurrentDogOwnerPromptSchema>

export const OwnerDogAllergyPromptSchema = {
  type: 'object',
  properties: { 
    allergic: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type OwnerDogAllergyPromptData = FromSchema<typeof OwnerDogAllergyPromptSchema>

export const DogMinExerciseRequirementConfigSchema = {
  type: 'object',
  properties: { 
    minExerciseHoursWeekly: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type DogMinExerciseRequirementConfigData = FromSchema<typeof DogMinExerciseRequirementConfigSchema>

export const DogExercisePromptSchema = {
  type: 'object',
  properties: { 
    agreeToExercise: { type: 'boolean'},
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type DogExercisePromptData = FromSchema<typeof DogExercisePromptSchema>

