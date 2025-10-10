import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType, UploadFiles } from '@txstate-mws/graphql-server'
import { fileHandler } from 'fastify-txstate'
import { StateResidencePromptSchema, StateResidenceAutoUpdatePromptSchema } from '../models/index.js'


export const state_residence_prompt: PromptDefinition = {
  key: 'state_residence_prompt',
  title: 'State residency',
  description: 'Applicant will identify if they reside in the required state.',
  schema: StateResidencePromptSchema,
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
      if (!data.state) messages.push({ type: MutationMessageType.error, message: 'State required', arg: 'state' })
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

/** TODO CHALLENGE:   Post completion of user input residence details we need to be able to
 * submit that address to USPS and get confirmation if it's valid, invalid, or can be updated with a more accurate USPS address
 * To be able to provide info on screen to end users we must use a prompt as requirements have no direct UI, and we provide third party
 * data via fetch.  We can 'fetch' usps data and stream to the prompt UI for user consumption, questions:
 * 1. How do I update other prompt data from this prompt?  Reviewers are able to 'edit' in review screen, but how does applicant
 * update another prompt data from this prompt?
 * 2. How do I guarantee order of these prompts, or more accurately hide this prompt in nav until previous?
 * 3. If I can't update previous prompt data, am I routinely checking both data elements for existence for requirement resolve (eg. If no usps then user input)
*/
export const state_residence_autoupdate_prompt: PromptDefinition = {
  key: 'state_residence_autoupdate_prompt',
  title: 'State residency update',
  description: 'Applicant will confirm whether the auto updated address should be accepted.',
  schema: StateResidenceAutoUpdatePromptSchema
}
