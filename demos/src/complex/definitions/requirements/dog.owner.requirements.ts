import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { PreviousDogOwnerPromptData } from '../models/index.js'

export const previous_dogowner_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'previous_dogowner_qual_req',
  title: 'Provide previous dog owner info',
  navTitle: 'Previous dog owner info',
  description: 'Provide previous dog owner information',
  promptKeys: ['previous_dogowner_prompt'],
  resolve: (data, config) => {
    const dogOwnerPromptData = data.previous_dogowner_prompt as PreviousDogOwnerPromptData
    if (dogOwnerPromptData?.owned == null) return { status: RequirementStatus.PENDING }
    if (dogOwnerPromptData.owned === false) return { status: RequirementStatus.WARNING, reason: 'Previous dog ownership is usually required.  Exceptions on a case by case basis.' }
    return { status: RequirementStatus.MET }
  }
}