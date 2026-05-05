import { MutationMessage, PromptDefinition } from '@reqquest/api'
import { MutationMessageType } from '@txstate-mws/graphql-server'
import { AssessAttentionDetailData, AssessAttentionDetailSchema, AssessCommunicationData, AssessCommunicationSchema, AssessOrganizationData, AssessOrganizationSchema, AttentionDetailData, AttentionDetailSchema, CommunicationData, CommunicationSchema, OrganizationData, OrganizationSchema } from '../models/index.js'

export const communication_prompt: PromptDefinition<CommunicationData> = {
  key: 'communication_prompt',
  title: 'Communication',
  description: 'Communication',
  schema: CommunicationSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.describeCommunication == null) messages.push({ type: MutationMessageType.error, message: 'Please answer question.', arg: 'describeCommunication' })

    return messages
  }
}

export const assess_communication_prompt: PromptDefinition<AssessCommunicationData> = {
  key: 'assess_communication_prompt',
  title: 'Assess Communication',
  description: 'Assess Communication',
  schema: AssessCommunicationSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.demonstrateCommunication == null) messages.push({ type: MutationMessageType.error, message: 'Please answer question.', arg: 'demonstrateCommunication' })

    return messages
  }
}

// export const attention_detail_prompt: PromptDefinition<AttentionDetailData> = {
//   key: 'attention_detail_prompt',
//   title: 'Attention to detail',
//   description: 'Attention to detail',
//   schema: AttentionDetailSchema,
//   validate: (data, config) => {
//     const messages: MutationMessage[] = []
//     if (data.describeAttentionDetail == null) messages.push({ type: MutationMessageType.error, message: 'Please answer question.', arg: '.describeAttentionDetail' })

//     return messages
//   }
// }

export const assess_attention_detail_prompt: PromptDefinition<AssessAttentionDetailData> = {
  key: 'assess_attention_detail_prompt',
  title: 'Assess attention to detail',
  description: 'Assess attention to detail',
  schema: AssessAttentionDetailSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.demonstrateAttentionDetail == null) messages.push({ type: MutationMessageType.error, message: 'Please answer question.', arg: '.demonstrateAttentionDetail' })

    return messages
  }
}

export const organization_prompt: PromptDefinition<OrganizationData> = {
  key: 'organization_prompt',
  title: 'Organization',
  description: 'Organization',
  schema: OrganizationSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.describeOrganization == null) messages.push({ type: MutationMessageType.error, message: 'Please answer question.', arg: '.describeAttentionDetail' })

    return messages
  }
}

export const assess_organization_prompt: PromptDefinition<AssessOrganizationData> = {
  key: 'assess_organization_prompt',
  title: 'Assess Organization',
  description: 'Assess Organization',
  schema: AssessOrganizationSchema,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.demonstrateOrganization == null) messages.push({ type: MutationMessageType.error, message: 'Please answer question.', arg: '.demonstrateOrganization' })

    return messages
  }
}
