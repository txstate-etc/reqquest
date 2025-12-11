import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { TermsAndConditionsPromptData } from '../models'

export const terms_and_conditions_post_qual_req: RequirementDefinition<TermsAndConditionsPromptData> = {
  type: RequirementType.POSTQUAL,
  key: 'terms_and_conditions_post_qual_req',
  title: 'Terms and conditions',
  navTitle: 'Terms and conditions',
  description: 'Agree to terms and conditions to continue submission',
  promptKeys: ['terms_and_conditions_prompt'],
  resolve: (data, config) => {
    const tAndCPromptData = data.terms_and_conditions_prompt as TermsAndConditionsPromptData
    if (tAndCPromptData == null) return { status: RequirementStatus.PENDING }
    if (!tAndCPromptData.agree) return { status: RequirementStatus.DISQUALIFYING, reason: 'Agreeing to terms and conditions is required.' }
    return { status: RequirementStatus.MET }
  }
}
