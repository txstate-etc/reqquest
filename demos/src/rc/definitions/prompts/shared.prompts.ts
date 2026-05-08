import { PromptDefinition, MutationMessage } from '@reqquest/api'
import { AssessReccomendationLettersData, AssessReccomendationLettersSchema, ReccomendationLettersData, ReccomendationLettersSchema } from '../models/index.js'
import { MutationMessageType } from '@txstate-mws/graphql-server'
import { fileHandler } from 'fastify-txstate'

export const reccomendation_letter_prompt: PromptDefinition<ReccomendationLettersData> = {
  key: 'reccomendation_letter_prompt',
  title: 'Reccomendation Letter',
  description: 'Reccomendation Letter',
  schema: ReccomendationLettersSchema,
  preProcessData: async (data, ctx) => {
    if (data.reccomendationLetter) {
      for await (const file of ctx.files()) {
        const { checksum, size } = await fileHandler.put(file.stream)
        data.reccomendationLetter.shasum = checksum
        break // easy out for single file upload
      }
    }
    return data
  },
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.reccomendationLetter == null) messages.push({ type: MutationMessageType.error, message: 'This field is required', arg: 'reccomendationLetter' })

    return messages
  }
}

export const assess_reccomendation_letter_prompt: PromptDefinition<AssessReccomendationLettersData> = {
  key: 'assess_reccomendation_letter_prompt',
  title: 'Assess Reccomendation Letter',
  description: 'Assess Reccomendation Letter',
  schema: AssessReccomendationLettersSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.score == null) messages.push({ type: MutationMessageType.error, message: 'This field is required', arg: 'score' })

    return messages
  }
}
