import { BaseService, ValidatedResponse } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { intersect, isBlank, keyby, pick } from 'txstate-utils'
import { AuthService, Configuration, ConfigurationFilters, createPeriod, deletePeriod, getConfigurationData, getConfigurations, getPeriods, getPeriodsEmpty, Period, PeriodFilters, PeriodUpdate, promptRegistry, requirementRegistry, updatePeriod, upsertConfiguration, ValidatedConfigurationResponse, ValidatedPeriodResponse } from '../internal.js'
import { DateTime } from 'luxon'

const periodByIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return await getPeriods({ ids })
  }
})

const periodEmptyByIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return await getPeriodsEmpty(ids)
  }
})

export class PeriodService extends AuthService<Period> {
  async find (filter?: PeriodFilters) {
    const periods = await getPeriods(filter)
    for (const period of periods) {
      this.loaders.get(periodByIdLoader).prime(period.id, period)
    }
    return periods
  }

  async findById (id: string) {
    return await this.loaders.get(periodByIdLoader).load(id)
  }

  #openNow: Period[] | undefined
  async findOpen () {
    if (!this.#openNow) {
      this.#openNow = await this.find({ openNow: true })
    }
    return this.#openNow
  }

  mayView (period: Period) {
    return true
  }

  mayViewConfigurations (period: Period) {
    return this.hasControl('Period', 'view_configuration')
  }

  acceptingAppRequests (period: Period) {
    return (
      period.reviewed
      && period.openDate <= DateTime.now()
      && (period.closeDate == null || period.closeDate > DateTime.now())
    )
  }

  mayCreate () {
    return this.hasControl('Period', 'create')
  }

  mayUpdate (period: Period) {
    return this.hasControl('Period', 'update')
  }

  mayDelete (period: Period) {
    return this.hasControl('Period', 'delete')
  }

  async validate (period: PeriodUpdate, id?: string) {
    const response = new ValidatedPeriodResponse({ success: true })
    const existingName = period.name ? await getPeriods({ names: [period.name] }) : []
    if (id) {
      if (existingName.length && !existingName.find(p => p.id === id)) response.addMessage('Name is already in use.', 'period.name')
    } else {
      if (existingName.length) response.addMessage('Name is already in use.', 'period.name')
    }
    if (isBlank(period.name)) response.addMessage('Name is required.', 'period.name')
    if (period.openDate == null) response.addMessage('Open date is required.', 'period.openDate')
    if (period.closeDate != null && period.closeDate < period.openDate) {
      response.addMessage('Close date must be after open date.', 'period.closeDate')
    }
    if (period.archiveDate != null && period.closeDate != null && period.archiveDate < period.closeDate) {
      response.addMessage('Archive date must be after close date.', 'period.archiveDate')
    } else if (period.archiveDate != null && period.archiveDate < period.openDate) {
      response.addMessage('Archive date must be after open date.', 'period.archiveDate')
    }
    return response
  }

  async create (period: PeriodUpdate, copyPeriodId?: string, validateOnly?: boolean) {
    if (!this.mayCreate()) throw new Error('You are not allowed to create a period.')
    const response = await this.validate(period)
    if (validateOnly || response.hasErrors()) return response
    try {
      const id = await createPeriod(period, copyPeriodId)
      this.loaders.clear()
      response.period = await this.findById(String(id))
    } catch (e: any) {
      if (e.errno === 1022) response.addMessage(e.message)
      else throw e
    }
    return response
  }

  async update (id: string, update: PeriodUpdate, validateOnly?: boolean) {
    const period = await this.findById(id)
    if (!period) throw new Error('Period not found')
    if (!this.mayUpdate(period)) throw new Error('You are not allowed to update this period.')
    const response = await this.validate(update, id)
    if (validateOnly || response.hasErrors()) return response
    await updatePeriod(id, update)
    this.loaders.clear()
    response.period = await this.findById(id)
    return response
  }

  async delete (id: string) {
    const period = await this.findById(id)
    if (!period) throw new Error('Period not found')
    if (!this.mayDelete(period)) throw new Error('You are not allowed to delete this period.')
    await deletePeriod(id)
    return new ValidatedResponse({ success: true })
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

export class ConfigurationServiceInternal extends BaseService<Configuration> {
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
}

export class ConfigurationService extends AuthService<Configuration> {
  raw = this.svc(ConfigurationServiceInternal)

  async find (filter?: ConfigurationFilters) {
    const configurations = await this.raw.find(filter)
    return this.removeUnauthorized(configurations)
  }

  async findByPeriodIdAndKey (periodId: string, key: string) {
    const configurations = await this.raw.findByPeriodIdAndKey(periodId, key)
    return this.removeUnauthorized(configurations)
  }

  async findByPeriodId (periodId: string, filter?: ConfigurationFilters) {
    const configurations = await this.raw.findByPeriodId(periodId, filter)
    return this.removeUnauthorized(configurations)
  }

  async getData (periodId: string, definitionKey: string) {
    return await this.raw.getData(periodId, definitionKey)
  }

  async getRelatedData (periodId: string, promptKey: string) {
    const allConfig: Record<string, any> = {}
    const relatedKeys = promptRegistry.authorizationKeys[promptKey] ?? []
    await Promise.all(relatedKeys.map(async key => {
      const config = await this.getData(periodId, key)
      allConfig[key] = config
    }))
    return allConfig
  }

  async getFetchedData (periodId: string, definitionKey: string) {
    const definition = promptRegistry.get(definitionKey) ?? requirementRegistry.get(definitionKey)
    if (!definition) throw new Error('Configuration definition not found')
    return await definition.configuration?.fetch?.(periodId)
  }

  mayView (cfg: Configuration) {
    return this.hasControl(cfg.type, 'view', cfg.configuredObject.authorizationKeys)
  }

  async mayUpdate (cfg: Configuration) {
    const empty = (await this.loaders.get(periodEmptyByIdLoader).load(cfg.periodId))?.empty
    if (!empty) return false
    return this.hasControl(cfg.type, 'configure', cfg.configuredObject.authorizationKeys)
  }

  async update (periodId: string, key: string, data: any, validateOnly?: boolean) {
    const cfg = await this.findByPeriodIdAndKey(periodId, key)
    if (!cfg) throw new Error('Configuration not found')
    if (!await this.mayUpdate(cfg)) throw new Error('You are not allowed to update this configuration.')
    const response = new ValidatedConfigurationResponse({ success: true })
    const registry = cfg.type === 'Prompt' ? promptRegistry : requirementRegistry
    const valid = registry.validateConfig(key, data)
    if (!valid) throw new Error('Invalid configuration data format.')
    const processedData = cfg.configuredObject.definition.configuration?.preProcessData?.(data, this.ctx) ?? data
    const messages = await cfg.configuredObject.definition.configuration?.validate?.(processedData) ?? []
    for (const feedback of messages) response.addMessage(feedback.message)
    if (validateOnly || response.hasErrors()) return response
    await upsertConfiguration(periodId, key, processedData)
    this.loaders.clear()
    response.configuration = await this.findByPeriodIdAndKey(periodId, key)
    return response
  }
}
