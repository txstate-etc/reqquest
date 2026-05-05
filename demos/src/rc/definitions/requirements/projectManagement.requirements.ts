import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { AssessAttentionDetailData, AssessCommunicationData, AssessOrganizationData, AttentionDetailData, CommunicationData, OrganizationData } from '../models'

export const communication_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'communication_req',
  title: 'Communication',
  navTitle: 'Communication',
  description: 'Communication',
  promptKeys: ['communication_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['communication_prompt'] as CommunicationData
    console.log(writtenAutomationData, '🚀🚀🚀🚀🚀🚀')
    if (writtenAutomationData?.describeCommunication == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const assess_communicationn_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_communicationn_req',
  title: 'Assess Communication',
  navTitle: 'Assess Communication',
  description: 'Assess Communication ',
  promptKeys: ['assess_communication_prompt'],
  resolve: (data, config) => {
    const niceData = data['assess_communication_prompt'] as AssessCommunicationData
    if (niceData?.demonstrateCommunication == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

// export const attention_detail_req: RequirementDefinition = {
//   type: RequirementType.QUALIFICATION,
//   key: 'attention_detail_req',
//   title: 'Attention to deatil',
//   navTitle: 'Attention to deatil',
//   description: 'Attention to deatil',
//   promptKeys: ['attention_detail_prompt'],
//   resolve: (data, config) => {
//     const writtenAutomationData = data['attention_detail_prompt'] as AttentionDetailData
//     return { status: RequirementStatus.MET }
//   }
// }

export const assess_attention_detail_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_attention_detail_req',
  title: 'Assess Attention to deatil',
  navTitle: 'Assess Attention to deatil',
  description: 'Assess Attention to deatil',
  promptKeys: ['assess_attention_detail_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['assess_attention_detail_prompt'] as AssessAttentionDetailData
    if (writtenAutomationData?.demonstrateAttentionDetail == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const organization_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'organization_req',
  title: 'Organization',
  navTitle: 'Organization',
  description: 'Organization',
  promptKeys: ['organization_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['organization_prompt'] as OrganizationData
    if (writtenAutomationData?.describeOrganization == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const assess_organization_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_organization_req',
  title: 'Assess Organization',
  navTitle: 'Assess Organization',
  description: 'Assess Organization',
  promptKeys: ['assess_organization_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['assess_organization_prompt'] as AssessOrganizationData
    if (writtenAutomationData?.demonstrateOrganization == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
