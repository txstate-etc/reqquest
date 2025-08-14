import { YardData } from '../../testserver/src/definitions/yard.js'
import { CatTowerData, TunaAllergyData, NiceData } from '../../testserver/src/definitions/cat.js'
import { ExerciseData } from '../../testserver/src/definitions/exercise.js'

export const promptMapPass: Map<string, Map<string, any>> = new Map([
  ['which_state_prompt', new Map<string, any>([['pass_0', { state: 'TX' }]])],
  ['have_yard_prompt', new Map<string, YardData>([['pass_0', { haveYard: true, squareFootage: 1000, totalPets: 2 }]])],
  ['have_a_cat_tower_prompt', new Map<string, CatTowerData>([['pass_0', { haveCatTower: true }], ['pass_1', { haveCatTower: false, willPurchaseCatTower: true }]])],
  ['not_allergic_to_tuna_prompt', new Map<string, TunaAllergyData>([['pass_0', { allergicToTuna: false }]])],
  ['must_exercise_your_dog_prompt', new Map<string, ExerciseData>([['pass_0', { exerciseHours: 10 }]])],
  ['applicant_seems_nice_prompt', new Map<string, NiceData>([['pass_0', { seemsNice: true }]])]
])

export const promptMapFail: Map<string, Map<string, any>> = new Map([
  ['which_state_prompt', new Map<string, any>([['fail_0', { state: 'TT' }]])],
  ['have_yard_prompt', new Map<string, YardData>([['fail_0', { haveYard: false }]])],
  ['have_a_cat_tower_prompt', new Map<string, CatTowerData>([['fail_0', { haveCatTower: false, willPurchaseCatTower: false }]])],
  ['not_allergic_to_tuna_prompt', new Map<string, TunaAllergyData>([['fail_0', { allergicToTuna: true }]])],
  ['must_exercise_your_dog_prompt', new Map<string, ExerciseData>([['fail_0', { exerciseHours: 1 }]])],
  ['applicant_seems_nice_prompt', new Map<string, NiceData>([['fail_0', { seemsNice: false }]])]
])
