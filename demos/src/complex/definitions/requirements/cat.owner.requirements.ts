import { type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { CurrentCatOwnerPromptData, CurrentCatOwnerRequirementConfigSchema, OwnerCatAllergyPromptData, OwnerCatMicrochipServiceData, PreviousCatOwnerPromptData } from '../models/index.js'

export const previous_catowner_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'previous_catowner_qual_req',
  title: 'Provide previous cat owner info',
  navTitle: 'Previous cat owner info',
  description: 'Provide previous cat owner information',
  promptKeys: ['previous_catowner_prompt'],
  resolve: (data, config) => {
    const catOwnerPromptData = data.previous_catowner_prompt as PreviousCatOwnerPromptData
    if (catOwnerPromptData?.owned != null) {
      if (catOwnerPromptData.owned === false) {
        return { status: RequirementStatus.WARNING, reason: 'Previous cat ownership is usually required.  Exceptions on a case by case basis.' }
      } else { 
        return { status: RequirementStatus.MET }
      }
    }
    return { status: RequirementStatus.PENDING }
  }
}


export const current_catowner_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'current_catowner_qual_req',
  title: 'Provide current cat owner info',
  navTitle: 'Current cat owner info',
  description: 'Provide current cat owner information',
  promptKeys: ['current_catowner_prompt'],
  resolve: (data, config) => {
    const catOwnerPromptData = data.current_catowner_prompt as CurrentCatOwnerPromptData
    if (catOwnerPromptData == null) return { status: RequirementStatus.PENDING }     
    if (!catOwnerPromptData.owned) { 
      return { status: RequirementStatus.MET }
    } else {
      if (catOwnerPromptData.count == null) return { status: RequirementStatus.PENDING }
      if (catOwnerPromptData.count >= config.maxCount ) return { status: RequirementStatus.WARNING, reason: "Too many cats currently, waivers available case-by-case" }
      return { status: RequirementStatus.MET }
    }    
  },
  configuration: {
    schema: CurrentCatOwnerRequirementConfigSchema,
    validate: config => {
      const messages: MutationMessage[] = []
      if (config.maxCount == null) {
        messages.push({ type: MutationMessageType.error, message: 'Please specify the maximum number of cats permitted in the home.', arg: 'maxCount' })
      }
      return messages
    },
    default: { maxCount: 3 }
  } 
}

export const owner_cat_allergy_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'owner_cat_allergy_qual_req',
  title: 'Provide cat allergy info ',
  navTitle: 'Owner cat allergies',
  description: 'Provide owner cat allergy information',
  promptKeys: ['owner_cat_allergy_prompt'],
  resolve: (data, config) => {
    const catOwnerPromptData = data.owner_cat_allergy_prompt as OwnerCatAllergyPromptData
    if (catOwnerPromptData == null) return { status: RequirementStatus.PENDING }
    if (catOwnerPromptData.allergic) {
      return { status: RequirementStatus.WARNING, reason: 'We reserve the right to deny applications with known allergies (based on years of consistently high return rates).' }
    } else { 
      return { status: RequirementStatus.MET }
    }    
  }
}

export const owner_cat_microchip_service_qual_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'owner_cat_microchip_service_qual_req',
  title: 'Microchip service',
  navTitle: 'Microchip service',
  description: 'Applicant will pay for microchip service',
  promptKeys: ['owner_cat_microchip_service_prompt'],
  resolve: (data, config) => {
    const catOwnerPromptData = data.owner_cat_microchip_service_prompt as OwnerCatMicrochipServiceData
    if (catOwnerPromptData == null) return { status: RequirementStatus.PENDING }
    if (!catOwnerPromptData.agreeToPay) {
      return { status: RequirementStatus.WARNING, reason: 'We reserve the right to deny applications who do not agree to cover microchipping costs.' }
    } else { 
      return { status: RequirementStatus.MET }
    }    
  }
}