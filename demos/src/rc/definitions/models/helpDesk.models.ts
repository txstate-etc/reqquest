import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const HelpDeskWeekendAvailabilitySchema = {
  type: 'object',
  properties: {
    weekendAvailable: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type HelpDeskWeekendAvailabilityData = FromSchema<typeof HelpDeskWeekendAvailabilitySchema>

export const HelpDeskCustomerServiceSchema = {
  type: 'object',
  properties: {
    describeCustomerService: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type HelpDeskCustomerServiceData = FromSchema<typeof HelpDeskCustomerServiceSchema>
