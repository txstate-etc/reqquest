import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { TexasResidentRequirementData, ExercisePromptData } from '../models/index.js'

export const tx_resident_req: RequirementDefinition<TexasResidentRequirementData> = {
  type: RequirementType.QUALIFICATION,
  key: 'tx_resident_req',
  title: 'Must be a resident of Texas',
  navTitle: 'Texas Residency',
  description: 'Applicant must be a resident of Texas',
  promptKeys: ['tx_resident_prompt'],
  resolve: (data, config) => {
    const promptData = data.tx_resident_prompt as ExercisePromptData
    if (exerciseData?.exerciseHours == null) return { status: RequirementStatus.PENDING }
    if (exerciseData.exerciseHours >= config.minExerciseHours) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.WARNING, reason: `You must exercise your dog ${config.minExerciseHours} hours a week.` }
  },
  configuration: {
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.minExerciseHours == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please enter the minimum number of hours to exercise the dog.', arg: 'minExerciseHours' })
      } else if (config.minExerciseHours < 0) {
        messages.push({ type: MutationMessageType.error, message: 'Please enter a valid number of hours.', arg: 'minExerciseHours' })
      }
      return messages
    },
    default: { minExerciseHours: 10 }
  }
}
