import { type MutationMessage, MutationMessageType } from '@txstate-mws/graphql-server'
import { type PromptDefinition, type RequirementDefinition, RequirementStatus, RequirementType } from '@txstate-mws/reqquest'

export const cat_tower_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'have_a_cat_tower_req',
  title: 'Applicant must own a cat tower',
  navTitle: 'Cat Tower',
  description: 'Applicants must own a cat tower or be willing to purchase one upon adoption.',
  promptKeys: ['have_a_cat_tower_prompt'],
  resolve: (data, config) => {
    const catTowerData = data['have_a_cat_tower_prompt'] as CatTowerData
    if (catTowerData?.haveCatTower == null) return { status: RequirementStatus.PENDING }
    if (catTowerData.haveCatTower) return { status: RequirementStatus.MET }
    if (catTowerData.willPurchaseCatTower == null) return { status: RequirementStatus.PENDING }
    return catTowerData.willPurchaseCatTower ? { status: RequirementStatus.MET } : { status: RequirementStatus.DISQUALIFYING, reason: 'Must own a cat tower or be willing to purchase one.' }
  }
}

export interface CatTowerData {
  haveCatTower: boolean
  willPurchaseCatTower?: boolean
}

export const have_a_cat_tower_prompt: PromptDefinition<CatTowerData> = {
  key: 'have_a_cat_tower_prompt',
  title: 'Cat Owner Equipment',
  description: 'Applicants will indicate whether they own a cat tower or will purchase one.',
  answered: (data, config) => data.haveCatTower != null && (!!data.haveCatTower || data.willPurchaseCatTower != null),
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.haveCatTower == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you have a cat tower.', arg: 'haveCatTower' })
    } else if (!data.haveCatTower) {
      if (data.willPurchaseCatTower == null) {
        messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you will purchase a cat tower.', arg: 'willPurchaseCatTower' })
      }
    }
    return messages
  }
}

export const not_allergic_to_tuna_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'not_allergic_to_tuna_req',
  title: 'Applicant must not be allergic to tuna',
  navTitle: 'Not Allergic to Tuna',
  description: 'Applicants must not be allergic to the smell of tuna.',
  promptKeys: ['not_allergic_to_tuna_prompt'],
  resolve: (data, config) => {
    const allergyData = data['not_allergic_to_tuna_prompt'] as TunaAllergyData
    if (allergyData?.allergicToTuna == null) return { status: RequirementStatus.PENDING }
    if (allergyData.allergicToTuna) return { status: RequirementStatus.DISQUALIFYING, reason: 'Must not be allergic to tuna.' }
    return { status: RequirementStatus.MET }
  }
}
export interface TunaAllergyData {
  allergicToTuna: boolean
}
export const not_allergic_to_tuna_prompt: PromptDefinition<TunaAllergyData> = {
  key: 'not_allergic_to_tuna_prompt',
  title: 'Tuna Allergy',
  description: 'Applicants will indicate whether they are allergic to tuna.',
  answered: (data, config) => data.allergicToTuna != null,
  validate: (data, config) => {
    const messages = []
    if (data.allergicToTuna == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you are allergic to tuna.', arg: 'allergicToTuna' })
    }
    return messages
  }
}

export const applicant_seems_nice_req: RequirementDefinition = {
  type: RequirementType.APPROVAL,
  key: 'applicant_seems_nice_req',
  title: 'Applicant seems nice',
  navTitle: 'Seems Nice',
  description: 'Applicant has to seem nice if we\'re going to let them have a pet.',
  promptKeys: ['applicant_seems_nice_prompt'],
  resolve: (data, config) => {
    const niceData = data['applicant_seems_nice_prompt'] as NiceData
    if (niceData?.seemsNice == null) return { status: RequirementStatus.PENDING }
    if (niceData.seemsNice) return { status: RequirementStatus.MET }
    return { status: RequirementStatus.DISQUALIFYING, reason: 'Applicant looks kinda mean.' }
  }
}
export interface NiceData {
  seemsNice: boolean
}

export const applicant_seems_nice_prompt: PromptDefinition<NiceData> = {
  key: 'applicant_seems_nice_prompt',
  title: 'Assess Applicant\'s Niceness',
  navTitle: 'Niceness',
  description: 'Reviewer will indicate whether the applicant seems nice.',
  answered: (data, config) => data.seemsNice != null,
  validate: (data, config) => {
    const messages = []
    if (data.seemsNice == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether the applicant seems nice.', arg: 'seemsNice' })
    }
    return messages
  },
  indexes: [{
    category: 'nice',
    extract: data => {
      const niceData = data.applicant_seems_nice_prompt as NiceData | undefined
      return niceData == null ? [] : niceData.seemsNice ? ['yes'] : ['no']
    },
    getLabel: tag => { return { yes: 'yes', no: 'No' }[tag] ?? tag },
    useInAppRequestList: 1,
    useInListFilters: 1
  }]
}
