import { BaseService } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { equal } from 'txstate-utils'
import {
  AppRequestService, ApplicationRequirement, AuthService, Prompt, RequirementPrompt,
  promptRegistry, getRequirementPrompts, ValidatedAppRequestResponse,
  getPeriodPrompts, PeriodPrompt, requirementRegistry,
  AppRequestStatusDB, AppRequest, setRequirementPromptValid, updateAppRequestData,
  getAppRequests, getAppRequestData, appRequestTransaction,
  recordAppRequestActivity, appConfig, AppRequestData, AppRequestStatus, ApplicationPhase,
  ApplicationService, setRequirementPromptsInvalid, AppRequestServiceInternal,
  AppRequestPhase, RequirementType, periodConfigCache
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

const preSubmitTypes = new Set<RequirementType>([
  RequirementType.PREQUAL,
  RequirementType.QUALIFICATION,
  RequirementType.POSTQUAL
])

const reviewTypes = new Set<RequirementType>([
  RequirementType.APPROVAL,
  RequirementType.PREAPPROVAL
])

export class PromptService extends AuthService<Prompt> {
  async find () {
    return promptRegistry.list().map(prompt => new Prompt(prompt))
  }

  protected mayView (prompt: Prompt): boolean {
    return true
  }
}

export class RequirementPromptServiceInternal extends BaseService<RequirementPrompt> {
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
}

export class RequirementPromptService extends AuthService<RequirementPrompt> {
  raw = this.svc(RequirementPromptServiceInternal)

  async findByInternalId (internalId: number) {
    const prompt = await this.raw.findByInternalId(internalId)
    return this.removeUnauthorized(prompt)
  }

  async findById (id: string) {
    return await this.findByInternalId(Number(id))
  }

  async findByAppRequest (appRequest: AppRequest) {
    const prompts = await this.raw.findByAppRequest(appRequest)
    return this.removeUnauthorized(prompts)
  }

  async findByApplicationRequirement (requirement: ApplicationRequirement) {
    const prompts = await this.raw.findByApplicationRequirement(requirement)
    return this.removeUnauthorized(prompts)
  }

  async getPreloadData (requirementPrompt: RequirementPrompt) {
    const [appRequest, data] = await Promise.all([
      this.svc(AppRequestServiceInternal).findByInternalId(requirementPrompt.appRequestInternalId),
      this.svc(AppRequestServiceInternal).getData(requirementPrompt.appRequestInternalId)
    ])
    const allPeriodConfig = await periodConfigCache.get(appRequest!.periodId)
    const config = allPeriodConfig[requirementPrompt.key] ?? {}
    if (data[requirementPrompt.key] == null) return await requirementPrompt.definition.preload?.(appRequest!, config, data, allPeriodConfig, this.ctx)
    return data[requirementPrompt.key]
  }

  async getConfigData (requirementPrompt: RequirementPrompt) {
    const allPeriodConfig = await periodConfigCache.get(requirementPrompt.periodId)
    return allPeriodConfig[requirementPrompt.key]
  }

  async getGatheredConfigData (requirementPrompt: RequirementPrompt) {
    const allPeriodConfig = await periodConfigCache.get(requirementPrompt.periodId)
    const gatherConfig = promptRegistry.get(requirementPrompt.key)?.gatherConfig ?? promptRegistry.get(requirementPrompt.key)?.gatherConfigForApplicant
    return (this.mayViewUnredacted(requirementPrompt) ? gatherConfig?.(allPeriodConfig) : promptRegistry.get(requirementPrompt.key)?.gatherConfigForApplicant?.(allPeriodConfig)) ?? {}
  }

  isOwn (prompt: RequirementPrompt): boolean {
    return prompt.userInternalId === this.user?.internalId
  }

  mayView (prompt: RequirementPrompt): boolean {
    return this.mayViewUnredacted(prompt) || (
      this.isOwn(prompt)
      && prompt.definition.exposeToApplicant != null
      && prompt.appRequestDbPhase !== AppRequestPhase.SUBMITTED
    )
  }

  mayViewUnredacted (prompt: RequirementPrompt): boolean {
    if (this.isOwn(prompt)) {
      if (promptRegistry.isUserPrompt(prompt.key)) return true
      if (!this.hasControl('AppRequest', 'review_own', prompt.appRequestTags)) return false
    }
    return this.hasControl('PromptAnswer', 'view', { ...prompt.authorizationKeys, ...prompt.appRequestTags })
  }

  mayViewForApplicant (prompt: RequirementPrompt) {
    return promptRegistry.isUserPrompt(prompt.key) || (prompt.definition.exposeToApplicant != null && prompt.appRequestDbPhase !== AppRequestPhase.SUBMITTED)
  }

  mayUpdate (prompt: RequirementPrompt): boolean {
    if (prompt.appRequestDbStatus !== AppRequestStatusDB.OPEN) return false
    if (prompt.locked) return false
    if (this.isOwn(prompt)) {
      if (prompt.appRequestDbPhase === AppRequestPhase.STARTED && preSubmitTypes.has(prompt.requirementType)) return true
      if (prompt.appRequestDbPhase === AppRequestPhase.ACCEPTANCE && prompt.requirementType === RequirementType.ACCEPTANCE) return true
      if (!this.hasControl('AppRequest', 'review_own', prompt.appRequestTags)) return false
    }
    const hasUpdate = this.hasControl('PromptAnswer', 'update', { ...prompt.authorizationKeys, ...prompt.appRequestTags })
    const hasUpdateAnytime = this.hasControl('PromptAnswer', 'update_anytime', { ...prompt.authorizationKeys, ...prompt.appRequestTags })
    if (prompt.appRequestDbPhase === AppRequestPhase.SUBMITTED) {
      if (prompt.requirementType === RequirementType.WORKFLOW) {
        if (prompt.workflowStage === prompt.applicationWorkflowStage) {
          return hasUpdate || hasUpdateAnytime
        }
      } else if (preSubmitTypes.has(prompt.requirementType) || reviewTypes.has(prompt.requirementType)) {
        if (prompt.applicationPhase !== ApplicationPhase.REVIEW_COMPLETE) return hasUpdate || hasUpdateAnytime
      }
    } else if (prompt.appRequestDbPhase === AppRequestPhase.ACCEPTANCE) {
      if (prompt.requirementType === RequirementType.ACCEPTANCE) {
        return hasUpdate || hasUpdateAnytime
      }
    } else if (prompt.appRequestDbPhase === AppRequestPhase.STARTED) {
      if (preSubmitTypes.has(prompt.requirementType)) {
        return hasUpdateAnytime
      }
    } else if (prompt.appRequestDbPhase === AppRequestPhase.WORKFLOW_NONBLOCKING) {
      if (prompt.workflowStage === prompt.applicationWorkflowStage) {
        return hasUpdate || hasUpdateAnytime
      }
    }
    return false
  }

  async update (prompt: RequirementPrompt, data: any, validateOnly = false, dataVersion?: number) {
    data ??= {}
    if (!this.mayUpdate(prompt)) throw new Error('You are not allowed to update this prompt.')
    if (!promptRegistry.validate(prompt.key, data)) throw new Error('Invalid prompt data.')
    const response = new ValidatedAppRequestResponse({ success: true })
    const allConfigData = await periodConfigCache.get(prompt.periodId)
    let updated = false
    let savedData: any
    let previousAppRequestStatus: AppRequestStatus | undefined
    let previousAppPhases: Record<string, ApplicationPhase> = {}
    let appRequestData: AppRequestData | undefined
    await appRequestTransaction(prompt.appRequestInternalId, async db => {
      const [[appRequest], [appRequestDataPair]] = await Promise.all([
        getAppRequests({ internalIds: [prompt.appRequestInternalId] }, db),
        getAppRequestData([prompt.appRequestInternalId], db)
      ])
      appRequestData = appRequestDataPair?.data ?? {}
      if (!appRequest) throw new Error('AppRequest not found')
      for (const message of prompt.definition.preValidate?.(data, allConfigData[prompt.key] ?? {}, appRequestData, allConfigData, db) ?? []) response.addMessage(message.message, message.arg, message.type)
      if (response.hasErrors()) return
      const processedData = prompt.definition.preProcessData ? await prompt.definition.preProcessData(data, this.ctx, appRequest, appRequestData, allConfigData, db) : data
      for (const message of prompt.definition.validate?.(processedData, allConfigData[prompt.key] ?? {}, appRequestData, allConfigData, db) ?? []) response.addMessage(message.message, message.arg, message.type)
      if (dataVersion != null && appRequest.dataVersion !== dataVersion) {
        throw new Error('Someone else is working on the same request and made changes since you loaded. Copy any unsaved work into another document and reload the page to see what has changed.')
      }
      if (validateOnly) return
      if (!equal(appRequestData[prompt.key], processedData)) {
        updated = true
        previousAppRequestStatus = appRequest.status
        savedData = appRequestData[prompt.key]
        appRequestData[prompt.key] = processedData
        const promptsToInvalidate = promptRegistry.getInvalidatedPrompts(prompt.key, appRequestData, allConfigData)
        await setRequirementPromptsInvalid(promptsToInvalidate, db)
        await setRequirementPromptValid(prompt, db)
        previousAppPhases = (await updateAppRequestData(appRequest.internalId, appRequestData, dataVersion, db))!
        recordAppRequestActivity(appRequest.internalId, this.user!.internalId, 'Prompt Updated', { data, description: prompt.title }, db)
      }
    })
    this.loaders.clear()
    const updatedAppRequest = (await this.svc(AppRequestService).findByInternalId(prompt.appRequestInternalId))!

    // run hooks
    try {
      if (updated) {
        const applications = await this.svc(ApplicationService).findByAppRequest(updatedAppRequest)
        await appConfig.hooks?.updatePrompt?.(this.ctx, updatedAppRequest, appRequestData!, prompt.key, savedData)
        if (updatedAppRequest.status !== previousAppRequestStatus) {
          await appConfig.hooks?.appRequestStatus?.(this.ctx, updatedAppRequest, previousAppRequestStatus)
        }
        for (const app of applications) {
          if (app.phase !== previousAppPhases[app.programKey]) {
            await appConfig.hooks?.applicationPhase?.(this.ctx, updatedAppRequest, app.programKey, previousAppPhases[app.programKey])
          }
        }
      }
    } catch (err) {
      console.error(err)
    }

    response.success = true
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
    if (prompt.definition.configuration == null) return false
    return this.hasControl('Prompt', 'configure', prompt.authorizationKeys)
  }
}
