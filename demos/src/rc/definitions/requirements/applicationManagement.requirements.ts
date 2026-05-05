import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { AssessMaintainSysDocumentationData, AssessSupportCommunicationData, AssessTechincalTroubleshootingData, MaintainSysDocumentationData, SupportCommunicationData, TechincalTroubleshootingData } from '../models'

export const technical_troubleshooting_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'technical_troubleshooting_req',
  title: 'Technical Troubleshooting',
  navTitle: 'Technical Troubleshooting',
  description: 'Technical Troubleshooting',
  promptKeys: ['technical_troubleshooting_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['technical_troubleshooting_prompt'] as TechincalTroubleshootingData
    if (writtenAutomationData?.describeTechincalTroubleshooting == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const assess_technical_troubleshooting_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_technical_troubleshootingn_req',
  title: 'Assess Technical Troubleshooting',
  navTitle: 'Assess Technical Troubleshooting',
  description: 'Assess Technical Troubleshooting ',
  promptKeys: ['assess_technical_troubleshooting_prompt'],
  resolve: (data, config) => {
    const niceData = data['assess_technical_troubleshooting_prompt'] as AssessTechincalTroubleshootingData
    if (niceData?.complexity == null) return { status: RequirementStatus.PENDING }
    if (niceData?.demonstrateTechincalTroubleshooting == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const support_communication_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'support_communication_req',
  title: 'Communication',
  navTitle: 'Communication',
  description: 'Communication',
  promptKeys: ['support_communication_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['support_communication_prompt'] as SupportCommunicationData
    if (writtenAutomationData?.describeSupportCommunication == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const assess_support_communication_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_support_communicationn_req',
  title: 'Assess Communication',
  navTitle: 'Assess Communication',
  description: 'Assess Communication ',
  promptKeys: ['assess_support_communication_prompt'],
  resolve: (data, config) => {
    const niceData = data['assess_support_communication_prompt'] as AssessSupportCommunicationData
    if (niceData?.clarity == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const maintain_sys_documentation_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'maintain_sys_documentation_req',
  title: 'Communication',
  navTitle: 'Communication',
  description: 'Communication',
  promptKeys: ['maintain_sys_documentation_prompt'],
  resolve: (data, config) => {
    const writtenAutomationData = data['maintain_sys_documentation_prompt'] as MaintainSysDocumentationData
    if (writtenAutomationData?.maintainSysDocumentation == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}

export const assess_maintain_sys_documentation_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'assess_maintain_sys_documentation_req',
  title: 'Assess Communication',
  navTitle: 'Assess Communication',
  description: 'Assess Communication ',
  promptKeys: ['assess_maintain_sys_documentation_prompt'],
  resolve: (data, config) => {
    const niceData = data['assess_maintain_sys_documentation_prompt'] as AssessMaintainSysDocumentationData
    if (niceData?.clarity == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
