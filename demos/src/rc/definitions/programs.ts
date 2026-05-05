import type { ProgramDefinition } from '@reqquest/api'

export const operationsInfrastructure: ProgramDefinition = {
  key: 'operations_infrastructure',
  title: 'Operations & Infrastructure',
  requirementKeys: [
    'step1_prequal_req',
    'written_automation_req',
    'evidence_automation_req',
    'investigated_future_career_req',
    'rate_future_career_req',
    'reccomendation_letter_req',
    'assess_reccomendation_lettern_req'
  ]
}
export const softwareDevelopment: ProgramDefinition = {
  key: 'software_development',
  title: 'Software Development',
  requirementKeys: [
    'step1_prequal_req',
    'data_related_puzzle_req',
    'assess_data_related_puzzle_req',
    'outside_class_example_req',
    'assess_outside_class_example_req',
    'critical_thinking_req',
    'assess_critical_thinking_req',
    'reccomendation_letter_req',
    'assess_reccomendation_lettern_req'
  ]
}
export const projectManagement: ProgramDefinition = {
  key: 'project_management',
  title: 'Project Management',
  requirementKeys: [
    'step1_prequal_req',
    'communication_req',
    'assess_communicationn_req',
    // 'attention_detail_req',
    'assess_attention_detail_req',
    'organization_req',
    'assess_organization_req',
    'reccomendation_letter_req',
    'assess_reccomendation_lettern_req'
  ]
}
export const applicationManagement: ProgramDefinition = {
  key: 'application_management_support',
  title: 'Application Management & Support',
  requirementKeys: [
    'step1_prequal_req',
    'technical_troubleshooting_req',
    'assess_technical_troubleshootingn_req',
    'support_communication_req',
    'assess_support_communicationn_req',
    'maintain_sys_documentation_req',
    'assess_maintain_sys_documentation_req',
    'reccomendation_letter_req',
    'assess_reccomendation_lettern_req'
  ]
}
