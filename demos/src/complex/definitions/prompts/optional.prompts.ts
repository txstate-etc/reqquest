import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { BridgeOfDeathPromptSchema, ReviewMovieLoverAnswersPromptSchema } from '../models/optional.prompt.models.js'

export const bridge_of_death_prompt: PromptDefinition = {
  key: 'bridge_of_death_prompt',
  title: 'Movie Lover?',
  description: 'Applicant will answer questions to be able to cross over the Bridge of Death.',
  schema: BridgeOfDeathPromptSchema,
  validate: (data, config, allConfig) => { // NO VALIDATION REQUIRED, FULL OPTIONAL PROMPT
    const messages: MutationMessage[] = [] 
    if (data.airSpeedOfUnladenSwallow?.toLowerCase().includes('african or european')) messages.push({ type: MutationMessageType.success, message: 'You truly are the King of the Britons!', arg: 'airSpeedOfUnladenSwallow' })
    return messages
  },
  preload: (appReq, config, appReqData) => {
    if (appReqData.state_residence_prompt?.firstName != null && appReqData.state_residence_prompt?.lastName != null) {
      return { name: `Sir ${appReqData.state_residence_prompt.firstName} of ${appReqData.state_residence_prompt.lastName}ville`}
    } 
  }
}

export const review_movie_lover_answers_prompt: PromptDefinition = {
  key: 'review_movie_lover_answers_prompt',
  title: 'Review movie answers',
  description: 'Reviewer will evaluate movie answers.',
  schema: ReviewMovieLoverAnswersPromptSchema,
  validate: (data, config, appRequestData) => { // NO VALIDATION REQUIRED, FULL OPTIONAL REVIEWER PROMPT
    const messages: MutationMessage[] = [] 
    return messages
  }
}