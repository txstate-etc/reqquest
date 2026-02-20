import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const allowedIdOptions = ['dodid', 'ssn', null] as const
export const allowedIdOptionsSchema = { type: 'string', enum: allowedIdOptions } as const satisfies SchemaObject

export const Step1PostResidencePromptSchema = {
  type: 'object',
  properties: {
    allow: { type: 'boolean' }
  },
  required: [],
  additionalProperties: false
} as const satisfies SchemaObject
export type Step1PostResidencePromptData = FromSchema<typeof Step1PostResidencePromptSchema>

export const Step2PostResidencePromptSchema = {
  type: 'object',
  properties: {
    allow: { type: 'boolean' }
  },
  required: [],
  additionalProperties: false
} as const satisfies SchemaObject
export type Step2PostResidencePromptData = FromSchema<typeof Step2PostResidencePromptSchema>

export const Step3PostResidencePromptSchema = {
  type: 'object',
  properties: {
    allow: { type: 'boolean' }
  },
  required: [],
  additionalProperties: false
} as const satisfies SchemaObject
export type Step3PostResidencePromptData = FromSchema<typeof Step3PostResidencePromptSchema>

export const ThanksOrNoThanksPromptSchema = {
  type: 'object',
  properties: {
    thanks: { type: 'boolean' }
  },
  required: [],
  additionalProperties: false
} as const satisfies SchemaObject
export type ThanksOrNoThanksPromptData = FromSchema<typeof ThanksOrNoThanksPromptSchema>

export const IDValuesPromptSchema = {
  type: 'object',
  properties: {
    type: allowedIdOptionsSchema,
    dodidValue: { type: 'string' },
    ssnValue: { type: 'string' }
  },
  required: [],
  additionalProperties: false
} as const satisfies SchemaObject
export type IDValuesPromptData = FromSchema<typeof IDValuesPromptSchema>

export const IDValuesExtraDataPromptSchema = {
  type: 'object',
  properties: {
    allow: { type: 'boolean' }
  },
  required: [],
  additionalProperties: false
} as const satisfies SchemaObject
export type IDValuesExtraDataPromptData = FromSchema<typeof IDValuesExtraDataPromptSchema>
