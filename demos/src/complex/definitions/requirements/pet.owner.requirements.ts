import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PetOwnerPromptData } from '../models/index.js'

export const petowner_prequal_req: RequirementDefinition = {
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
    return { status: RequirementStatus.MET }
  }
}