import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { PreviousDogOwnerPromptData, CurrentDogOwnerPromptData, OwnerDogAllergyPromptData } from '../models/index.js'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'

export const previous_dogowner_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'previous_dogowner_qual_req',
  title: 'Provide previous dog owner info',
  navTitle: 'Previous dog owner info',
  description: 'Provide previous dog owner information',
  promptKeys: ['previous_dogowner_prompt'],
  resolve: (data, config) => {
    const dogOwnerPromptData = data.previous_dogowner_prompt as PreviousDogOwnerPromptData
    if (dogOwnerPromptData?.owned != null) {
      if (dogOwnerPromptData.owned === false) {
        return { status: RequirementStatus.WARNING, reason: 'Previous dog ownership is usually required.  Exceptions on a case by case basis.' }
      } else { 
        return { status: RequirementStatus.MET }
      }
    }
    return { status: RequirementStatus.PENDING }
  }
}

export const current_dogowner_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'current_dogowner_qual_req',
  title: 'Provide current dog owner info',
  navTitle: 'Current dog owner info',
  description: 'Provide current dog owner information',
  promptKeys: ['current_dogowner_prompt'],
  resolve: (data, config) => {
    console.log(`*** Data is ${JSON.stringify(data)}`)
    const dogOwnerPromptData = data.current_dogowner_prompt as CurrentDogOwnerPromptData
    console.log(`*** DogOwnerData is ${JSON.stringify(dogOwnerPromptData)}`)
    //console.log(`***** current_dogowner_qual_req resolv:  owned equals: ${dogOwnerPromptData?.owned}`)
    /** NOTE FOR CHANGE: dogOwnerPromptData?.owned == null is triggered evenis owned set to false explicitly  */
    if (dogOwnerPromptData?.owned == null) {
      console.log(`***In null`)
      return { status: RequirementStatus.PENDING }
    }
    if (dogOwnerPromptData.owned === false) {
      console.log(`***In false`)
      return { status: RequirementStatus.MET }
    } else {
      if (dogOwnerPromptData.count == null) return { status: RequirementStatus.PENDING }
      if (dogOwnerPromptData.count >= config.maxCount ) return { status: RequirementStatus.WARNING, reason: "Too many dogs currently, waivers available case-by-case" }
    }
    return { status: RequirementStatus.MET }
  },
  configuration: {
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.maxCount == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the maximum number of dogs permitted in the home.', arg: 'maxCount' })
      }
      return messages
    },
    default: { maxCount: 5 }
  } 
}

export const owner_dog_allergy_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'owner_dog_allergy_qual_req',
  title: 'Provide dog allergy info ',
  navTitle: 'Owner dog allergies',
  description: 'Provide owner dog allergy information',
  promptKeys: ['owner_dog_allergy_prompt'],
  resolve: (data, config) => {
    const dogOwnerPromptData = data.owner_dog_allergy_prompt as OwnerDogAllergyPromptData
    if (dogOwnerPromptData?.allergic != null) {
      if (dogOwnerPromptData.allergic === true) {
        return { status: RequirementStatus.WARNING, reason: 'We reserve the right to deny applications with known allergies (based on years of consistently high return rates).' }
      } else { 
        return { status: RequirementStatus.MET }
      }
    }
    return { status: RequirementStatus.PENDING }
  }
}