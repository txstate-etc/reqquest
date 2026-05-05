import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { PreQualPromptData } from '../models'

export const step1_prequal_req: RequirementDefinition<PreQualPromptData> = {
  type: RequirementType.PREQUAL,
  key: 'step1_prequal_req',
  title: 'Title goes here',
  navTitle: 'Nav title goes here',
  description: 'Pre qualification requirements',
  promptKeys: ['pre_qual_prompt'],
  resolve: (data, config) => {
    console.log(data)
    const preQualPromptData = data['pre_qual_prompt'] as PreQualPromptData

    if (preQualPromptData?.availability == null) return { status: RequirementStatus.PENDING }
    if (preQualPromptData?.gpa == null) return { status: RequirementStatus.PENDING }
    if (preQualPromptData?.acknowledgeExpectations == null) return { status: RequirementStatus.PENDING }

    if (preQualPromptData.gpa < 3.0) return { status: RequirementStatus.DISQUALIFYING }

    return { status: RequirementStatus.MET }
  }
}
