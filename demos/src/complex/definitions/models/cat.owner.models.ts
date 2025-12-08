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
    count: { type: 'number' },
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
    microchipAgree: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ReviewApplicantCatInfoPromptData = FromSchema<typeof ReviewApplicantCatInfoPromptSchema>

export const AcceptCatPromptSchema = {
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
export type AcceptCatPromptData = FromSchema<typeof AcceptCatPromptSchema>

export const AdoptACatList: AcceptCatPromptData[] = [
  { id: 1, name: 'Doja Cat', age: 30, picUrl: 'https://media.gettyimages.com/id/1486972012/photo/new-york-new-york-doja-cat-attends-the-2023-met-gala-celebrating-karl-lagerfeld-a-line-of.jpg?s=612x612&w=0&k=20&c=nLr8u3jqXmePR7n3xwxn3XPe-DV6xQgR_uleBxLXjWg=' },
  { id: 2, name: 'Miss Puffs a Lot', age: 5, picUrl: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg' },
  { id: 3, name: 'Siam', age: 2, picUrl: 'https://images.pexels.com/photos/208984/pexels-photo-208984.jpeg' },
  { id: 4, name: 'Cat Stevens', age: 77, picUrl: 'https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg' },
  { id: 5, name: 'Garfield', age: 6, picUrl: 'https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg' },
  { id: 6, name: 'Tom', age: 0, picUrl: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg' }
]
