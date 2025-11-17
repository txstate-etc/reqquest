export const promptMapApplicantQualified: Map<string, Map<string, any>> = new Map([
  ['which_state_prompt', new Map<string, any>([['pass_0', { state: 'TX', stateName: 'Texas' }]])],
  ['have_yard_prompt', new Map<string, YardPromptData>([['pass_0', { haveYard: true, squareFootage: 1000, totalPets: 2 }]])],
  ['have_a_cat_tower_prompt', new Map<string, CatTowerPromptData>([['pass_0', { haveCatTower: true }], ['pass_1', { haveCatTower: false, willPurchaseCatTower: true }]])],
  ['not_allergic_to_tuna_prompt', new Map<string, TunaAllergyPromptData>([['pass_0', { allergicToTuna: false }]])],
  ['must_exercise_your_dog_prompt', new Map<string, ExercisePromptData>([['pass_0', { exerciseHours: 10 }]])],
  ['other_cats_prompt', new Map<string, OtherCatsPromptData>([['pass_0', { hasOtherCats: false }]])]
])

export const promptMapReviewerQualified: Map<string, Map<string, any>> = new Map([
  ['applicant_seems_nice_prompt', new Map<string, NicePromptData>([['pass_0', { seemsNice: true }]])]
])