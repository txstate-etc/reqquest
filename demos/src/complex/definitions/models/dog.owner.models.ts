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

export const PreviousDogSurrenderedPromptSchema = {
  type: 'object',
  properties: {
    surrendered: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type PreviousDogSurrenderedPromptData = FromSchema<typeof PreviousDogSurrenderedPromptSchema>

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
    count: { type: 'number' },
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
    agreeToExercise: { type: 'boolean' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type DogExercisePromptData = FromSchema<typeof DogExercisePromptSchema>

export const ReviewApplicantDogInfoPromptSchema = {
  type: 'object',
  properties: {
    previousDogAcceptable: { type: 'boolean' },
    currentDogAcceptable: { type: 'boolean' },
    yardAcceptable: { type: 'boolean' },
    allergyAcceptable: { type: 'boolean' },
    surrenderedAcceptable: { type: 'boolean' },
    exerciseMinMet: { type: 'boolean' },
    exerciseException: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ReviewApplicantDogInfoPromptData = FromSchema<typeof ReviewApplicantDogInfoPromptSchema>

export const ApproveReviewerExerciseExemptionConfigSchema = {
  type: 'object',
  properties: {
    text: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ApproveReviewerExerciseExemptionConfigData = FromSchema<typeof ApproveReviewerExerciseExemptionConfigSchema>

export const ApproveReviewerExerciseExemptionPromptSchema = {
  type: 'object',
  properties: {
    approve: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ApproveReviewerExerciseExemptionPromptData = FromSchema<typeof ApproveReviewerExerciseExemptionPromptSchema>

export const AcceptDogPromptSchema = {
  type: 'object',
  properties: {
    accept: { type: 'boolean' },
    id: { type: 'number' },
    name: { type: 'string' },
    age: { type: 'number' },
    picUrl: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AcceptDogPromptData = FromSchema<typeof AcceptDogPromptSchema>

export const AdoptADogList: AcceptDogPromptData[] = [
  { id: 101, name: 'Temple of the Dog', age: 55, picUrl: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg' },
  { id: 102, name: 'Ringo', age: 6, picUrl: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg' },
  { id: 103, name: 'Bono', age: 2, picUrl: 'https://images.pexels.com/photos/825947/pexels-photo-825947.jpeg' },
  { id: 104, name: 'Three Dog Night', age: 1, picUrl: 'https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg' },
  { id: 105, name: 'Django', age: 6, picUrl: 'https://images.pexels.com/photos/4681107/pexels-photo-4681107.jpeg' },
  { id: 106, name: 'Kujo', age: 8, picUrl: 'https://images.pexels.com/photos/128817/pexels-photo-128817.jpeg' }
]
