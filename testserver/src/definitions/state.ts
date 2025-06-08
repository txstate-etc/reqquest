import { MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PromptDefinition, RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { keyby } from 'txstate-utils'

export const which_state_req: RequirementDefinition = {
  type: RequirementType.PREQUAL,
  key: 'which_state_req',
  title: 'Applicant provides state of residence.',
  navTitle: 'State',
  description: 'Applicants must tell us which state they live in.',
  neverDisqualifying: true,
  promptKeys: ['which_state_prompt'],
  resolve: (data, config) => {
    const state = data.which_state_prompt?.state as string
    if (state == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

const stateList = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'MD', label: 'Maryland' },
  { value: 'ME', label: 'Maine' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
]
const stateLookup = keyby(stateList, 'value')

export const which_state_prompt: PromptDefinition = {
  key: 'which_state_prompt',
  title: 'Where do you live?',
  description: 'Applicants will enter the state they live in.',
  answered: (data, config) => data.state != null,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.state == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please enter the state you live in.', arg: 'state' })
    }
    return messages
  },
  fetch: async (data, config) => ({ stateList }),
  tags: [{
    category: 'state',
    categoryLabel: 'State',
    extract: data => data.which_state_prompt ? [data.which_state_prompt.state] : [],
    description: 'Limit based on the state the applicant lives in.',
    getTags: () => stateList,
    getLabel: tag => stateLookup[tag]?.label ?? tag
  }]
}
