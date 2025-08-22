import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { YardPromptData } from '../models/index.js'

export const have_big_yard_req: RequirementDefinition = {
  type: RequirementType.PREQUAL,
  key: 'have_big_yard_req',
  title: 'Have a big yard',
  navTitle: 'Big Yard',
  description: 'Applicants must have a yard that is at least 1000 square feet.',
  promptKeys: ['have_yard_prompt'],
  resolve: (data, config) => {
    const yardData = data['have_yard_prompt'] as YardPromptData
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
    const yardData = data['have_yard_prompt'] as YardPromptData
    if (yardData == null || yardData.totalPets == null) return { status: RequirementStatus.PENDING }
    if (!yardData.haveYard) return { status: RequirementStatus.DISQUALIFYING, reason: 'Must have a yard to have a dog.' }
    if (yardData.squareFootage == null) return { status: RequirementStatus.PENDING }
    if (yardData.totalPets == null || yardData.totalPets <= 0) return { status: RequirementStatus.PENDING }
    return yardData.squareFootage / yardData.totalPets >= 300
      ? { status: RequirementStatus.MET }
      : { status: RequirementStatus.DISQUALIFYING, reason: 'Must have at least 300 square feet of personal space per pet.' }
  }
}
