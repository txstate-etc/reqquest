import { BaseService } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { equal, Cache } from 'txstate-utils'
import {
  AppRequestService, ApplicationRequirement, AuthService, Prompt, RequirementPrompt, promptRegistry,
  getRequirementPrompts, ValidatedAppRequestResponse, getPeriodPrompts, PeriodPrompt,
  requirementRegistry, AppRequestStatusDB, AppRequest, updateAppRequestData, getAppRequests,
  getAppRequestData, appRequestTransaction, recordAppRequestActivity, appConfig, AppRequestData,
  AppRequestStatus, ApplicationPhase, ApplicationService, setRequirementPromptsInvalid,
  AppRequestServiceInternal, AppRequestPhase, RequirementType, periodConfigCache, programRegistry,
  statusVisibleToApplicantPhases, applicantRequirementTypes, setRequirementPromptsValid,
  RQContext,
  RequirementPromptFilter,
  PromptPreStagingRecurrence
} from '../internal.js'

const byInternalIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: number[]) => {
    return await getRequirementPrompts({ ids: ids.map(String) })
  },
  extractId: (row: RequirementPrompt) => row.internalId
})

const byRequirementIdLoader = new OneToManyLoader({
  fetch: async (requirementIds: string[], filters?: RequirementPromptFilter) => {
    return await getRequirementPrompts({ ...filters, requirementIds })
  },
  extractKey: row => row.requirementId,
  idLoader: byInternalIdLoader
})

