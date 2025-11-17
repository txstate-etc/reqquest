import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { TermsAndConditionsConfigPromptSchema, TermsAndConditionsPromptSchema } from '../models/index.js'

export const terms_and_conditions_prompt: PromptDefinition = {
  key: 'terms_and_conditions_prompt',
  title: 'Terms and conditions',
  description: 'Applicant must agree to terms and conditions.',
  schema: TermsAndConditionsPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = [] 
    if (!data || data.agree == null) messages.push({ type: MutationMessageType.error, message: 'Terms and conditions input required', arg: 'agree' })
    if (data) {
      if (data.agree === false) messages.push({ type: MutationMessageType.error, message: 'Must agree with terms and conditions to continue submission', arg: 'agree' })
    } 
    return messages
  },
  configuration: {
    schema: TermsAndConditionsConfigPromptSchema,
    validate: (config: { text: null }) => {
      const messages: MutationMessage[] = []
      if (config.text == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the terms and conditions', arg: 'text' })
      }
      return messages
    },
    default: { text: 'You consent to surrending your first child as collateral for being approved for one of the programs.  Collateral will be returned after 1 year of adequate pet care.' }
  }//,
  // TODO: Remove this bug workaround once bug #179 is resolved
  //gatherConfig: (allPeriodConfig) => {
  //  return {'terms_and_conditions_prompt': {'text': allPeriodConfig.terms_and_conditions_prompt.text}}
  //}  
}