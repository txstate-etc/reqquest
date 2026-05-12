export const excludeAppsByReqTypesAndStatus = (appRequests, requirementType: string[], requirementStatus: string[]) => {
  for (const ar of appRequests){
    for (let x = ar.applications.length - 1; x >= 0; x--){
      const app = ar.applications[x]
      if (app.requirements?.some(r => requirementType.includes(r.type) && requirementStatus.includes(r.status))){
        ar.applications.splice(x, 1)
      }
    }
  }
}
