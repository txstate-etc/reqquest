import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { IDValuesExtraDataPromptSchema, IDValuesPromptSchema, Step1PostResidencePromptSchema, Step2PostResidencePromptSchema, Step3PostResidencePromptSchema, ThanksOrNoThanksPromptSchema } from '../models/index.js'

export const step1_post_residence_prompt: PromptDefinition = {
  key: 'step1_post_residence_prompt',
  title: 'Accessible prompt 1 of 2, req 2',
  navTitle: 'Accessible prompt 1 of 2, req 2',
  description: 'Identifies whether requirement+prompts show post previous req that returns disqualifying',
  schema: Step1PostResidencePromptSchema,
  validate: (data, config, appRequestData, allConfig) => {
    const messages: MutationMessage[] = []
    if (data.allow == null) messages.push({ type: MutationMessageType.error, message: 'Please confirm if allowed to continue', arg: 'allow' })
    if (data.allow == false) messages.push({ type: MutationMessageType.error, message: 'Validation type error creates hard ui flow stop, prevents continuing to next prompt' })
    return messages
  }
}

export const step2_post_residence_prompt: PromptDefinition = {
  key: 'step2_post_residence_prompt',
  title: 'Accessible prompt 2 of 2, req 2',
  navTitle: 'Accessible prompt 2 of 2, req 2',
  description: 'Identifies whether requirement+prompts show post previous req that returns disqualifying',
  schema: Step2PostResidencePromptSchema,
  validate: (data, config, appRequestData, allConfig) => {
    const messages: MutationMessage[] = []
    if (data.allow == null) messages.push({ type: MutationMessageType.error, message: 'Please confirm if allowed to continue', arg: 'allow' })
    if (data.allow == false) messages.push({ type: MutationMessageType.warning, message: 'Validation type warning does not stop UI flow to next prompt' })
    return messages
  }
}

export const step3_post_residence_prompt: PromptDefinition = {
  key: 'step3_post_residence_prompt',
  title: 'Accessible prompt 1 of 1, req 3',
  navTitle: 'Accessible prompt 1 of 1, req 3',
  description: 'Identifies whether requirement+prompts show post previous req that returns disqualifying',
  schema: Step3PostResidencePromptSchema,
  validate: (data, config, appRequestData, allConfig) => {
    const messages: MutationMessage[] = []
    if (data.allow == null) messages.push({ type: MutationMessageType.error, message: 'Please confirm if allowed to continue', arg: 'allow' })
    if (data.allow == false) messages.push({ type: MutationMessageType.warning, message: 'Validation type warning does not stop UI flow to next prompt' })
    return messages
  }
}

export const thanks_or_no_thanks_prompt: PromptDefinition = {
  key: 'thanks_or_no_thanks_prompt',
  title: 'Thanks or no thanks',
  navTitle: 'Thanks or no thanks',
  description: 'Simulate a prompt within a requirement that a user may not want',
  schema: ThanksOrNoThanksPromptSchema,
  validate: (data, config, appRequestData, allConfig) => {
    const messages: MutationMessage[] = []
    if (data.thanks == null) messages.push({ type: MutationMessageType.error, message: 'Please confirm thanks or no thanks', arg: 'thanks' })
    return messages
  }
}

export const id_values_prompt: PromptDefinition = {
  key: 'id_values_prompt',
  title: 'DODId or SSN',
  navTitle: 'DODId or SSN',
  description: 'Give me an DODId or SSN',
  schema: IDValuesPromptSchema,
  validate: (data, config, appRequestData, allConfig) => {
    const messages: MutationMessage[] = []
    if (data.type == null) messages.push({ type: MutationMessageType.error, message: 'Id type required', arg: 'type' })
    if (data.dodidValue == null && data.ssnValue == null) {
      messages.push({ type: MutationMessageType.error, message: 'DODId value required', arg: 'dodidValue' })
      messages.push({ type: MutationMessageType.error, message: 'SSN value required', arg: 'ssnValue' })
    }
    return messages
  }
}

export const id_values_extra_data_prompt: PromptDefinition = {
  key: 'id_values_extra_data_prompt',
  title: 'Extra data before SSN optional Prompt',
  navTitle: 'Extra data before SSN optional Prompt',
  description: 'Collect data ',
  schema: IDValuesExtraDataPromptSchema,
  validate: (data, config, appRequestData, allConfig) => {
    const messages: MutationMessage[] = []
    if (data.allow == null) messages.push({ type: MutationMessageType.error, message: 'Allow value required', arg: 'allow' })
    return messages
  }
}
