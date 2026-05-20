import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const OptOutSchema = {
  type: 'object',
  properties: {
    optOut: { type: 'boolean' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type OptOutData = FromSchema<typeof OptOutSchema>
