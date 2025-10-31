import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PreviousDogOwnerPromptData, CurrentDogOwnerPromptData, OwnerDogAllergyPromptData, DogExercisePromptData, CurrentDogOwnerRequirementConfigSchema, DogMinExerciseRequirementConfigSchema } from '../models/index.js'

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
    const dogOwnerPromptData = data.current_dogowner_prompt as CurrentDogOwnerPromptData
    if (dogOwnerPromptData == null) return { status: RequirementStatus.PENDING }     
    if (!dogOwnerPromptData.owned) { 
      return { status: RequirementStatus.MET }
    } else {
      if (dogOwnerPromptData.count == null) return { status: RequirementStatus.PENDING }
      if (dogOwnerPromptData.count >= config.maxCount ) return { status: RequirementStatus.WARNING, reason: "Too many dogs currently, waivers available case-by-case" }
      return { status: RequirementStatus.MET }
    }    
  },
  configuration: {
    schema: CurrentDogOwnerRequirementConfigSchema,
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
    if (dogOwnerPromptData == null) return { status: RequirementStatus.PENDING }
    if (dogOwnerPromptData.allergic) {
      return { status: RequirementStatus.WARNING, reason: 'We reserve the right to deny applications with known allergies (based on years of consistently high return rates).' }
    } else { 
      return { status: RequirementStatus.MET }
    }    
  }
}

export const dog_exercise_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'dog_exercise_qual_req',
  title: 'Agree to exercise dog',
  navTitle: 'Dog exercise',
  description: 'Agree to weekly exercise of dog',
  promptKeys: ['dog_exercise_prompt'],
  resolve: (data, config) => {
    const exerciseData = data.dog_exercise_prompt as DogExercisePromptData
    if (exerciseData == null) return { status: RequirementStatus.PENDING }     
    if (exerciseData.agreeToExercise) { 
      return { status: RequirementStatus.MET }
    } else {
      return { status: RequirementStatus.WARNING, reason: 'Requires consent of regular exercise, exceptions made on case-by-base basis' }
    }    
  },
  configuration: {
    schema: DogMinExerciseRequirementConfigSchema,
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.minExerciseHoursWeekly == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the required number of weekly exercise hours.', arg: 'minExerciseHoursWeekly' })
      }
      return messages
    },
    default: { minExerciseHoursWeekly: 7 }
  }
}