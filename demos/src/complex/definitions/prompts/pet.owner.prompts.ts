import { type PromptDefinition } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { PreviousPetOwnerPromptSchema } from '../models/index.js'


export const previous_petowner_prompt: PromptDefinition = {
  key: 'previous_petowner_prompt',
  title: 'Previous pet owner',
  description: 'Applicant will identify previous pet owner information.',
  schema: PreviousPetOwnerPromptSchema,
  validate: (data, config, allConfig) => {
    const messages: MutationMessage[] = []  
    /*   
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
    */
    return messages
  }
}