const byAppRequestInternalIdLoader = new OneToManyLoader({
  fetch: async (appRequestIds: string[], filters?: RequirementPromptFilter) => {
    return await getRequirementPrompts({ ...filters, appRequestIds })
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

  async findByAppRequest (appRequest: AppRequest, filters?: RequirementPromptFilter) {
    const prompts = await this.loaders.get(byAppRequestInternalIdLoader, filters).load(appRequest.id)
    for (const prompt of prompts) prompt.appRequestTags = appRequest.tags
    return prompts
  }

  async findByApplicationRequirement (requirement: ApplicationRequirement, filters?: RequirementPromptFilter) {
    const prompts = await this.loaders.get(byRequirementIdLoader, filters).load(requirement.id)
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

  async findByAppRequest (appRequest: AppRequest, filters?: RequirementPromptFilter) {
    const prompts = await this.raw.findByAppRequest(appRequest, filters)
    return this.removeUnauthorized(prompts)
  }

  async findByApplicationRequirement (requirement: ApplicationRequirement, filters?: RequirementPromptFilter) {
    const prompts = await this.raw.findByApplicationRequirement(requirement, filters)
    return this.removeUnauthorized(prompts)
  }

  async getPreloadData (requirementPrompt: RequirementPrompt) {
    const [appRequest, allPeriodConfig, data] = await this.getRequirementPromptSupportDetail(requirementPrompt)
    const config = allPeriodConfig[requirementPrompt.key] ?? {}
    if (!appRequest) throw new Error('AppRequest not found')
    if (requirementPrompt.definition.preload != null) {
      const preloadData = await requirementPrompt.definition.preload(appRequest!, config, data, allPeriodConfig, this.ctx)
      const mergedData = (data[requirementPrompt.key] != null) ? { ...preloadData, ...data[requirementPrompt.key] } : preloadData
      return mergedData
    }
    return data[requirementPrompt.key]
  }

  async getFetchData (requirementPrompt: RequirementPrompt) {
    const [appRequest, allPeriodConfig, data] = await this.getRequirementPromptSupportDetail(requirementPrompt)
    const config = allPeriodConfig[requirementPrompt.key] ?? {}
    if (!appRequest) throw new Error('AppRequest not found')
    if (requirementPrompt.definition.fetch != null) {
      return requirementPrompt.definition.fetch(appRequest!, config, data, allPeriodConfig, this.ctx)
    }
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

  async getRequirementPromptSupportDetail (requirementPrompt: RequirementPrompt) {
    return await Promise.all([
      this.svc(AppRequestServiceInternal).findByInternalId(requirementPrompt.appRequestInternalId), // appRequest
      periodConfigCache.get(requirementPrompt.periodId), // allPeriodConfig
      this.svc(AppRequestServiceInternal).getData(requirementPrompt.appRequestInternalId) // appRequestData
    ])
  }

  async requiresStaging (requirementPrompt: RequirementPrompt) {
    if (requirementPrompt.definition.prestage != null) {
      const data = await this.svc(AppRequestServiceInternal).getData(requirementPrompt.appRequestInternalId)
      const recur = ('recur' in requirementPrompt.definition.prestage) ? requirementPrompt.definition.prestage.recur : false
      if (data[requirementPrompt.key] == null) return true // first occurence should always run no matter the recur setting, since there is no existing data
      if (recur === true || recur === PromptPreStagingRecurrence.ALWAYS) return true
      if (recur === PromptPreStagingRecurrence.INVALID && requirementPrompt.invalidated) return true
    }
    return false
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

  mayViewAsReviewer (prompt: RequirementPrompt) {
    if (this.isOwn(prompt) && !this.hasControl('AppRequest', 'review_own', prompt.appRequestTags)) return false
    return this.hasControl('PromptAnswer', 'view', { ...prompt.authorizationKeys, ...prompt.appRequestTags })
  }

  mayViewUnredacted (prompt: RequirementPrompt) {
    if (this.isOwn(prompt) && promptRegistry.isUserPrompt(prompt.key)) return true
    return this.mayViewAsReviewer(prompt)
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

  removeProperties (prompt: RequirementPrompt) {
    if (this.mayViewAsReviewer(prompt)) return prompt
    if (statusVisibleToApplicantPhases.has(prompt.applicationPhase) && applicantRequirementTypes.has(prompt.requirementType)) return prompt
    const newPrompt = RequirementPrompt.clone(prompt)
    newPrompt.invalidated = false
    newPrompt.invalidatedReason = undefined
    return newPrompt
  }

  async stage (prompt: RequirementPrompt, dataVersion?: number): Promise<ValidatedAppRequestResponse> {
    if (!this.mayUpdate(prompt)) throw new Error('You are not allowed to stage this prompt.')
    const response = new ValidatedAppRequestResponse()
    response.success = false // default to fail
    if (await this.requiresStaging(prompt) === false) return (response.success = true, response)
    await appRequestTransaction(prompt.appRequestInternalId, async db => {
      const [[appRequest], [appRequestDataPair]] = await Promise.all([
        getAppRequests({ internalIds: [prompt.appRequestInternalId] }, db),
        getAppRequestData([prompt.appRequestInternalId], db)
      ])
      if (!appRequest) throw new Error('AppRequest not found')
      if (dataVersion != null && appRequest.dataVersion !== dataVersion) {
        throw new Error('Someone else is working on the same request and made changes since you loaded. Copy any unsaved work into another document and reload the page to see what has changed.')
      }
      const appRequestData = appRequestDataPair?.data ?? {}
      const allConfigData = await periodConfigCache.get(prompt.periodId)
      const stagedData = (typeof prompt.definition.prestage === 'function') ? prompt.definition.prestage(appRequest, allConfigData[prompt.key] ?? {}, allConfigData, this.ctx, db) : prompt.definition.prestage!.process!(appRequest, allConfigData[prompt.key] ?? {}, allConfigData, this.ctx, db)
      response.success = true
      if (!equal(appRequestData[prompt.key], stagedData)) {
        appRequestData[prompt.key] = stagedData
        const promptsToInvalidate = promptRegistry.getInvalidatedPrompts(prompt.key, appRequestData, allConfigData)
        await setRequirementPromptsInvalid(promptsToInvalidate, db)
        const promptsToRevalidate = promptRegistry.getRevalidatedPrompts(prompt.key, appRequestData, allConfigData)
        await setRequirementPromptsValid(promptsToRevalidate.concat([prompt.key]), db)
        await updateAppRequestData(appRequest.internalId, appRequestData, dataVersion, db)!
        recordAppRequestActivity(appRequest.internalId, this.user!.internalId, `${programRegistry.get(prompt.programKey)?.navTitle ?? 'Prompt'} Updated`, { data: stagedData, description: prompt.title, impersonatedBy: this.impersonationUser?.internalId }, db)
      }
    })
    return response
  }

  async update (prompt: RequirementPrompt, data: any, validateOnly = false, dataVersion?: number) {
    data ??= {}
    if (!this.mayUpdate(prompt)) throw new Error('You are not allowed to update this prompt.')
    if (!promptRegistry.validate(prompt.key, data)) throw new Error('Invalid prompt data.')
    const response = new ValidatedAppRequestResponse()
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
      response.success = true // if we got this far, it's saving the data, so that's a success even if the data isn't quite valid yet
      if (!equal(appRequestData[prompt.key], processedData)) {
        updated = true
        previousAppRequestStatus = appRequest.status
        savedData = appRequestData[prompt.key]
        appRequestData[prompt.key] = processedData
        const promptsToInvalidate = promptRegistry.getInvalidatedPrompts(prompt.key, appRequestData, allConfigData)
        await setRequirementPromptsInvalid(promptsToInvalidate, db)
        const promptsToRevalidate = promptRegistry.getRevalidatedPrompts(prompt.key, appRequestData, allConfigData)
        await setRequirementPromptsValid(promptsToRevalidate.concat([prompt.key]), db)
        previousAppPhases = (await updateAppRequestData(appRequest.internalId, appRequestData, dataVersion, db))!
        recordAppRequestActivity(appRequest.internalId, this.user!.internalId, `${programRegistry.get(prompt.programKey)?.navTitle ?? 'Prompt'} Updated`, { data, description: prompt.title, impersonatedBy: this.impersonationUser?.internalId }, db)
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
