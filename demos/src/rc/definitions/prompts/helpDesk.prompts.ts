import { MutationMessage, PromptDefinition } from '@reqquest/api'
import { MutationMessageType } from '@txstate-mws/graphql-server'
import { HelpDeskCustomerServiceData, HelpDeskCustomerServiceSchema, HelpDeskWeekendAvailabilityData, HelpDeskWeekendAvailabilitySchema } from '../models/index.js'
import { OptOutData, OptOutSchema } from '../models/optOut.models.js'

export const help_desk_opt_out_prompt: PromptDefinition<OptOutData> = {
  key: 'help_desk_opt_out_prompt',
  title: 'Help desk associate',
  description: 'Opt Out',
  schema: OptOutSchema,
  optOut: true,
  preload: () => {
    return {
      optOut: false,
      optInUnderstand: false,
      optOutUnderstand: false
    }
  },
  validate: (data, config) => {
    return []
  }
}

export const help_desk_weekend_availability_prompt: PromptDefinition<HelpDeskWeekendAvailabilityData> = {
  key: 'help_desk_weekend_availability_prompt',
  title: 'Weekend Availability',
  description: 'Weekend Availability',
  schema: HelpDeskWeekendAvailabilitySchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.weekendAvailable == null) messages.push({ type: MutationMessageType.error, message: 'Please answer question.', arg: 'weekendAvailable' })

    return messages
  }
}

export const help_desk_customer_service_prompt: PromptDefinition<HelpDeskCustomerServiceData> = {
  key: 'help_desk_customer_service_prompt',
  title: 'Customer Service',
  description: 'Customer Service',
  schema: HelpDeskCustomerServiceSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.describeCustomerService == null) messages.push({ type: MutationMessageType.error, message: 'Please answer question.', arg: 'describeCustomerService' })

    return messages
  }
}
