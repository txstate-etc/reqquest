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
