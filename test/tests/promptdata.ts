import { YardData } from '../../testserver/src/definitions/yard.js'
import { CatTowerData } from '../../testserver/src/definitions/cat.js'

export const promptMapPass: Map<string, Map<string, any>> = new Map([
  ['which_state_prompt', new Map<string, any>([['pass_0', { state: 'TX' }]])],
  ['have_yard_prompt', new Map<string, YardData>([['pass_0', { haveYard: true, squareFootage: 1000, totalPets: 2 }]])],
  ['have_a_cat_tower_prompt', new Map<string, CatTowerData>([['pass_0', { haveCatTower: true }], ['pass_1', { haveCatTower: false, willPurchaseCatTower: true }]])]
])

export const promptMapFail: Map<string, Map<string, any>> = new Map([
  ['which_state_prompt', new Map<string, any>([['fail_0', { state: null }]])],
  ['have_yard_prompt', new Map<string, YardData>([['fail_0', { haveYard: false }]])],
  ['have_a_cat_tower_prompt', new Map<string, CatTowerData>([['fail_0', { haveCatTower: false, willPurchaseCatTower: false }]])]
])
