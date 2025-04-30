import { BaseService, Context } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { AppRequestService, ApplicationRequirement, AuthService, Prompt, RequirementPrompt, promptRegistry, getRequirementPrompts, AppRequestServiceInternal, ValidatedAppRequestResponse, getPeriodPrompts, ConfigurationService, PeriodPrompt } from '../internal.js'

const byInternalIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: number[]) => {
    return await getRequirementPrompts({ ids: ids.map(String) })
  },
  extractId: (row: RequirementPrompt) => row.internalId
})
const byRequirementKeyLoader = new PrimaryKeyLoader({
  fetch: async (keys: { appRequestInternalId: number, promptKey: string }[]) => {
    return await getRequirementPrompts({ appRequestIds: keys.map(k => k.appRequestInternalId).map(String), promptKeys: keys.map(k => k.promptKey) })
  },
  extractId: (row: RequirementPrompt) => ({ appRequestInternalId: row.appRequestInternalId, promptKey: row.definition.key }),
  idLoader: byInternalIdLoader
})
byInternalIdLoader.addIdLoader(byRequirementKeyLoader)

const byAppRequestInternalIdLoader = new OneToManyLoader({
  fetch: async (appRequestIds: string[], filters: undefined, ctx: Context) => {
    return await getRequirementPrompts({ appRequestIds })
  },
  extractKey: (row: RequirementPrompt) => row.appRequestId,
  idLoader: [byInternalIdLoader, byRequirementKeyLoader]
})

const periodPromptByPeroidIdLoader = new OneToManyLoader({
  fetch: async (periodIds: string[], filters: undefined, ctx: Context) => {
    return await getPeriodPrompts({ periodIds })
  },
  extractKey: row => row.periodId
})

export class PromptServiceInternal extends BaseService<Prompt> {

}

export class PromptService extends AuthService<Prompt> {
  raw = this.svc(PromptServiceInternal)

  async find () {
    return promptRegistry.list().map(prompt => new Prompt(prompt))
  }

  protected mayView (prompt: Prompt): boolean {
    return true // TODO
  }
}

export class RequirementPromptService extends AuthService<RequirementPrompt> {
  async findByInternalId (internalId: number) {
    return await this.loaders.get(byInternalIdLoader).load(internalId)
  }

  async findById (id: string) {
    return await this.findByInternalId(Number(id))
  }

  async findByAppRequestId (appRequestId: string) {
    return await this.loaders.get(byAppRequestInternalIdLoader).load(appRequestId)
  }

  async findByApplicationRequirement (requirement: ApplicationRequirement) {
    return await this.loaders.loadMany(byRequirementKeyLoader, requirement.definition.promptKeys?.map(promptKey => ({ appRequestInternalId: requirement.appRequestInternalId, promptKey })) ?? [])
  }

  async getPreloadData (requirementPrompt: RequirementPrompt) {
    const appRequest = (await this.svc(AppRequestService).findByInternalId(requirementPrompt.appRequestInternalId))!
    const data = await this.svc(AppRequestService).getData(requirementPrompt.appRequestInternalId)
    const config = await this.svc(ConfigurationService).getData(appRequest.periodId, requirementPrompt.key)
    if (data[requirementPrompt.definition.key] == null) return await requirementPrompt.definition.preload?.(appRequest, config)
    return data[requirementPrompt.definition.key]
  }

  mayView (prompt: RequirementPrompt): boolean {
    // may view if the prompt is for the applicant and current user is the applicant
    // if (prompt.request.userInternalId === this.userInternalId && promptRegistry.isUserPrompt(prompt.key)) return true
    // TODO: may view if the user has been granted access to view the prompt

    return false
  }

  mayUpdate (prompt: RequirementPrompt): boolean {
    // may update if the prompt is for the applicant and current user is the applicant
    if (prompt.userInternalId === this.user?.internalId && promptRegistry.isUserPrompt(prompt.key)) return true
    // TODO: support tags on AppRequest, have to load them before this function is called
    // so we can keep it synchronous
    return this.hasControl('Prompt', 'update', prompt.key)
  }

  async update (prompt: RequirementPrompt, data: any, validateOnly = false) {
    if (!this.mayUpdate(prompt)) throw new Error('You are not allowed to update this prompt.')
    const response = new ValidatedAppRequestResponse({ success: true })
    const config = await this.svc(ConfigurationService).getData(prompt.periodId, prompt.key)
    for (const message of await prompt.definition.validate?.(data, config) ?? []) response.addMessage(message.message, message.arg, message.type)
    if (response.hasErrors() || validateOnly) return response
    const [appRequest, appRequestData] = await Promise.all([
      this.svc(AppRequestService).findByInternalId(prompt.appRequestInternalId),
      this.svc(AppRequestService).getData(prompt.appRequestInternalId)
    ])
    if (!appRequest) throw new Error('AppRequest not found')
    appRequestData[prompt.key] = prompt.definition.preProcessData ? await prompt.definition.preProcessData(appRequest, data, this.ctx) : data
    await this.svc(AppRequestServiceInternal).updateData(appRequest, appRequestData)
    this.loaders.clear()
    const updatedAppRequest = (await this.svc(AppRequestService).findByInternalId(appRequest.internalId))!
    response.appRequest = updatedAppRequest
    return response
  }
}

export class PeriodPromptService extends AuthService<Prompt> {
  async findByPeriodId (periodId: string) {
    return this.removeUnauthorized(await this.loaders.get(periodPromptByPeroidIdLoader).load(periodId))
  }

  mayView (prompt: PeriodPrompt) {
    return this.hasControl('Prompt', 'view_configuration', prompt.key)
  }

  mayConfigure (prompt: Prompt): boolean {
    return this.hasControl('Prompt', 'configure', prompt.key)
  }
}
