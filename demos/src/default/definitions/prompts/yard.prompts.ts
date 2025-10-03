import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { YardPromptData, YardPromptSchema } from '../models/index.js'

export const have_yard_prompt: PromptDefinition<YardPromptData, YardPromptData> = {
  key: 'have_yard_prompt',
  title: 'Tell us about your yard',
  description: 'Applicants will enter information about their yard including how large it is and how many pets will share it.',
  schema: YardPromptSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.haveYard == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please indicate whether you have a yard.', arg: 'haveYard' })
    } else if (data.haveYard) {
      if (data.squareFootage == null) messages.push({ type: MutationMessageType.error, message: 'Please enter the square footage of your yard.', arg: 'squareFootage' })
      else if (data.squareFootage <= 0) {
        messages.push({ type: MutationMessageType.error, message: 'Please enter a valid square footage.', arg: 'squareFootage' })
      }
      if (data.totalPets == null) messages.push({ type: MutationMessageType.error, message: 'Please enter the number of pets.', arg: 'totalPets' })
      else if (data.totalPets < 0) {
        messages.push({ type: MutationMessageType.error, message: 'Please enter a valid number of pets.' + (data.totalPets === 0 ? ' Remember to include this pet in your total.' : ''), arg: 'totalPets' })
      }
    }
    return messages
  }
}
