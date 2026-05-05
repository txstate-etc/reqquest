import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const TechincalTroubleshootingSchema = {
  type: 'object',
  properties: {
    describeTechincalTroubleshooting: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type TechincalTroubleshootingData = FromSchema<typeof TechincalTroubleshootingSchema>

export const AssessTechincalTroubleshootingSchema = {
  type: 'object',
  properties: {
    demonstrateTechincalTroubleshooting: { type: 'boolean' },
    complexity: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessTechincalTroubleshootingData = FromSchema<typeof AssessTechincalTroubleshootingSchema>

export const SupportCommunicationSchema = {
  type: 'object',
  properties: {
    describeSupportCommunication: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type SupportCommunicationData = FromSchema<typeof SupportCommunicationSchema>

export const AssessSupportCommunicationSchema = {
  type: 'object',
  properties: {
    clarity: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessSupportCommunicationData = FromSchema<typeof AssessSupportCommunicationSchema>

export const MaintainSysDocumentationSchema = {
  type: 'object',
  properties: {
    maintainSysDocumentation: { type: 'boolean' },
    documentation: { type: 'object' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type MaintainSysDocumentationData = FromSchema<typeof MaintainSysDocumentationSchema>

export const AssessMaintainSysDocumentationSchema = {
  type: 'object',
  properties: {
    clarity: { type: 'boolean' },
    comments: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type AssessMaintainSysDocumentationData = FromSchema<typeof AssessMaintainSysDocumentationSchema>
