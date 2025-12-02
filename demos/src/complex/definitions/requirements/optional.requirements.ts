import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { BridgeOfDeathPromptData, ReviewMovieLoverAnswersPromptData } from '../models/optional.prompt.models.js'

export const movie_lover_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'movie_lover_qual_req',
  title: 'Optional move lover info',
  navTitle: 'Movie lover',
  description: 'Provide answers to random movie lover questions',
  promptKeys: ['bridge_of_death_prompt'],
  resolve: (data, config) => {
    const bod = data.bridge_of_death_prompt as BridgeOfDeathPromptData
    if (bod) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.PENDING }
  }
}

export const review_movie_lover_app_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'review_movie_lover_app_req',
  title: 'Movie lovers review',
  navTitle: 'Movie lovers review',
  description: 'Provide answers to random movie lover questions',
  promptKeys: ['review_movie_lover_answers_prompt'],
  resolve: (data, config) => {
    const ml = data.review_movie_lover_answers_prompt as ReviewMovieLoverAnswersPromptData
    if (ml) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.PENDING }
  }
}