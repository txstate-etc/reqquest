import { BaseService } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { equal } from 'txstate-utils'
import {
  AppRequestService, ApplicationRequirement, AuthService, Prompt, RequirementPrompt,
  promptRegistry, getRequirementPrompts, ValidatedAppRequestResponse,
  getPeriodPrompts, ConfigurationService, PeriodPrompt, requirementRegistry,
  AppRequestStatusDB, AppRequest, setRequirementPromptValid, updateAppRequestData,
  closedStatuses
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
    return true
  }
}

export class RequirementPromptService extends AuthService<RequirementPrompt> {
  async findByInternalId (internalId: number) {
    const prompt = await this.loaders.get(byInternalIdLoader).load(internalId)
    if (prompt) prompt.appRequestTags = await this.svc(AppRequestService).getTags(prompt.appRequestId)
    return prompt
  }

  async findById (id: string) {
    return await this.findByInternalId(Number(id))
  }

  async findByAppRequest (appRequest: AppRequest) {
    const prompts = await this.loaders.get(byAppRequestInternalIdLoader).load(appRequest.id)
    for (const prompt of prompts) prompt.appRequestTags = appRequest.tags
    return prompts
  }

  async findByApplicationRequirement (requirement: ApplicationRequirement) {
    const prompts = await this.loaders.get(byRequirementIdLoader).load(requirement.id)
    for (const prompt of prompts) prompt.appRequestTags = requirement.appRequestTags
    return prompts
  }

  async getPreloadData (requirementPrompt: RequirementPrompt) {
    const appRequest = (await this.svc(AppRequestService).findByInternalId(requirementPrompt.appRequestInternalId))!
    const data = await this.svc(AppRequestService).getData(requirementPrompt.appRequestInternalId)
    const config = await this.svc(ConfigurationService).getData(appRequest.periodId, requirementPrompt.key)
    if (data[requirementPrompt.definition.key] == null) return await requirementPrompt.definition.preload?.(appRequest, config)
    return data[requirementPrompt.definition.key]
  }

  isOwn (prompt: RequirementPrompt): boolean {
    return prompt.userInternalId === this.user?.internalId
  }

  mayView (prompt: RequirementPrompt): boolean {
    if (this.isOwn(prompt)) {
      if (promptRegistry.isUserPrompt(prompt.key)) return true
      if (!this.hasControl('AppRequest', 'review_own', prompt.appRequestTags)) return false
    }
    return this.hasControl('PromptAnswer', 'view', { ...prompt.authorizationKeys, ...prompt.appRequestTags })
  }

  mayUpdate (prompt: RequirementPrompt): boolean {
    if (closedStatuses.has(prompt.appRequestDbStatus)) return false
    if (this.isOwn(prompt)) {
      if (
        [AppRequestStatusDB.STARTED, AppRequestStatusDB.ACCEPTANCE].includes(prompt.appRequestDbStatus)
        && promptRegistry.isUserPrompt(prompt.key)
      ) {
        return true
      }
      if (!this.hasControl('AppRequest', 'review_own', prompt.appRequestTags)) return false
    }
    if (prompt.appRequestDbStatus === AppRequestStatusDB.SUBMITTED) {
      return this.hasControl('PromptAnswer', 'update', { ...prompt.authorizationKeys, ...prompt.appRequestTags })
    }
    return this.hasControl('PromptAnswer', 'update_anytime', { ...prompt.authorizationKeys, ...prompt.appRequestTags })
  }

  async update (prompt: RequirementPrompt, data: any, validateOnly = false, dataVersion?: number) {
    if (!this.mayUpdate(prompt)) throw new Error('You are not allowed to update this prompt.')
    const response = new ValidatedAppRequestResponse({ success: true })
    const allConfigData = await this.svc(ConfigurationService).getRelatedData(prompt.periodId, prompt.key)
    for (const message of await prompt.definition.validate?.(data, allConfigData[prompt.key] ?? {}, allConfigData) ?? []) response.addMessage(message.message, message.arg, message.type)
    const [appRequest, appRequestData] = await Promise.all([
      this.svc(AppRequestService).findByInternalId(prompt.appRequestInternalId),
      this.svc(AppRequestService).getData(prompt.appRequestInternalId)
    ])
    if (!appRequest) throw new Error('AppRequest not found')
    if (dataVersion != null && appRequest.dataVersion !== dataVersion) {
      throw new Error('Someone else is working on the same request and made changes since you loaded. Copy any unsaved work into another document and reload the page to see what has changed.')
    }
    if (response.hasErrors() || validateOnly) return response
    const newData = prompt.definition.preProcessData ? await prompt.definition.preProcessData(appRequest, data, this.ctx) : data
    if (!equal(appRequestData[prompt.key], newData)) {
      appRequestData[prompt.key] = newData
      await updateAppRequestData(appRequest.internalId, appRequestData, dataVersion)
      this.svc(AppRequestService).recordActivity(appRequest, 'Prompt Updated', { data, description: prompt.title })
    }
    await setRequirementPromptValid(prompt)
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
    return this.hasControl('Prompt', 'view', prompt.authorizationKeys)
  }

  mayConfigure (prompt: PeriodPrompt): boolean {
    if (prompt.definition.validateConfiguration == null) return false
    return this.hasControl('Prompt', 'configure', prompt.authorizationKeys)
  }
}
