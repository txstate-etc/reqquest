import type { SchemaObject } from '@txstate-mws/fastify-shared'
import type { FromSchema } from 'json-schema-to-ts'
import { keyby } from 'txstate-utils'

export const stateList: { value: string, label: string }[] = [
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
  { value: 'WY', label: 'Wyoming' }]

export const stateLookup = keyby(stateList, 'value')

export const stateAbbreviations = stateList.map(sl => sl.value)
export const stateNames = stateList.map(s1 => s1.label)

export const StateResidenceConfigRequirementSchema = {
  type: 'object',
  properties: {
    residentOfState: { type: 'string', enum: stateNames }
  },
  required: ['residentOfState'],
  additionalProperties: false
} as const satisfies SchemaObject
export type StateResidenceConfigRequirementData = FromSchema<typeof StateResidenceConfigRequirementSchema>

export const UploadInfoWithSumSchema = {
  type: 'object',
  properties: {
    _type: { type: 'string' },
    multipartIndex: { type: 'number' },
    name: { type: 'string' },
    mime: { type: 'string' },
    size: { type: 'number' },
    shasum: { type: 'string' }
  },
  required: ['_type', 'multipartIndex', 'name', 'mime', 'size', 'shasum'],
  additionalProperties: false
} as const satisfies SchemaObject
export type UploadInfoWithSumData = FromSchema<typeof UploadInfoWithSumSchema>

export const StateResidencePromptSchema = {
  type: 'object',
  properties: {
    residentOfRequiredState: { type: 'boolean' },
    residentIdDoc: UploadInfoWithSumSchema
  },
  additionalProperties: false
} as const satisfies SchemaObject
export type StateResidencePromptData = FromSchema<typeof StateResidencePromptSchema>