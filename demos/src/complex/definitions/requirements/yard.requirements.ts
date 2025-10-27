import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { CurrentDogOwnerPromptData, YardConfigRequirementData } from '../models/index.js'
import { YardPromptData } from '../models/index.js'

export const yard_qual_req: RequirementDefinition<YardConfigRequirementData> = {
  type: RequirementType.QUALIFICATION,
  key: 'yard_qual_req',
  title: 'Provide yard information',
  navTitle: 'Yard',
  description: 'Provide information for applicants yard',
  promptKeys: ['current_dogowner_prompt', 'yard_prompt'],
  resolve: (data, config) => {
    const YardPromptData = data.yard_prompt as YardPromptData
    const CurrentDogOwnerPromptData = data.current_dogowner_prompt as CurrentDogOwnerPromptData
    if (YardPromptData?.sqftYardSize == null) return { status: RequirementStatus.PENDING }
    if (CurrentDogOwnerPromptData?.count == null) return { status: RequirementStatus.PENDING }
    const minFutureDogCount = CurrentDogOwnerPromptData.count + 1
    if ((config!.minSqftPerDog! * minFutureDogCount) >  YardPromptData?.sqftYardSize) return { status: RequirementStatus.WARNING, reason: 'Outdoor space is not sufficient for adopting an additional dog. Waivers available case-by-case.' }
    return { status: RequirementStatus.MET }
  },
  configuration: {
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.residentOfState == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the minimum square foot of yard required for each dog', arg: 'minSqftPerDog' })
      }
      return messages
    },
    default: { minSqftPerDog: 500 }
  }  
}



