import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidenceConfigRequirementData } from '../models/index.js'
import { PetOwnerPromptData } from '../models/index.js'

export const petowner_prequal_req: RequirementDefinition<StateResidenceConfigRequirementData> = {
  type: RequirementType.PREQUAL,
  key: 'petowner_prequal_req',
  title: 'Provide pet owner info',
  navTitle: 'Pet owner info',
  description: 'Provide previous and current pet owner information',
  promptKeys: ['petowner_prompt'],
  resolve: (data, config) => {
    //const previousPetOwnerPromptData = data.state_residence_prompt as PreviousPetOwnerPromptData
    //if (previousPetOwnerPromptData?.previousPetOwnnership == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.PENDING }
  }
}