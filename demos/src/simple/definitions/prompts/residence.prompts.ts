import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType, UploadFiles } from '@txstate-mws/graphql-server'
import { fileHandler } from 'fastify-txstate'
import { StateResidencePromptSchema, StateResidencePromptData, StateResidenceConfigRequirementData, StateResidenceConfirmationPromptSchema } from '../models/index.js'


export const state_residence_prompt: PromptDefinition = {
  key: 'state_residence_prompt',
  title: 'State residency',
  description: 'Applicant will identify if they reside in the required state.',
  schema: StateResidencePromptSchema,
  preload: (data, config, allConfig) => {
    console.log(`**preload data: ${JSON.stringify(data)}`)
    console.log(`**preload config: ${JSON.stringify(config)}`)
    console.log(`**preload allConfig: ${JSON.stringify(allConfig)}`)
  },
  preValidate: (data, config) => {
    const messages: MutationMessage[] = []
    const doc = data['residentIdDoc']
    if (doc) {
      if (doc.size > 10 * 1024 * 1024) messages.push({ type: MutationMessageType.error, message: 'This document is too large, please upload a file less than 10MB.', arg: 'residentIdDoc' })
      if (doc.mime !== 'image/jpeg') messages.push({ type: MutationMessageType.error, message: 'File must be of type .jpeg or .jpg', arg: 'residentIdDoc' })     
    }    
    return messages
  },
  preProcessData: async (data, ctx) => {
    if (data.residentIdDoc) {
      for await (const file of ctx.files()){ 
        const { checksum, size } = await fileHandler.put(file.stream) 
        data.residentIdDoc.shasum = checksum
        break; // easy out for single file upload
      }      
    }     
    return data
  },
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    if (data.residentOfRequiredState == null) {
      messages.push({ type: MutationMessageType.error, message: 'Please confirm whether you are a resident of the state.', arg: 'residentOfRequiredState' })
    } else if (!data.residentOfRequiredState) {
      messages.push({ type: MutationMessageType.warning, message: `Only ${allConfig.state_residence_req.residentOfState} residents qualify.`, arg: 'residentOfRequiredState' })
    } else { 
      if (!data.firstName) messages.push({ type: MutationMessageType.error, message: 'First name required', arg: 'firstName' })
      if (!data.lastName) messages.push({ type: MutationMessageType.error, message: 'Last name required', arg: 'lastName' })
      if (!data.streetAddress) messages.push({ type: MutationMessageType.error, message: 'Street address required', arg: 'streetAddress' })
      if (!data.city) messages.push({ type: MutationMessageType.error, message: 'City required', arg: 'city' })
      if (data.phoneNumber && !RegExp(/^[0-9]{10,12}$/).test(data.phoneNumber)) messages.push({ type: MutationMessageType.error, message: 'Invalid phone number', arg: 'phoneNumber' }) 
      if (data.emailAddress && !RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(data.emailAddress)) messages.push({ type: MutationMessageType.error, message: 'Invalid email address', arg: 'emailAddress' })
      if (!data.zipCode) {
        messages.push({ type: MutationMessageType.error, message: 'Zipcode required', arg: 'zipCode' })
      } else {  
        if (!RegExp(/^[0-9]{5}$/).test(data.zipCode)) messages.push({ type: MutationMessageType.error, message: 'Invalid zipcode', arg: 'zipCode' })
      } 
      if (!data.residentIdDoc) messages.push({ type: MutationMessageType.error, message: 'Identifying documentation required', arg: 'residentIdDoc' })
    }    
    return messages
  }
}

export const state_residence_confirmation_prompt: PromptDefinition = {
  key: 'state_residence_confirmation_prompt',
  title: 'State residency confirmation',
  description: 'Applicant will identify if they reside in the required state.',
  schema: StateResidenceConfirmationPromptSchema,
  fetch: async (data, config, allConfig) => { 
    return { residentOfState: 'Texas' } //TODO ...this is a HACK as currently fetch does not have access to other requirement or prompt data
  },
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []
    //TODO ...this is a HACK as currently validate does not have access to other requirement or prompt data .. hardcoded TEXAS below
    if (data.residentOfRequiredState == null) {
      messages.push({ type: MutationMessageType.error, message: `Please confirm whether applicant is a resident of Texas.`, arg: 'residentOfRequiredState' })
    } 
    if (data.residenceIsHome == null) {
      messages.push({ type: MutationMessageType.error, message: `Please validate whether applicant address provided is a home in Texas.`, arg: 'residenceIsHome' })
    } 
    return messages
  }
}
