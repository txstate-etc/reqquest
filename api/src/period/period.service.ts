import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { intersect, isBlank, keyby, pick } from 'txstate-utils'
import { AuthService, Configuration, ConfigurationFilters, createPeriod, getConfigurationData, getConfigurations, getPeriods, Period, PeriodFilters, PeriodPromptService, PeriodRequirementService, PeriodUpdate, PromptDefinition, promptRegistry, RequirementDefinitionProcessed, requirementRegistry, updatePeriod, upsertConfiguration, ValidatedConfigurationResponse, ValidatedPeriodResponse } from '../internal.js'

const periodByIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return await getPeriods({ ids })
  }
})

export class PeriodService extends AuthService<Period> {
  async find (filter?: PeriodFilters) {
    return await getPeriods(filter)
  }

  async findById (id: string) {
    return await this.loaders.get(periodByIdLoader).load(id)
  }

  mayView (obj: Period) {
    return true // TODO
  }

  mayCreate () {
    return true // TODO
  }

  mayUpdate (period: Period) {
    return true // TODO
  }

  async validate (update: PeriodUpdate) {
    const response = new ValidatedPeriodResponse({ success: true })
    const existing = update.code ? await getPeriods({ codes: [update.code] }) : []
    if (existing.length) response.addMessage('Code is already in use.', 'update.code')
    if (isBlank(update.name)) response.addMessage('Name is required.', 'update.name')
    if (update.openDate == null) response.addMessage('Open date is required.', 'update.openDate')
    if (update.closeDate == null) response.addMessage('Close date is required.', 'update.closeDate')
    return response
  }

  async create (period: PeriodUpdate, validateOnly?: boolean) {
    if (!this.mayCreate()) throw new Error('You are not allowed to create a period.')
    const response = await this.validate(period)
    if (validateOnly || response.hasErrors()) return response
    try {
      const id = await createPeriod(period)
      this.loaders.clear()
      response.period = await this.findById(String(id))
    } catch (e: any) {
      if (e.errno === 1022) response.addMessage('Code is already in use.', 'update.code')
      else throw e
    }
    return response
  }

  async update (id: string, update: PeriodUpdate, validateOnly?: boolean) {
    const period = await this.findById(id)
    if (!period) throw new Error('Period not found')
    if (!this.mayUpdate(period)) throw new Error('You are not allowed to update this period.')
    const response = await this.validate(update)
    if (validateOnly || response.hasErrors()) return response
    await updatePeriod(id, update)
    this.loaders.clear()
    response.period = await this.findById(id)
    return response
  }
}

const configurationByIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: { periodId: string, key: string }[]) => {
    return await getConfigurations({ ids })
  },
  extractId: configuration => pick(configuration, 'periodId', 'key')
})

const configurationsByPeriodIdLoader = new OneToManyLoader({
  fetch: async (periodIds: string[], filters?: ConfigurationFilters) => {
    return await getConfigurations({ ...filters, periodIds })
  },
  extractKey: row => row.periodId,
  idLoader: configurationByIdLoader
})

const configurationDataByIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: { periodId: string, definitionKey: string }[]) => {
    return await getConfigurationData(ids)
  },
  extractId: configuration => pick(configuration, 'periodId', 'definitionKey')
})

export class ConfigurationService extends AuthService<Configuration> {
  async find (filter?: ConfigurationFilters) {
    return await getConfigurations(filter)
  }

  async findByPeriodIdAndKey (periodId: string, key: string) {
    return await this.loaders.get(configurationByIdLoader).load({ periodId, key })
  }

  async findByPeriodId (periodId: string, filter?: ConfigurationFilters) {
    const configurations = await this.loaders.get(configurationsByPeriodIdLoader, filter).load(periodId)
    const configByKey = keyby(configurations, 'key')
    const allKeys = intersect({ skipEmpty: true }, filter?.keys ?? [], [...promptRegistry.keys(), ...requirementRegistry.keys()])
    return allKeys.map(key => configByKey[key] ?? new Configuration({ periodId: Number(periodId), definitionKey: key, createdAt: new Date(), updatedAt: new Date() }))
  }

  async getData (periodId: string, definitionKey: string) {
    const dataRow = await this.loaders.get(configurationDataByIdLoader).load({ periodId, definitionKey })
    return dataRow?.data ?? {}
  }

  async getRelatedData (periodId: string, promptKey: string) {
    const allConfig: Record<string, any> = {}
    const relatedKeys = promptRegistry.authorizationKeys[promptKey] ?? []
    await Promise.all(relatedKeys.map(async key => {
      const config = await this.svc(ConfigurationService).getData(periodId, key)
      allConfig[key] = config
    }))
    return allConfig
  }

  mayView (obj: Configuration) {
    return true // TODO
  }

  async mayUpdate (periodId: string, key: string) {
    // TODO: make sure there are no app requests that have been submitted in the period
    // TODO: make sure the user has permission to update the key, subjectType could be Prompt or Requirement
    const promptDef = promptRegistry.get(key)
    const requirementDef = requirementRegistry.get(key)
    if (promptDef) {
      const periodPrompt = await this.svc(PeriodPromptService).findByPeriodIdAndPromptKey(periodId, key)
      return periodPrompt && await this.svc(PeriodPromptService).mayConfigure(periodPrompt)
    } else if (requirementDef) {
      const periodProgramRequirements = await this.svc(PeriodRequirementService).findByPeriodIdAndRequirementKey(periodId, key)
      const mayUpdates = await Promise.all(periodProgramRequirements.map(async ppr => await this.svc(PeriodRequirementService).mayConfigure(ppr)))
      return mayUpdates.some(Boolean)
    }
    return false
  }

  async update (periodId: string, key: string, data: any, validateOnly?: boolean) {
    const definition: PromptDefinition | RequirementDefinitionProcessed | undefined = promptRegistry.get(key) ?? requirementRegistry.get(key)
    if (!definition) throw new Error('Definition not found')
    if (!await this.mayUpdate(periodId, key)) throw new Error('You are not allowed to update this configuration.')
    const response = new ValidatedConfigurationResponse({ success: true })
    const messages = await definition.validateConfiguration?.(data) ?? []
    for (const feedback of messages) response.addMessage(feedback.message)
    if (validateOnly || response.hasErrors()) return response
    await upsertConfiguration(periodId, key, data)
    this.loaders.clear()
    response.configuration = await this.findByPeriodIdAndKey(periodId, key)
    return response
  }
}
