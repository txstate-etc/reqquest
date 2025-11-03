import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PetOwnerOwnerRequirementConfigData, PetOwnerPromptData } from '../models/index.js'

export const petowner_prequal_req: RequirementDefinition<PetOwnerOwnerRequirementConfigData> = {
  type: RequirementType.PREQUAL,
  key: 'petowner_prequal_req',
  title: 'Provide pet owner info',
  navTitle: 'Pet owner info',
  description: 'Provide previous and current pet owner information',
  promptKeys: ['petowner_prompt'],
  resolve: (data, config) => {
    const petOwnerPromptData = data.petowner_prompt as PetOwnerPromptData
    if (petOwnerPromptData?.previousPetOwner == null) return { status: RequirementStatus.PENDING }
    if (petOwnerPromptData.previousPetOwner === false) return { status: RequirementStatus.DISQUALIFYING, reason: 'Must have previously owned a pet to be eligible for this program' }
    const futurePetCount = (petOwnerPromptData.currentPetCount == null) ? 1 : petOwnerPromptData.currentPetCount + 1
    if (futurePetCount > config.maxCount!) return { status: RequirementStatus.WARNING, reason: 'Too many pets for a single home (exceptions made case by case)' }
    return { status: RequirementStatus.MET }
  },
  configuration: {
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.maxCount == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the maximum number of allowed pets in a home', arg: 'maxCount' })
      }
      return messages
    },
    default: { maxCount: 5 }
  }  
}