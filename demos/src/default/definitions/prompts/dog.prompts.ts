import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { ExerciseConfigRequirementData, ExercisePromptData, ExercisePromptSchema } from '../models/index.js'

export const must_exercise_your_dog_prompt: PromptDefinition<ExercisePromptData, ExercisePromptData, ExerciseConfigRequirementData> = {
  key: 'must_exercise_your_dog_prompt',
  title: 'Dog Exercise Agreement',
  description: 'The applicant will agree to exercise their dog a certain number of hours a week.',
  schema: ExercisePromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    const minExerciseHours = allConfig.must_exercise_your_dog_req?.minExerciseHours ?? 0
    if (data.exerciseHours == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please enter the number of hours you will exercise your dog.', arg: 'exerciseHours' })
    } else if (data.exerciseHours < minExerciseHours) {
      messages.push({ type: MutationMessageType.warning, message: `You must exercise your dog an average of ${minExerciseHours} hours a week in order to successfully adopt.`, arg: 'exerciseHours' })
    }
    return messages
  }
}
