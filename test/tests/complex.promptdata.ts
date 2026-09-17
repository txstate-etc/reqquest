import { YardPromptData, PreviousCatOwnerPromptData, CurrentCatOwnerPromptData, PreviousDogOwnerPromptData, OwnerCatAllergyPromptData, OwnerCatMicrochipServiceData, ReviewApplicantCatInfoPromptData, ChildrenPromptData, CurrentDogOwnerPromptData, OwnerDogAllergyPromptData, DogExercisePromptData, ReviewApplicantDogInfoPromptData, ApproveReviewerExerciseExemptionPromptData, PreviousDogSurrenderedPromptData, LivingSpacePromptData, PetOwnerPromptData, ReviewApplicantFosterAPetPromptData, StateResidencePromptData, TermsAndConditionsPromptData, BridgeOfDeathPromptData, ReviewMovieLoverAnswersPromptData, AcceptDogPromptData, AcceptCatPromptData, AcceptFosterPetPromptData, ConfirmCatMicrochipServicePromptData, ReviewStateResidenceInfoPromptData } from '../../demos/src/complex/definitions/models/index.js'

export const promptMapApplicantQualified: Map<string, Map<string, any>> = new Map([
  ['state_residence_prompt', new Map<string, any>([['pass_0', { firstName: 'Jay', lastName: 'Jones', streetAddress: '1234 Dream Rd', emailAddress: 'jay@jones.com', phoneNumber: '8306268846', city: 'San Angelo', state: 'Texas', zipCode: '45324', residentIdDocRequired: false }]])],
  ['petowner_prompt', new Map<string, PetOwnerPromptData>([['pass_0', { previousPetOwner: true, currentPetOwner: true, previousPetCount: 1, currentPetCount: 1, currentPetDetails: 'Own a tabby act' }]])],
  ['previous_catowner_prompt', new Map<string, PreviousCatOwnerPromptData>([['pass_0', { owned: true, details: 'Owned a tabby act' }]])],
  ['current_catowner_prompt', new Map<string, CurrentCatOwnerPromptData>([['pass_0', { owned: true, count: 2, details: 'Chesher and tabby' }]])],
  ['owner_cat_allergy_prompt', new Map<string, OwnerCatAllergyPromptData>([['pass_0', { allergic: false }]])],
  ['owner_cat_microchip_service_prompt', new Map<string, OwnerCatMicrochipServiceData>([['pass_0', { agreeToPay: true }]])],
  ['children_prompt', new Map<string, ChildrenPromptData>([['pass_0', { underMinAge: false }]])],
  ['previous_dogowner_prompt', new Map<string, PreviousDogOwnerPromptData>([['pass_0', { owned: true, details: 'Owned a pitbull' }]])],
  ['current_dogowner_prompt', new Map<string, CurrentDogOwnerPromptData>([['pass_0', { owned: true, count: 1, details: 'Yorkie' }]])],
  ['owner_dog_allergy_prompt', new Map<string, OwnerDogAllergyPromptData>([['pass_0', { allergic: false }]])],
  ['dog_exercise_prompt', new Map<string, DogExercisePromptData>([['pass_0', { agreeToExercise: true }]])],
  ['previous_dog_surrender_prompt', new Map<string, PreviousDogSurrenderedPromptData>([['pass_0', { surrendered: false }]])],
  ['previous_dog_surrender_foster_prompt', new Map<string, PreviousDogSurrenderedPromptData>([['pass_0', { surrendered: false }]])],
  ['living_space_prompt', new Map<string, LivingSpacePromptData>([['pass_0', { sqftLivingSpace: 2500 }]])],
  ['yard_prompt', new Map<string, YardPromptData>([['pass_0', { sqftYardSize: 5000 }]])],
  ['bridge_of_death_prompt', new Map<string, BridgeOfDeathPromptData>([['pass_0', { name: 'Lancelot', quest: 'Seek the Holy Grail!', favoriteColor: 'blue' }]])],
  ['terms_and_conditions_prompt', new Map<string, TermsAndConditionsPromptData>([['pass_0', { agree: true }]])]
])

export const promptMapReviewerQualified: Map<string, Map<string, any>> = new Map([
  ['review_applicant_cat_info_prompt', new Map<string, any>([['pass_0', { previousCatAcceptable: true, currentCatAcceptable: true, livingSpaceAcceptable: true, allergyAcceptable: true, microchipAgree: true }]])],
  ['review_applicant_dog_info_prompt', new Map<string, ReviewApplicantDogInfoPromptData>([['pass_0', { previousDogAcceptable: true, currentDogAcceptable: true, yardAcceptable: true, allergyAcceptable: true, surrenderedAcceptable: true, exerciseMinMet: false, exerciseException: true }]])],
  ['review_applicant_foster_a_pet_info_prompt', new Map<string, ReviewApplicantFosterAPetPromptData>([['pass_0', { underAgeChildrenAcceptable: true }]])],
  ['review_movie_lover_answers_prompt', new Map<string, ReviewMovieLoverAnswersPromptData>([['pass_0', { impressed: true }]])],
  ['review_applicant_state_residence_info_prompt', new Map<string, ReviewStateResidenceInfoPromptData>([['pass_0', { residencyInfoAcceptable: true }]])]
])

export const promptMapApproveReviewerQualified: Map<string, Map<string, any>> = new Map([
  ['approve_reviewer_exercise_exemption_prompt', new Map<string, ApproveReviewerExerciseExemptionPromptData>([['pass_0', { approve: true }]])]
])

/** The qualified reviewer answers, except the cat review denies the applicant - `microchipAgree: false` disqualifies. */
export const promptMapReviewerCatDenied: Map<string, Map<string, any>> = new Map<string, Map<string, any>>([
  ...promptMapReviewerQualified.entries(),
  ['review_applicant_cat_info_prompt', new Map<string, ReviewApplicantCatInfoPromptData>([['fail_0', { previousCatAcceptable: true, currentCatAcceptable: true, livingSpaceAcceptable: true, allergyAcceptable: true, microchipAgree: false }]])]
])

export const promptMapApplicantAcceptance: Map<string, Map<string, any>> = new Map([
  ['accept_dog_prompt', new Map<string, AcceptDogPromptData>([['pass_0', { accept: true, id: 101 }]])],
  ['accept_cat_prompt', new Map<string, AcceptCatPromptData>([['pass_0', { accept: true, id: 1 }]])],
  ['accept_foster_pet_prompt', new Map<string, AcceptFosterPetPromptData>([['pass_0', { accept: true, id: 101 }]])]
])

export const promptMapReviewerNonBlocking: Map<string, Map<string, any>> = new Map([
  ['confirm_cat_microchip_service_prompt', new Map<string, ConfirmCatMicrochipServicePromptData>([['pass_0', { serviceDate: '2026-01-15T10:00:00.000Z', details: 'Chipped at the shelter clinic' }]])]
])

export const promptMapReviewerAllDenied: Map<string, Map<string, any>> = new Map<string, Map<string, any>>([
  ...promptMapReviewerCatDenied.entries(),
  ['review_applicant_dog_info_prompt', new Map<string, ReviewApplicantDogInfoPromptData>([['fail_0', { previousDogAcceptable: true, currentDogAcceptable: true, yardAcceptable: false, allergyAcceptable: true, surrenderedAcceptable: true, exerciseMinMet: false, exerciseException: true }]])]
])
