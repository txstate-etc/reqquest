import { PreviousCatOwnerPromptData, CurrentCatOwnerPromptData, PreviousDogOwnerPromptData, OwnerCatAllergyPromptData, OwnerCatMicrochipServiceData, ReviewApplicantCatInfoPromptData, ChildrenPromptData, CurrentDogOwnerPromptData } from '../../demos/src/complex/definitions/models/index.js'

export const promptMapApplicantQualified: Map<string, Map<string, any>> = new Map([
  ['previous_catowner_prompt', new Map<string, any>([['pass_0', { owned: true, details: 'Owned a tabby act' }]])],
  ['current_catowner_prompt', new Map<string, CurrentCatOwnerPromptData>([['pass_0', { owned: true, count: 2, details: 'Chesher and tabby' }]])],
  ['owner_cat_allergy_prompt', new Map<string, OwnerCatAllergyPromptData>([['pass_0', { allergic: false }]])],
  ['owner_cat_microchip_service_prompt', new Map<string, OwnerCatMicrochipServiceData>([['pass_0', { agreeToPay: true }]])],
  ['children_prompt', new Map<string, ChildrenPromptData>([['pass_0', { underMinAge: false }]])],
  ['previous_dogowner_prompt', new Map<string, PreviousDogOwnerPromptData>([['pass_0', { owned: true, details: 'Owned a pitbull' }]])],
  ['current_dogowner_prompt', new Map<string, CurrentDogOwnerPromptData>([['pass_0', { owned: true, count: 1, details: 'Yorkie' }]])],
  
])

export const promptMapReviewerQualified: Map<string, Map<string, any>> = new Map([
  ['review_applicant_cat_info_prompt', new Map<string, ReviewApplicantCatInfoPromptData>([['pass_0', { previousCatAcceptable: true, currentCatAcceptable: true, livingSpaceAcceptable: true, allergyAcceptable: true, microchipAgree: true }]])],

])