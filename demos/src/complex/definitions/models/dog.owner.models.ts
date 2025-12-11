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

export const AcceptDogDetailsTagsPromptSchema = {
  type: 'object',
  properties: {
    label: { type: 'string' },
    type: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AcceptDogDetailsTagsPromptData = FromSchema<typeof AcceptDogDetailsTagsPromptSchema>

export const AcceptDogDetailsPromptSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    age: { type: 'number' },
    tags: { type: 'array', items: AcceptDogDetailsTagsPromptSchema },
    picUrl: { type: 'string' },
    description: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AcceptDogDetailsPromptData = FromSchema<typeof AcceptDogDetailsPromptSchema>

export const AcceptDogPromptSchema = {
  type: 'object',
  properties: {
    accept: { type: 'boolean' },
    id: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AcceptDogPromptData = FromSchema<typeof AcceptDogPromptSchema>

export const AdoptADogList: AcceptDogDetailsPromptData[] = [
  { id: 101, name: 'Temple of the Dog', age: 55, tags: [{ label: 'deep thinker', type: 'purple' }], description: 'Loves 90s Seattle grunge music', picUrl: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg' },
  { id: 102, name: 'Ringo', age: 6, tags: [{ label: 'quiet', type: 'green' }, { label: 'trusting', type: 'blue' }], description: 'A tri colour, tan cattle dog, with warm hetrochromatic eyes. ', picUrl: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg' },
  { id: 103, name: 'Bono', age: 2, tags: [{ label: 'flashy', type: 'red' }, { label: 'likes outfits', type: 'blue' }], description: 'A bi colour, silver golden retreiver, with warm yellow eyes. ', picUrl: 'https://images.pexels.com/photos/825947/pexels-photo-825947.jpeg' },
  { id: 104, name: 'Three Dog Night', age: 1, tags: [{ label: 'energetic', type: 'orange' }], description: 'A tri colour, black koolie, with dull brown eyes.', picUrl: 'https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg' },
  { id: 105, name: 'Django', age: 6, tags: [{ label: 'dangerous', type: 'red' }, { label: 'protective', type: 'yellow' }], description: 'A bi colour, silver german shepherd, with emotionless green eyes.', picUrl: 'https://images.pexels.com/photos/4681107/pexels-photo-4681107.jpeg' },
  { id: 106, name: 'Kujo', age: 8, tags: [{ label: 'runner', type: 'teal' }], description: 'A spotted, blue koolie, with wild yellow eyes', picUrl: 'https://images.pexels.com/photos/128817/pexels-photo-128817.jpeg' }
]
