import { InvalidatedResponse, type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType, UploadFiles } from '@txstate-mws/graphql-server'
import { fileHandler } from 'fastify-txstate'
import { ReviewStateResidenceInfoPromptSchema, StateResidencePromptSchema } from '../models/index.js'

export const state_residence_prompt: PromptDefinition = {
  key: 'state_residence_prompt',
  title: 'State residency',
  description: 'Applicant will identify if they reside in the required state.',
  schema: StateResidencePromptSchema,
  preValidate: (data, config) => {
    const messages: MutationMessage[] = []
    const doc = data['residentIdDoc']
    if (doc) {
      const allowedMbSize = 10
      if (doc.size > allowedMbSize * 1024 * 1024) messages.push({ type: MutationMessageType.error, message: `This document is too large, please upload a file less than ${allowedMbSize}MB.`, arg: 'residentIdDoc' })
      if (doc.mime !== 'image/jpeg' && doc.mime !== 'image/gif' && doc.mime !== 'image/png' && doc.mime !== 'application/pdf') messages.push({ type: MutationMessageType.error, message: 'File must be of type JPEG, GIF, PNG or PDF', arg: 'residentIdDoc' })
    }
    return messages
  },
  preProcessData: async (data, ctx) => {
    if (data.residentIdDoc) {
      for await (const file of ctx.files()) {
        const { checksum, size } = await fileHandler.put(file.stream)
        data.residentIdDoc.shasum = checksum
        break // easy out for single file upload
      }
    }
    return data
  },
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (!data.firstName) messages.push({ type: MutationMessageType.error, message: 'First name required', arg: 'firstName' })
    if (!data.lastName) messages.push({ type: MutationMessageType.error, message: 'Last name required', arg: 'lastName' })
    if (!data.streetAddress) messages.push({ type: MutationMessageType.error, message: 'Street address required', arg: 'streetAddress' })
    if (!data.city) messages.push({ type: MutationMessageType.error, message: 'City required', arg: 'city' })
    if (!data.state) messages.push({ type: MutationMessageType.error, message: 'State required', arg: 'state' })
    if (data.phoneNumber && !RegExp(/^[0-9]{10,12}$/).test(data.phoneNumber)) messages.push({ type: MutationMessageType.error, message: 'Invalid phone number', arg: 'phoneNumber' })
    if (data.emailAddress && !RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(data.emailAddress)) messages.push({ type: MutationMessageType.error, message: 'Invalid email address', arg: 'emailAddress' })
    if (!data.zipCode) {
      messages.push({ type: MutationMessageType.error, message: 'Zipcode required', arg: 'zipCode' })
    } else {
      if (!RegExp(/^[0-9]{5}$/).test(data.zipCode)) messages.push({ type: MutationMessageType.error, message: 'Invalid zipcode', arg: 'zipCode' })
    }
    if (data.residentIdDocRequired === true && !data.residentIdDoc) messages.push({ type: MutationMessageType.error, message: 'Identifying documentation required', arg: 'residentIdDoc' })

    return messages
  },
  gatherConfig: allPeriodConfig => {
    return { state_residence_prequal_req: { residentOfState: allPeriodConfig.state_residence_prequal_req.residentOfState } }
  },
  invalidUponChange: [{ promptKey: 'review_applicant_state_residence_info_prompt' }]
}

export const review_applicant_state_residence_info_prompt: PromptDefinition = {
  key: 'review_applicant_state_residence_info_prompt',
  title: 'Review applicant residence info',
  description: 'A Reviewer will confirm applicant residency info matches identifying documentation',
  schema: ReviewStateResidenceInfoPromptSchema,
  validate: (data, config, appRequestData) => {
    const messages: MutationMessage[] = []
    if (!data) messages.push({ type: MutationMessageType.error, message: 'Confirmation info required' })
    if (data.residencyInfoAcceptable == null) messages.push({ type: MutationMessageType.error, message: 'Confirmation of residency required', arg: 'residencyInfoAcceptable' })
    if (!data.residencyInfoAcceptable) {
      if (!data.corrections) messages.push({ type: MutationMessageType.error, message: 'Suggested corrections required', arg: 'corrections' })
    }
    return messages
  },
  invalidUponChange: (data: any, config: any, appRequestData: Record<string, any>, allPeriodConfig: Record<string, any>) => {
    const invalidatedResponse: InvalidatedResponse[] = []
    if (data && !data.residencyInfoAcceptable) {
      invalidatedResponse.push({ promptKey: 'state_residence_prompt', reason: data.corrections })
    }
    return invalidatedResponse
  },
  validUponChange: (data: any, config: any, appRequestData: Record<string, any>, allPeriodConfig: Record<string, any>) => {
    if (data && data.residencyInfoAcceptable) {
      return ['state_residence_prompt']
    }
    return []
  }
}
