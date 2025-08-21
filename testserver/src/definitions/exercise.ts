import { MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { SchemaObject } from '@txstate-mws/fastify-shared'
import { PromptDefinition, RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import type { FromSchema } from 'json-schema-to-ts'

export interface ExerciseConfig {
  minExerciseHours: number
}

export const must_exercise_your_dog_req: RequirementDefinition<ExerciseConfig> = {
  type: RequirementType.QUALIFICATION,
  key: 'must_exercise_your_dog_req',
  title: 'Agreement to Exercise the Dog',
  navTitle: 'Exercise Per Week',
  description: 'The applicant must exercise their dog a certain number of hours a week.',
  promptKeys: ['must_exercise_your_dog_prompt'],
  resolve: (data, config) => {
    const exerciseData = data.must_exercise_your_dog_prompt as ExerciseData
    if (exerciseData?.exerciseHours == null) return { status: RequirementStatus.PENDING }
    if (exerciseData.exerciseHours >= config.minExerciseHours) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.WARNING, reason: `You must exercise your dog ${config.minExerciseHours} hours a week.` }
  },
  validateConfiguration: config => {
    const messages: MutationMessage[] = []
    if (config.minExerciseHours == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please enter the minimum number of hours to exercise the dog.', arg: 'minExerciseHours' })
    } else if (config.minExerciseHours < 0) {
      messages.push({ type: MutationMessageType.error, message: 'Please enter a valid number of hours.', arg: 'minExerciseHours' })
    }
    return messages
  },
  configurationDefault: {
    minExerciseHours: 10
  }
}

const must_exercise_schema = {
  type: 'object',
  properties: {
    exerciseHours: { type: 'number' }
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type ExerciseData = FromSchema<typeof must_exercise_schema>

export const must_exercise_your_dog_prompt: PromptDefinition<ExerciseData, ExerciseData, ExerciseConfig> = {
  key: 'must_exercise_your_dog_prompt',
  title: 'Dog Exercise Agreement',
  description: 'The applicant will agree to exercise their dog a certain number of hours a week.',
  schema: must_exercise_schema,
  answered: (data, config) => data.exerciseHours != null,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    const minExerciseHours = allConfig.must_exercise_your_dog_req?.minExerciseHours ?? 0
    if (data.exerciseHours == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please enter the number of hours you will exercise your dog.', arg: 'exerciseHours' })
    } else if (data.exerciseHours < minExerciseHours) {
      messages.push({ type: MutationMessageType.warning, message: `You must exercise your dog an average of ${minExerciseHours} hours a week in order to successfully adopt.`, arg: 'exerciseHours' })
    }
    return messages
  }
}
