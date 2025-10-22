import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { StateResidenceConfigRequirementData } from '../models/index.js'
import { PreviousPetOwnerPromptData } from '../models/index.js'

export const stprevious_petowner_prequal_req: RequirementDefinition<StateResidenceConfigRequirementData> = {
  type: RequirementType.PREQUAL,
  key: 'previous_petowner_prequal_req',
  title: 'Provide previous pet owner info',
  navTitle: 'Previous pet owner NAV',
  description: 'Provide previous pet owner information',
  promptKeys: ['previous_petowner_prompt'],
  resolve: (data, config) => {
    const previousPetOwnerPromptData = data.state_residence_prompt as PreviousPetOwnerPromptData
    if (previousPetOwnerPromptData?.previousPetOwnnership == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.PENDING }
  }
}