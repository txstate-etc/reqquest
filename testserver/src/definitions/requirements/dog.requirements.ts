import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { ExerciseConfigRequirementData, ExercisePromptData } from '../models/index.js'

export const must_exercise_your_dog_req: RequirementDefinition<ExerciseConfigRequirementData> = {
  type: RequirementType.QUALIFICATION,
  key: 'must_exercise_your_dog_req',
  title: 'Agreement to Exercise the Dog',
  navTitle: 'Exercise Per Week',
  description: 'The applicant must exercise their dog a certain number of hours a week.',
  promptKeys: ['must_exercise_your_dog_prompt'],
  resolve: (data, config) => {
    const exerciseData = data.must_exercise_your_dog_prompt as ExercisePromptData
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
  configurationDefault: { minExerciseHours: 10 }
}
