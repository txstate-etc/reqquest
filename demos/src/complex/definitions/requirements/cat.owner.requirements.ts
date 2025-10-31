import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PreviousCatOwnerPromptData } from '../models'

export const previous_catowner_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'previous_catowner_qual_req',
  title: 'Provide previous cat owner info',
  navTitle: 'Previous cat owner info',
  description: 'Provide previous cat owner information',
  promptKeys: ['previous_catowner_prompt'],
  resolve: (data, config) => {
    const catOwnerPromptData = data.previous_catowner_prompt as PreviousCatOwnerPromptData
    if (catOwnerPromptData?.owned != null) {
      if (catOwnerPromptData.owned === false) {
        return { status: RequirementStatus.WARNING, reason: 'Previous cat ownership is usually required.  Exceptions on a case by case basis.' }
      } else { 
        return { status: RequirementStatus.MET }
      }
    }
    return { status: RequirementStatus.PENDING }
  }
}