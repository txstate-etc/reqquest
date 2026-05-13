import { enumApplicationPhase } from "../lib"

export const excludeAppsByIneligibiltyPhase = (appRequests: any[], phase: typeof enumApplicationPhase[]) => {
  const appRequestsSansIneligibleApps: any[] = []
  for (const ar of appRequests){
    appRequestsSansIneligibleApps.push({
      ...ar,
      applications: ar.applications.filter(app => !phase.includes(app.ineligiblePhase))
    })
  }
  return appRequestsSansIneligibleApps
}

