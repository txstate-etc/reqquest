import type { FieldUploadPreload } from '@txstate-mws/carbon-svelte'

export interface YardData {
  haveYard: boolean
  squareFootage?: number
  totalPets?: number
}

export interface TunaAllergyData {
  allergicToTuna: boolean
}

export interface CatTowerData {
  haveCatTower?: boolean
  willPurchaseCatTower?: boolean
}

export interface NiceData {
  seemsNice: boolean
}

export interface ExerciseData {
  exerciseHours: number
}

export interface ExerciseConfig {
  minExerciseHours: number
}

export interface StateData {
  state: string
  stateName: string
}

export interface OtherCatsData {
  hasOtherCats: boolean
}

export interface VaccineData {
  distemperDoc: FieldUploadPreload
  rabiesDoc: FieldUploadPreload
  felineLeukemiaDoc: FieldUploadPreload
  felineHIVDoc: FieldUploadPreload
}

export interface VaccineReviewData {
  distemper: { satisfactory: boolean }
  rabies: { satisfactory: boolean }
  felineLeukemia: { satisfactory: boolean }
  felineHIV: { satisfactory: boolean }
}
