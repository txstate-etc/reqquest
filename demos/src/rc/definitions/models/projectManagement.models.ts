import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const OrganizationSchema = {
  type: 'object',
  properties: {
    describeOrganization: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type OrganizationData = FromSchema<typeof OrganizationSchema>

export const AssessOrganizationSchema = {
  type: 'object',
  properties: {
    demonstrateOrganization: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessOrganizationData = FromSchema<typeof AssessOrganizationSchema>

export const CommunicationSchema = {
  type: 'object',
  properties: {
    describeCommunication: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type CommunicationData = FromSchema<typeof CommunicationSchema>

export const AssessCommunicationSchema = {
  type: 'object',
  properties: {
    demonstrateCommunication: { type: 'boolean' },
    comments: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessCommunicationData = FromSchema<typeof AssessCommunicationSchema>

export const AttentionDetailSchema = {
  type: 'object',
  properties: {
    describeAttentionDetail: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AttentionDetailData = FromSchema<typeof AttentionDetailSchema>

export const AssessAttentionDetailSchema = {
  type: 'object',
  properties: {
    demonstrateAttentionDetail: { type: 'boolean' },
    grammarErrors: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessAttentionDetailData = FromSchema<typeof AssessAttentionDetailSchema>
