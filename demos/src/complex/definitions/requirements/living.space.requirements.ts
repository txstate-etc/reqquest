import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { CurrentCatOwnerPromptData, LivingSpaceConfigRequirementData } from '../models/index.js'
import { LivingSpacePromptData, LivingSpaceConfigRequirementSchema } from '../models/index.js'

export const living_space_qual_req: RequirementDefinition<LivingSpaceConfigRequirementData> = {
  type: RequirementType.QUALIFICATION,
  key: 'living_space_qual_req',
  title: 'Provide yard information',
  navTitle: 'Yard',
  description: 'Provide information for applicants yard',
  promptKeys: ['current_catowner_prompt', 'living_space_prompt'],
  resolve: (data, config) => {
    const LivingSpacePromptData = data.living_space_prompt as LivingSpacePromptData
    const CurrentCatOwnerPromptData = data.current_catowner_prompt as CurrentCatOwnerPromptData
    if (LivingSpacePromptData == null || CurrentCatOwnerPromptData == null) return { status: RequirementStatus.PENDING }
    const minFutureCatCount = (CurrentCatOwnerPromptData.count == null) ? 1 : CurrentCatOwnerPromptData.count + 1
    if ((config!.minSqftPerCat! * minFutureCatCount) >  LivingSpacePromptData.sqftLivingSpace!) return { status: RequirementStatus.WARNING, reason: 'Living space is not sufficient for adopting an additional cat. Waivers available case-by-case.' }
    return { status: RequirementStatus.MET }
  },
  configuration: {
    schema: LivingSpaceConfigRequirementSchema,
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.minSqftPerCat == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the minimum square foot of living space required for each cat', arg: 'minSqftPerCat' })
      }
      return messages
    },
    default: { minSqftPerCat: 100 }
  }  
}



