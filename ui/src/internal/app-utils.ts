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