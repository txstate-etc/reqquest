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

export const AcceptCatDetailsTagsPromptSchema = {
  type: 'object',
  properties: {
    label: { type: 'string' },
    type: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AcceptCatDetailsTagsPromptData = FromSchema<typeof AcceptCatDetailsTagsPromptSchema>

export const AcceptCatDetailsPromptSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    age: { type: 'number' },
    tags: { type: 'array', items: AcceptCatDetailsTagsPromptSchema },
    picUrl: { type: 'string' },
    description: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AcceptCatDetailsPromptData = FromSchema<typeof AcceptCatDetailsPromptSchema>

export const AcceptCatPromptSchema = {
  type: 'object',
  properties: {
    accept: { type: 'boolean' },
    id: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AcceptCatPromptData = FromSchema<typeof AcceptCatPromptSchema>

export const ConfirmCatMicrochipServicePromptSchema = {
  type: 'object',
  properties: {
    date: { type: 'string', format: 'date-time' },
    details: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ConfirmCatMicrochipServicePromptData = FromSchema<typeof ConfirmCatMicrochipServicePromptSchema>

export const AdoptACatList: AcceptCatDetailsPromptData[] = [
  { id: 1, name: 'Doja Cat', age: 30, tags: [{ label: 'moody', type: 'purple' }], description: 'Loves to listen to hip-hop', picUrl: 'https://media.gettyimages.com/id/1486972012/photo/new-york-new-york-doja-cat-attends-the-2023-met-gala-celebrating-karl-lagerfeld-a-line-of.jpg?s=612x612&w=0&k=20&c=nLr8u3jqXmePR7n3xwxn3XPe-DV6xQgR_uleBxLXjWg=' },
  { id: 2, name: 'Miss Puffs a Lot', tags: [{ label: 'reserved', type: 'green' }, { label: 'loyal', type: 'blue' }], description: 'Takes a while to get to trust you, but once she does :)', age: 5, picUrl: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg' },
  { id: 3, name: 'Siam', age: 2, tags: [{ label: 'stoic', type: 'red' }, { label: 'companion', type: 'blue' }], description: 'A short-furred calico cat with white paws, chest, and belly with heterochromatic yellow and green eyes', picUrl: 'https://images.pexels.com/photos/208984/pexels-photo-208984.jpeg' },
  { id: 4, name: 'Cat Stevens', age: 77, tags: [{ label: 'old', type: 'warm-gray' }], description: 'A medium-furred fawn tortoiseshell mackerel tabby tom with heterochromatic yellow and green eyes; and is mute, with a curly tail', picUrl: 'https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg' },
  { id: 5, name: 'Garfield', age: 6, tags: [{ label: 'child safe', type: 'orange' }, { label: 'foodie', type: 'yellow' }], description: 'A short-furred cinnamon calico broken mackerel tabby she-cat with white tipped tail with blue and green eyes', picUrl: 'https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg' },
  { id: 6, name: 'Tom', age: 0, tags: [{ label: 'tv lover', type: 'teal' }, { label: 'mouser', type: 'magenta' }], description: 'a long-furred shaded silver red cat with white patches with dichroic golden and green eyes; and is blind, with large ears', picUrl: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg' }
]
