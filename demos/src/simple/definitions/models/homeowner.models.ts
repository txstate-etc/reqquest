import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const HomeOwnerRequirementSchema = {
  type: 'object',
  properties: {
    homeowner: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type HomeOwnerRequirementData = FromSchema<typeof HomeOwnerRequirementSchema>