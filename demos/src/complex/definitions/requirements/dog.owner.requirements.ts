import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidenceConfigRequirementData } from '../models/index.js'
import { DogOwnerPromptData } from '../models/index.js'

export const dogowner_qual_req: RequirementDefinition = {
  type: RequirementType.PREQUAL,
  key: 'dogowner_qual_req',
  title: 'Provide dog owner info',
  navTitle: 'Dog owner info',
  description: 'Provide dog owner information',
  promptKeys: ['dogowner_prompt'],
  resolve: (data, config) => {
    const dogOwnerPromptData = data.dogowner_prompt as DogOwnerPromptData
    if (dogOwnerPromptData?.everOwnedADog == null) return { status: RequirementStatus.PENDING }
    if (dogOwnerPromptData.everOwnedADog === false) return { status: RequirementStatus.WARNING, reason: 'Previous dog ownership is usually required.  Exceptions on a case by case basis.' }
    return { status: RequirementStatus.MET }
  }
}