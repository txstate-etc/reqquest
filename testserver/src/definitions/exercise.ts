import { MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { Prompt, PromptDefinition, RequirementDefinition, RequirementStatus, RequirementType } from '@txstate-mws/reqquest'

export interface ExerciseData {
  exerciseHours: number
}

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
    if (exerciseData?.exerciseHours == null) return RequirementStatus.PENDING
    if (exerciseData.exerciseHours >= config.minExerciseHours) return RequirementStatus.MET
    return RequirementStatus.WARNING
  },
  statusReason: config => `You must exercise your dog ${config.minExerciseHours} hours a week.`,
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

export const must_exercise_your_dog_prompt: PromptDefinition<ExerciseData, ExerciseData, ExerciseConfig> = {
  key: 'must_exercise_your_dog_prompt',
  title: 'Dog Exercise Agreement',
  description: 'The applicant will agree to exercise their dog a certain number of hours a week.',
  answered: (data, config) => data.exerciseHours != null,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.exerciseHours == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please enter the number of hours you will exercise your dog.', arg: 'exerciseHours' })
    } else if (data.exerciseHours < config.minExerciseHours) {
      messages.push({ type: MutationMessageType.warning, message: `You must exercise your dog an average of ${config.minExerciseHours} hours a week in order to successfully adopt.`, arg: 'exerciseHours' })
    }
    return messages
  }
}
