import { type PromptDefinition } from '@reqquest/api'
import { CatTowerPromptData, CatTowerPromptSchema, NicePromptData, NicePromptSchema, OtherCatsPromptData, OtherCatsPromptSchema, TunaAllergyPromptData, TunaAllergyPromptSchema, VaccinePromptData, VaccinePromptSchema, VaccineReviewPromptData, VaccineReviewPromptSchema } from './cat.models.js'
import { type MutationMessage, MutationMessageType, UploadInfo } from '@txstate-mws/graphql-server'
import { createHash } from 'node:crypto'
import { isEmpty } from 'txstate-utils'

export const have_a_cat_tower_prompt: PromptDefinition<CatTowerPromptData> = {
  key: 'have_a_cat_tower_prompt',
  title: 'Cat Owner Equipment',
  description: 'Applicants will indicate whether they own a cat tower or will purchase one.',
  schema: CatTowerPromptSchema,
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

export const not_allergic_to_tuna_prompt: PromptDefinition<TunaAllergyPromptData> = {
  key: 'not_allergic_to_tuna_prompt',
  title: 'Tuna Allergy',
  description: 'Applicants will indicate whether they are allergic to tuna.',
  schema: TunaAllergyPromptSchema,
  answered: (data, config) => data.allergicToTuna != null,
  validate: (data, config) => {
    const messages = []
    if (data.allergicToTuna == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you are allergic to tuna.', arg: 'allergicToTuna' })
    }
    return messages
  }
}

export const applicant_seems_nice_prompt: PromptDefinition<NicePromptData> = {
  key: 'applicant_seems_nice_prompt',
  title: 'Assess Applicant\'s Niceness',
  navTitle: 'Niceness',
  description: 'Reviewer will indicate whether the applicant seems nice.',
  schema: NicePromptSchema,
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
      const niceData = data.applicant_seems_nice_prompt as NicePromptData | undefined
      return niceData == null ? [] : niceData.seemsNice ? ['yes'] : ['no']
    },
    getLabel: tag => { return { yes: 'Yes', no: 'No' }[tag] ?? tag },
    useInAppRequestList: 1,
    useInListFilters: 1
  }]
}

export const other_cats_prompt: PromptDefinition<OtherCatsPromptData> = {
  key: 'other_cats_prompt',
  title: 'Do you have other cats?',
  description: 'Applicants will indicate whether they have other cats in the household.',
  schema: OtherCatsPromptSchema,
  answered: (data, config) => data.hasOtherCats != null,
  validate: (data, config) => {
    const messages: MutationMessage[] = []
    if (data.hasOtherCats == null) {
      messages.push({ type: MutationMessageType.warning, message: 'Please indicate whether you have other cats.', arg: 'hasOtherCats' })
    }
    return messages
  }
}

export const other_cats_vaccines_prompt: PromptDefinition<VaccinePromptData> = {
  key: 'other_cats_vaccines_prompt',
  title: 'Other Cats Vaccination Records',
  description: 'Upload vaccination records for other cats in the household.',
  schema: VaccinePromptSchema,
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

export const vaccine_review_prompt: PromptDefinition<VaccineReviewPromptData> = {
  key: 'vaccine_review_prompt',
  title: 'Vaccine Review',
  description: 'Review the vaccination records for the applicant\'s cats.',
  schema: VaccineReviewPromptSchema,
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
