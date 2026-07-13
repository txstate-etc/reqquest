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
    const preQualPromptData = data['pre_qual_prompt'] as PreQualPromptData

    if (preQualPromptData?.availability == null) return { status: RequirementStatus.PENDING }    
    if (preQualPromptData?.gpa == null) return { status: RequirementStatus.PENDING }
    if (preQualPromptData?.acknowledgeExpectations == null) return { status: RequirementStatus.PENDING }

    if (preQualPromptData.gpa < 2.5) return { status: RequirementStatus.DISQUALIFYING, reason: 'Minimum GPA of 2.5 required' }
    if (!preQualPromptData?.availability) return { status: RequirementStatus.WARNING, reason: 'Not being available 5-10 hours may be a reason for disqualification' }

    return { status: RequirementStatus.MET }
  }
}
