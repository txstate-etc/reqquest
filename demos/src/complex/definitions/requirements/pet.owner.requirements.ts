import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { AcceptFosterPetPromptData, ChildrenPromptData, PetOwnerOwnerRequirementConfigData, PetOwnerPromptData, ReviewApplicantFosterAPetPromptData } from '../models/index.js'

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

export const review_applicant_foster_a_pet_info_app_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'review_applicant_foster_a_pet_info_app_req',
  title: 'Review applicant foster info',
  navTitle: 'Review applicant foster info',
  description: 'A Reviewer will evaluate applicant foster info for discrepancies.',
  promptKeys: ['review_applicant_foster_a_pet_info_prompt'],
  promptKeysNoDisplay: ['children_prompt'],
  resolve: (data, config) => {
    const childData = data.children_prompt as ChildrenPromptData
    const revFosterInfoData = data.review_applicant_foster_a_pet_info_prompt as ReviewApplicantFosterAPetPromptData
    if (childData?.underMinAge && revFosterInfoData == null) return { status: RequirementStatus.PENDING }
    const underAgeKidCount = (childData.count) ?? 0
    if (underAgeKidCount > 0 && revFosterInfoData.underAgeChildrenAcceptable === false) return { status: RequirementStatus.DISQUALIFYING }
    return { status: RequirementStatus.MET }
  }
}

export const accept_fost_pet_req: RequirementDefinition = {
  type: RequirementType.ACCEPTANCE,
  key: 'accept_fost_pet_req',
  title: 'Select a pet to foster',
  navTitle: 'Select a pet to foster',
  description: 'An applicant can select one of the pets for fostering.',
  promptKeys: ['accept_foster_pet_prompt'],
  resolve: (data, config) => {
    const acceptFosterPetPrompt = data.accept_foster_pet_prompt as AcceptFosterPetPromptData
    if (acceptFosterPetPrompt == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
