import { createHash } from 'node:crypto'
import { type MutationMessage, MutationMessageType, UploadInfo } from '@txstate-mws/graphql-server'
import { type PromptDefinition, type RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { isEmpty } from 'txstate-utils'

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
  answered: (data, config) => data.haveCatTower != null,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.haveCatTower == null) messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you have a cat tower.', arg: 'haveCatTower' })
    if (data.haveCatTower === false) {
      if (data.willPurchaseCatTower == null) messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you will purchase a cat tower.', arg: 'willPurchaseCatTower' })
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
    getLabel: tag => { return { yes: 'Yes', no: 'No' }[tag] ?? tag },
    useInAppRequestList: 1,
    useInListFilters: 1
  }]
}

export const other_cats_applicant_req: RequirementDefinition<OtherCatsData> = {
  key: 'other_cats_applicant_req',
  type: RequirementType.QUALIFICATION,
  title: 'Other Cats Requirement',
  description: 'If applicant has other cats, they must be vaccinated.',
  promptKeys: ['other_cats_prompt', 'other_cats_vaccines_prompt'],
  resolve: (data, config) => {
    const otherCatsData = data['other_cats_prompt'] as OtherCatsData
    if (otherCatsData?.hasOtherCats == null) return { status: RequirementStatus.PENDING, reason: 'Applicant must indicate whether they have other cats.' }
    if (!otherCatsData.hasOtherCats) return { status: RequirementStatus.NOT_APPLICABLE }
    const vaccinesData = data['other_cats_vaccines_prompt'] as VaccineData
    if (vaccinesData?.distemperDoc && vaccinesData?.rabiesDoc && vaccinesData?.felineLeukemiaDoc && vaccinesData?.felineHIVDoc) {
      return { status: RequirementStatus.MET }
    }
    return { status: RequirementStatus.PENDING, reason: 'Applicant must provide vaccination records for their other cats.' }
  }
}

export interface OtherCatsData {
  hasOtherCats: boolean
}

export const other_cats_prompt: PromptDefinition<OtherCatsData> = {
  key: 'other_cats_prompt',
  title: 'Do you have other cats?',
  description: 'Applicants will indicate whether they have other cats in the household.',
  answered: (data, config) => data.hasOtherCats != null,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.hasOtherCats == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you have other cats.', arg: 'hasOtherCats' })
    }
    return messages
  }
}

interface UploadInfoWithSum extends UploadInfo {
  shasum: string
}

export interface VaccineData {
  distemperDoc: UploadInfoWithSum
  rabiesDoc: UploadInfoWithSum
  felineLeukemiaDoc: UploadInfoWithSum
  felineHIVDoc: UploadInfoWithSum
}

export const other_cats_vaccines_prompt: PromptDefinition<VaccineData> = {
  key: 'other_cats_vaccines_prompt',
  title: 'Other Cats Vaccination Records',
  description: 'Upload vaccination records for other cats in the household.',
  preProcessData: async (appRequest, data, ctx) => {
    const shasums: string[] = []
    for await (const file of ctx.files()) {
      const hash = createHash('sha256')
      for await (const chunk of file.stream) {
        hash.update(chunk)
      }
      shasums[file.multipartIndex] = hash.digest('hex')
    }
    if (data.distemperDoc) data.distemperDoc.shasum = shasums[data.distemperDoc.multipartIndex]
    if (data.rabiesDoc) data.rabiesDoc.shasum = shasums[data.rabiesDoc.multipartIndex]
    if (data.felineLeukemiaDoc) data.felineLeukemiaDoc.shasum = shasums[data.felineLeukemiaDoc.multipartIndex]
    if (data.felineHIVDoc) data.felineHIVDoc.shasum = shasums[data.felineHIVDoc.multipartIndex]
    return data
  },
  answered: (data, config) => {
    return !isEmpty(data?.distemperDoc) && !isEmpty(data?.rabiesDoc) && !isEmpty(data?.felineLeukemiaDoc) && !isEmpty(data?.felineHIVDoc)
  },
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (!data) {
      messages.push({ type: MutationMessageType.warning, message: 'Please upload vaccination records for other cats.', arg: 'other_cats_vaccines' })
    } else {
      if (!data.distemperDoc) messages.push({ type: MutationMessageType.warning, message: 'Please upload distemper vaccination record.', arg: 'distemperDoc' })
      if (!data.rabiesDoc) messages.push({ type: MutationMessageType.warning, message: 'Please upload rabies vaccination record.', arg: 'rabiesDoc' })
      if (!data.felineLeukemiaDoc) messages.push({ type: MutationMessageType.warning, message: 'Please upload feline leukemia vaccination record.', arg: 'felineLeukemiaDoc' })
      if (!data.felineHIVDoc) messages.push({ type: MutationMessageType.warning, message: 'Please upload feline HIV vaccination record.', arg: 'felineHIVDoc' })
    }
    return messages
  }
}

