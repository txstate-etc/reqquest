import { MutationMessage, PromptDefinition } from '@reqquest/api'
import { AssessMaintainSysDocumentationData, AssessMaintainSysDocumentationSchema, AssessSupportCommunicationData, AssessSupportCommunicationSchema, AssessTechincalTroubleshootingData, AssessTechincalTroubleshootingSchema, MaintainSysDocumentationData, MaintainSysDocumentationSchema, SupportCommunicationData, SupportCommunicationSchema, TechincalTroubleshootingData, TechincalTroubleshootingSchema } from '../models/index.js'
import { MutationMessageType } from '@txstate-mws/graphql-server'
import { fileHandler } from 'fastify-txstate'
import { OptOutData, OptOutSchema } from '../models/optOut.models.js'

export const application_management_opt_out_prompt: PromptDefinition<OptOutData> = {
  key: 'application_management_opt_out_prompt',
  title: 'Application management',
  description: 'Opt Out',
  schema: OptOutSchema,
  optOut: true,
  validate: (data, config) => {
    return []
  }
}

export const technical_troubleshooting_prompt: PromptDefinition<TechincalTroubleshootingData> = {
  key: 'technical_troubleshooting_prompt',
  title: 'Technical Troubleshooting',
  description: 'Technical Troubleshooting',
  schema: TechincalTroubleshootingSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.describeTechincalTroubleshooting == null) messages.push({ type: MutationMessageType.error, message: 'This field is required', arg: 'describeTechincalTroubleshooting' })

    return messages
  },
  invalidUponChange: [{ promptKey: 'assess_technical_troubleshooting_prompt' }]
}

export const assess_technical_troubleshooting_prompt: PromptDefinition<AssessTechincalTroubleshootingData> = {
  key: 'assess_technical_troubleshooting_prompt',
  title: 'Assess Technical Troubleshooting',
  description: 'Assess Technical Troubleshooting',
  schema: AssessTechincalTroubleshootingSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.complexity == null) messages.push({ type: MutationMessageType.error, message: 'This field is required', arg: 'complexity' })
    if (data.demonstrateTechincalTroubleshooting == null) messages.push({ type: MutationMessageType.error, message: 'This field is required', arg: '.demonstrateTechincalTroubleshooting' })

    return messages
  },
  invalidUponChange: [{ promptKey: 'technical_troubleshooting_prompt', reason: 'Troubleshooting was poorly described, make changes and resubmit' }]
}

export const support_communication_prompt: PromptDefinition<SupportCommunicationData> = {
  key: 'support_communication_prompt',
  title: 'Support Communication',
  description: 'Support Communication',
  schema: SupportCommunicationSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.describeSupportCommunication == null) messages.push({ type: MutationMessageType.error, message: 'This field is required', arg: 'describeSupportCommunication' })

    return messages
  }
}

export const assess_support_communication_prompt: PromptDefinition<AssessSupportCommunicationData> = {
  key: 'assess_support_communication_prompt',
  title: 'Assess Support Communication',
  description: 'Assess Support Communication',
  schema: AssessSupportCommunicationSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.clarity == null) messages.push({ type: MutationMessageType.error, message: 'This field is required', arg: 'clarity' })

    return messages
  }
}

export const maintain_sys_documentation_prompt: PromptDefinition<MaintainSysDocumentationData> = {
  key: 'maintain_sys_documentation_prompt',
  title: 'Maintain System Documentation',
  description: 'Maintain System Documentation',
  schema: MaintainSysDocumentationSchema,
  preProcessData: async (data, ctx) => {
    if (data.documentation) {
      for await (const file of ctx.files()) {
        const { checksum, size } = await fileHandler.put(file.stream)
        data.documentation.shasum = checksum
        break // easy out for single file upload
      }
    }
    return data
  },
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (!data.maintainSysDocumentation) messages.push({ type: MutationMessageType.warning, message: 'Try yes', arg: 'maintainSysDocumentation' })

    return messages
  }
}

export const assess_maintain_sys_documentation_prompt: PromptDefinition<AssessMaintainSysDocumentationData> = {
  key: 'assess_maintain_sys_documentation_prompt',
  title: 'Assess Maintain System Documentation',
  description: 'Assess Maintain System Documentation',
  schema: AssessMaintainSysDocumentationSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.clarity == null) messages.push({ type: MutationMessageType.error, message: 'This field is required', arg: 'clarity' })

    return messages
  }
}
