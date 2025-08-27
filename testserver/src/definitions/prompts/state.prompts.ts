import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { stateList, stateLookup, StatePromptSchema } from '../models/index.js'
import { stat } from 'node:fs'

export const which_state_prompt: PromptDefinition = {
  key: 'which_state_prompt',
  title: 'Where do you live?',
  description: 'Applicants will enter the state they live in.',
  schema: StatePromptSchema,
  fetch: async (data, config) => ({ stateList }),
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.state == null) messages.push({ type: MutationMessageType.warning, message: 'Please enter the state you live in.', arg: 'state' })
    if (data.stateName !== stateList.find(sl => sl.value === data.state)?.label) messages.push({ type: MutationMessageType.error, message: 'State abbreviation does not match state name.', arg: 'stateName' })
    return messages
  },
  tags: [{
    category: 'state',
    categoryLabel: 'State',
    extract: data => data.which_state_prompt ? [data.which_state_prompt.state] : [],
    description: 'Limit based on the state the applicant lives in.',
    getTags: () => stateList,
    getLabel: tag => stateLookup[tag]?.label ?? tag,
    useInAppRequestList: 1,
    useInListFilters: 1,
    useInReviewerDashboard: 1
  }]
}
