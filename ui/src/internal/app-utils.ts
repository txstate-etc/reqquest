import { enumApplicationPhase } from "../lib"

export const excludeAppsByIneligibiltyPhase = (appRequests: any, phase: typeof enumApplicationPhase[]) => {
  for (const ar of appRequests){
    for (let x = ar.applications.length - 1; x >= 0; x--){
      const app = ar.applications[x]
      if (phase.includes(app.ineligiblePhase)){
        ar.applications.splice(x, 1)
      }
    }
  }
}
