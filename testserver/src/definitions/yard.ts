import { PromptDefinition, RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'

export interface YardData {
  haveYard: boolean
  squareFootage?: number
  totalPets?: number
}

export const have_yard_prompt: PromptDefinition<YardData, YardData> = {
  key: 'have_yard_prompt',
  title: 'Tell us about your yard',
  description: 'Applicants will enter information about their yard including how large it is and how many pets will share it.',
  answered: (data, config) => data.haveYard != null && (!data.haveYard || ((data.squareFootage ?? 0) > 0 && (data.totalPets ?? 0) > 0)),
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.haveYard == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you have a yard.', arg: 'haveYard' })
    } else if (data.haveYard) {
      if (data.squareFootage == null) messages.push({ type: MutationMessageType.warning, message: 'Please enter the square footage of your yard.', arg: 'squareFootage' })
      else if (data.squareFootage <= 0) {
        messages.push({ type: MutationMessageType.error, message: 'Please enter a valid square footage.', arg: 'squareFootage' })
      }
      if (data.totalPets == null) messages.push({ type: MutationMessageType.warning, message: 'Please enter the number of pets.', arg: 'totalPets' })
      else if (data.totalPets < 1) {
        messages.push({ type: MutationMessageType.warning, message: 'Please enter a valid number of pets.' + (data.totalPets === 0 ? ' Remember to include this pet in your total.' : ''), arg: 'totalPets' })
      }
    }
    return messages
  }
}

export const have_big_yard_req: RequirementDefinition = {
  type: RequirementType.PREQUAL,
  key: 'have_big_yard_req',
  title: 'Have a big yard',
  navTitle: 'Big Yard',
  description: 'Applicants must have a yard that is at least 1000 square feet.',
  promptKeys: ['have_yard_prompt'],
  resolve: (data, config) => {
    const yardData = data['have_yard_prompt'] as YardData
    if (yardData == null || yardData.haveYard == null) return { status: RequirementStatus.PENDING }
    if (!yardData.haveYard) return { status: RequirementStatus.DISQUALIFYING, reason: 'Must have a yard to have a dog.' }
    if (yardData.squareFootage == null) return { status: RequirementStatus.PENDING }
    return yardData.squareFootage >= 1000 ? { status: RequirementStatus.MET } : { status: RequirementStatus.DISQUALIFYING, reason: 'Your yard is too small. It has to be at least 1000 square feet.' }
  }
}

export const have_adequate_personal_space_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'have_adequate_personal_space_req',
  title: 'Have enough space per pet',
  navTitle: 'Yard Per Pet',
  description: 'Applicants must have at least 300 square feet of yard space per pet.',
  promptKeys: ['have_yard_prompt'],
  resolve: (data, config) => {
    const yardData = data['have_yard_prompt'] as YardData
    if (yardData == null || yardData.totalPets == null) return { status: RequirementStatus.PENDING }
    if (!yardData.haveYard) return { status: RequirementStatus.DISQUALIFYING, reason: 'Must have a yard to have a dog.' }
    if (yardData.squareFootage == null) return { status: RequirementStatus.PENDING }
    if (yardData.totalPets == null || yardData.totalPets <= 0) return { status: RequirementStatus.PENDING }
    return yardData.squareFootage / yardData.totalPets >= 300
      ? { status: RequirementStatus.MET }
      : { status: RequirementStatus.DISQUALIFYING, reason: 'Must have at least 300 square feet of personal space per pet.' }
  }
}
