import { BaseService } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import {
  AppRequestService, ApplicationRequirement, AuthService, Prompt, RequirementPrompt,
  promptRegistry, getRequirementPrompts, AppRequestServiceInternal, ValidatedAppRequestResponse,
  getPeriodPrompts, ConfigurationService, PeriodPrompt, requirementRegistry
} from '../internal.js'

const byInternalIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: number[]) => {
    return await getRequirementPrompts({ ids: ids.map(String) })
  },
  extractId: (row: RequirementPrompt) => row.internalId
})
const byRequirementIdLoader = new OneToManyLoader({
  fetch: async (requirementIds: string[]) => {
    return await getRequirementPrompts({ requirementIds })
  },
  extractKey: row => row.requirementId,
  idLoader: byInternalIdLoader
})

const byAppRequestInternalIdLoader = new OneToManyLoader({
  fetch: async (appRequestIds: string[]) => {
    return await getRequirementPrompts({ appRequestIds })
  },
  extractKey: (row: RequirementPrompt) => row.appRequestId,
  idLoader: [byInternalIdLoader]
})

const periodPromptByPeriodIdAndPromptKeyLoader = new PrimaryKeyLoader({
  fetch: async (periodPromptKeys: { periodId: string, promptKey: string }[]) => {
    return await getPeriodPrompts({ periodPromptKeys })
  },
  extractId: row => ({ periodId: row.periodId, promptKey: row.key })
})

const periodPromptByPeroidIdLoader = new OneToManyLoader({
  fetch: async (periodIds: string[]) => {
    return await getPeriodPrompts({ periodIds })
  },
  extractKey: row => row.periodId,
  idLoader: periodPromptByPeriodIdAndPromptKeyLoader
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
    return await this.loaders.get(byRequirementIdLoader).load(requirement.id)
  }

  async findByAppRequestAndKey (appRequestId: string, key: string) {
    const prompts = await this.findByAppRequestId(appRequestId)
    return prompts.filter(prompt => prompt.key === key)
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
    return this.hasControl('PromptAnswer', 'update', { Prompt: [prompt.key], Requirement: [prompt.requirementKey], Program: [prompt.programKey], ...prompt.appRequestTags })
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

  async findByPeriodIdAndRequirementKey (periodId: string, requirementKey: string) {
    const prompts = await this.findByPeriodId(periodId)
    const reqDef = requirementRegistry.get(requirementKey)
    return prompts.filter(prompt => reqDef.promptKeySet.has(prompt.key)).map(prompt => new PeriodPrompt(periodId, prompt.key))
  }

  async findByPeriodIdAndPromptKey (periodId: string, promptKey: string) {
    return this.removeUnauthorized(await this.loaders.get(periodPromptByPeriodIdAndPromptKeyLoader).load({ periodId, promptKey }))
  }

  mayView (prompt: PeriodPrompt) {
    return this.hasControl('Prompt', 'view', { Prompt: [prompt.key] }) // TODO: add requirementKeys and programKeys that include this prompt
  }

  mayConfigure (prompt: Prompt): boolean {
    if (prompt.definition.validateConfiguration == null) return false
    return this.hasControl('Prompt', 'configure', { Prompt: [prompt.key] }) // TODO: add requirementKeys and programKeys that include this prompt
  }
}
