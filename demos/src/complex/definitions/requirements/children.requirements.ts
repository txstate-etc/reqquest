import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { ChildrenPromptData, ChildrenRequirementConfigSchema } from '../models/index.js'

// TODO: Need to Complete
export const children_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'children_qual_req',
  title: 'Provide current young children info',
  navTitle: 'Young children info',
  description: 'Provide current young children info',
  promptKeys: ['children_prompt'],
  resolve: (data, config) => {
    const childrenPromptData = data.current_catowner_prompt as ChildrenPromptData
    if (childrenPromptData == null) return { status: RequirementStatus.PENDING }     
    if (!childrenPromptData.underMinAge) { 
      return { status: RequirementStatus.MET }
    } else {
      if (childrenPromptData.count == null) return { status: RequirementStatus.PENDING }
      if (childrenPromptData.count >= config.maxCount ) return { status: RequirementStatus.WARNING, reason: "Too many cats currently, waivers available case-by-case" }
      return { status: RequirementStatus.MET }
    }    
  },
  configuration: {
    schema: ChildrenRequirementConfigSchema,
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.minAge == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the minimum permisible age of children in the home.', arg: 'minAge' })
      }
      return messages
    },
    default: { minAge: 6 }
  } 
}