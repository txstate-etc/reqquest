import { MutationMessage, PromptDefinition } from '@reqquest/api'
import { orgs, PreQualPromptData, PrequalPropmtSchema } from '../models/prequal.models.js'
import { MutationMessageType } from '@txstate-mws/graphql-server'

export const pre_qual_prompt: PromptDefinition<PreQualPromptData> = {
  key: 'pre_qual_prompt',
  title: 'Pre Qualification',
  description: 'MWS Technical Mentorship Experience Pre-Qualification',
  schema: PrequalPropmtSchema,
  fetch: () => {
    return orgs
  },
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.acknowledgeExpectations == null) messages.push({ type: MutationMessageType.error, message: 'Please acknowledge participation expectations.', arg: 'acknowledgeExpectations' })

    const minimumGPA = 3.0
    if (data.gpa == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please enter your GPA.', arg: 'gpa' })
    } else if (data.gpa < minimumGPA) {
      messages.push({ type: MutationMessageType.warning, message: `Your GPA munt be a minimum of ${minimumGPA}`, arg: 'gpa' })
    }

    if (data.availability == null) messages.push({ type: MutationMessageType.error, message: 'Please acknowledge availability expectations.', arg: 'availability' })

    return messages
  }
}