export const other_cats_reviewer_req: RequirementDefinition = {
  key: 'other_cats_reviewer_req',
  type: RequirementType.APPROVAL,
  title: 'Other Cats Reviewer Requirement',
  description: 'Reviewer must assess the vaccination records provided by the applicant.',
  promptKeys: ['other_cats_prompt', 'vaccine_review_prompt'],
  resolve: (data, config) => {
    const otherCatsData = data['other_cats_prompt'] as OtherCatsData
    if (otherCatsData?.hasOtherCats === false) return { status: RequirementStatus.NOT_APPLICABLE }
    const reviewData = data['vaccine_review_prompt'] as VaccineReviewData
    if (!reviewData) return { status: RequirementStatus.PENDING, reason: 'Reviewer must assess all vaccine records.' }
    const keys: (keyof VaccineReviewData)[] = ['distemper', 'rabies', 'felineLeukemia', 'felineHIV']
    for (const key of keys) {
      if (!reviewData[key]) return { status: RequirementStatus.PENDING, reason: 'Reviewer is still assessing vaccine records.' }
      if (!reviewData[key]!.satisfactory) return { status: RequirementStatus.DISQUALIFYING, reason: `The ${key} vaccine record is unsatisfactory.` }
    }
    return { status: RequirementStatus.MET }
  }
}

interface VaccineReview {
  satisfactory: boolean
}
export interface VaccineReviewData {
  distemper: VaccineReview
  rabies: VaccineReview
  felineLeukemia: VaccineReview
  felineHIV: VaccineReview
}

export const vaccine_review_prompt: PromptDefinition<VaccineReviewData> = {
  key: 'vaccine_review_prompt',
  title: 'Vaccine Review',
  description: 'Review the vaccination records for the applicant\'s cats.',
  answered: (data, config) => {
    return data?.distemper?.satisfactory != null && data?.rabies?.satisfactory != null && data?.felineLeukemia?.satisfactory != null && data?.felineHIV?.satisfactory != null
  },
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (!data) {
      messages.push({ type: MutationMessageType.warning, message: 'Please review the vaccination records.', arg: 'vaccineReview' })
    } else {
      if (!data.distemper) messages.push({ type: MutationMessageType.warning, message: 'Please review distemper vaccination record.', arg: 'distemper' })
      if (!data.rabies) messages.push({ type: MutationMessageType.warning, message: 'Please review rabies vaccination record.', arg: 'rabies' })
      if (!data.felineLeukemia) messages.push({ type: MutationMessageType.warning, message: 'Please review feline leukemia vaccination record.', arg: 'felineLeukemia' })
      if (!data.felineHIV) messages.push({ type: MutationMessageType.warning, message: 'Please review feline HIV vaccination record.', arg: 'felineHIV' })
    }
    return messages
  },
  invalidUponChange: data => {
    return data?.distemper?.satisfactory === false || data?.rabies?.satisfactory === false || data?.felineLeukemia?.satisfactory === false || data?.felineHIV?.satisfactory === false
      ? [other_cats_vaccines_prompt.key]
      : []
  },
  validUponChange: data => {
    return data?.distemper?.satisfactory === true && data?.rabies?.satisfactory === true && data?.felineLeukemia?.satisfactory === true && data?.felineHIV?.satisfactory === true
      ? [other_cats_vaccines_prompt.key]
      : []
  }
}
