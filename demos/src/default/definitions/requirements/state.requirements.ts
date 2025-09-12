import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'

export const which_state_req: RequirementDefinition = {
  type: RequirementType.PREQUAL,
  key: 'which_state_req',
  title: 'Applicant provides state of residence.',
  navTitle: 'State',
  description: 'Applicants must tell us which state they live in.',
  promptKeys: ['which_state_prompt'],
  resolve: (data, config) => {
    const state = data.which_state_prompt?.state as string
    if (state == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
