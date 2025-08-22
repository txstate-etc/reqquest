import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'

export const ExerciseConfigRequirementSchema = {
  type: 'object',
  properties: {
    minExerciseHours: { type: 'number' }
  },
  required: ['minExerciseHours'],
  additionalProperties: false
} as const satisfies SchemaObject
export type ExerciseConfigRequirementData = FromSchema<typeof ExerciseConfigRequirementSchema>

export const ExercisePromptSchema = {
  type: 'object',
  properties: {
    exerciseHours: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ExercisePromptData = FromSchema<typeof ExercisePromptSchema>
