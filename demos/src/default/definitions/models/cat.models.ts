import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const CatTowerPromptSchema = {
  type: 'object',
  properties: {
    haveCatTower: { type: 'boolean' },
    willPurchaseCatTower: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CatTowerPromptData = FromSchema<typeof CatTowerPromptSchema>

export const TunaAllergyPromptSchema = {
  type: 'object',
  properties: {
    allergicToTuna: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type TunaAllergyPromptData = FromSchema<typeof TunaAllergyPromptSchema>

export const NicePromptSchema = {
  type: 'object',
  properties: {
    seemsNice: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type NicePromptData = FromSchema<typeof NicePromptSchema>

export const OtherCatsPromptSchema = {
  type: 'object',
  properties: {
    hasOtherCats: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type OtherCatsPromptData = FromSchema<typeof OtherCatsPromptSchema>

export const UploadInfoWithSumSchema = {
  type: 'object',
  properties: {
    _type: { type: 'string' },
    multipartIndex: { type: 'number' },
    name: { type: 'string' },
    mime: { type: 'string' },
    size: { type: 'number' },
    shasum: { type: 'string' }
  },
  required: ['_type', 'multipartIndex', 'name', 'mime', 'size', 'shasum'],
  additionalProperties: false
} as const satisfies SchemaObject
export type UploadInfoWithSumData = FromSchema<typeof UploadInfoWithSumSchema>

export const VaccinePromptSchema = {
  type: 'object',
  properties: {
    distemperDoc: UploadInfoWithSumSchema,
    rabiesDoc: UploadInfoWithSumSchema,
    felineLeukemiaDoc: UploadInfoWithSumSchema,
    felineHIVDoc: UploadInfoWithSumSchema
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type VaccinePromptData = FromSchema<typeof VaccinePromptSchema>

const VaccineReviewSatisfactorySchema = {
  type: 'object',
  properties: {
    satisfactory: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject

export const VaccineReviewPromptSchema = {
  type: 'object',
  properties: {
    distemper: VaccineReviewSatisfactorySchema,
    rabies: VaccineReviewSatisfactorySchema,
    felineLeukemia: VaccineReviewSatisfactorySchema,
    felineHIV: VaccineReviewSatisfactorySchema
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type VaccineReviewPromptData = FromSchema<typeof VaccineReviewPromptSchema>
