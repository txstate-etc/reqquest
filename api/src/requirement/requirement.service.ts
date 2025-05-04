import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { Application, AuthService, getApplicationRequirements, ApplicationRequirement, ApplicationRequirementFilter, PeriodProgramRequirement, getPeriodProgramRequirements, PeriodProgramKey, PeriodProgramRequirementKey, PeriodRequirementKey } from '../internal.js'

const byIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return await getApplicationRequirements({ ids })
  }
})

const byRequirementKeyLoader = new PrimaryKeyLoader({
  fetch: async (keys: { appRequestId: string, requirementKey: string }[]) => {
    return await getApplicationRequirements({ appRequestIds: keys.map(k => k.appRequestId), requirementKeys: keys.map(k => k.requirementKey) })
  },
  extractId: (requirement: ApplicationRequirement) => ({ appRequestId: requirement.appRequestId, requirementKey: requirement.key }),
  idLoader: byIdLoader
})
byIdLoader.addIdLoader(byRequirementKeyLoader)

const byAppRequestIdLoader = new OneToManyLoader({
  fetch: async (appRequestIds: string[], filters: ApplicationRequirementFilter) => {
    return await getApplicationRequirements({ ...filters, appRequestIds })
  },
  extractKey: (requirement: ApplicationRequirement) => requirement.appRequestId,
  idLoader: [byIdLoader, byRequirementKeyLoader]
})

export class ApplicationRequirementService extends AuthService<ApplicationRequirement> {
  async findById (id: string) {
    return await this.loaders.get(byIdLoader).load(id)
  }

  async findByInternalId (internalId: number) {
    return await this.findById(String(internalId))
  }

  async findByAppRequestId (appRequestId: string) {
    return await this.loaders.get(byAppRequestIdLoader).load(appRequestId)
  }

  async findByApplication (application: Application) {
    return await this.loaders.loadMany(byRequirementKeyLoader, application.program.requirementKeys.map(requirementKey => ({ appRequestId: application.appRequestId, requirementKey })))
  }
}

const periodRequirementByFullKeyLoader = new PrimaryKeyLoader({
  fetch: async (keys: PeriodProgramRequirementKey[]) => {
    return await getPeriodProgramRequirements({ keys })
  },
  extractId: row => ({ periodId: row.periodId, programKey: row.programKey, requirementKey: row.key })
})

const periodRequirementsByPeriodIdLoader = new OneToManyLoader({
  fetch: async (periodIds: string[]) => {
    return await getPeriodProgramRequirements({ periodIds })
  },
  extractKey: row => row.periodId,
  idLoader: periodRequirementByFullKeyLoader
})

const periodRequirementsByPeriodIdAndRequirementKeyLoader = new OneToManyLoader({
  fetch: async (periodRequirementKeys: PeriodRequirementKey[]) => {
    return await getPeriodProgramRequirements({ periodRequirementKeys })
  },
  extractKey: row => ({ periodId: row.periodId, requirementKey: row.key }),
  idLoader: periodRequirementByFullKeyLoader
})

const periodProgramRequirementsByPeriodIdAndProgramKeyLoader = new OneToManyLoader({
  fetch: async (periodPrograms: PeriodProgramKey[]) => {
    return await getPeriodProgramRequirements({ periodPrograms })
  },
  extractKey: row => ({ periodId: row.periodId, programKey: row.programKey })
})

export class PeriodRequirementService extends AuthService<PeriodProgramRequirement> {
  async findByPeriodId (periodId: string) {
    return await this.loaders.get(periodRequirementsByPeriodIdLoader).load(periodId)
  }

  async findByPeriodIdAndProgramKey (periodId: string, programKey: string) {
    return await this.loaders.get(periodProgramRequirementsByPeriodIdAndProgramKeyLoader).load({ periodId, programKey })
  }

  async findByPeriodIdAndRequirementKey (periodId: string, requirementKey: string) {
    return await this.loaders.get(periodRequirementsByPeriodIdAndRequirementKeyLoader).load({ periodId, requirementKey })
  }

  async findByKey (periodId: string, programKey: string, requirementKey: string) {
    return await this.loaders.get(periodRequirementByFullKeyLoader).load({ periodId, programKey, requirementKey })
  }

  mayConfigure (requirement: PeriodProgramRequirement) {
    if (requirement.definition.validateConfiguration == null) return false
    return this.hasControl('Requirement', 'configure', requirement.key)
  }
}
