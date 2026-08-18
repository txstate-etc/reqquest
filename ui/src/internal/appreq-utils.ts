import { enumApplicationPhase } from "../lib"
type PhaseKey = keyof typeof enumApplicationPhase
export const excludeAppsByIneligibiltyPhase = (appRequests: any[], phase: PhaseKey[]) => {
  const appRequestsSansIneligibleApps: any[] = []
  for (const ar of appRequests){
    appRequestsSansIneligibleApps.push({
      ...ar,
      applications: ar.applications.filter(app => !phase.includes(app.ineligiblePhase))
    })
  }
  return appRequestsSansIneligibleApps
}

