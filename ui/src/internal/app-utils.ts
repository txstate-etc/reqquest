export const getAppIdsWithSharedPrompts = (appRequest, application) => {
  const appsWithSharedPrompts: any[] = []  
  for (const app of appRequest.applications) {
    if (app.id == application.id) continue
    const sharedPrompts = app.requirements.flatMap(req => req.prompts.filter(prompt => application.requirements.some(r => r.prompts.some(p => p.key === prompt.key))))
    if (sharedPrompts.length > 0) {
      appsWithSharedPrompts.push(app)
    }
  }
  return appsWithSharedPrompts
}

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
