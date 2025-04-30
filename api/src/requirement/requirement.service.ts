import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { Application, AuthService, getApplicationRequirements, ApplicationRequirement, ApplicationRequirementFilter, PeriodRequirement, getPeriodRequirements, getPeriodProgramRequirements, PeriodProgramKey } from '../internal.js'
import { BaseService } from '@txstate-mws/graphql-server'

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

const periodRequirementsByPeriodIdLoader = new OneToManyLoader({
  fetch: async (periodIds: string[]) => {
    return await getPeriodRequirements({ periodIds })
  },
  extractKey: row => row.periodId
})

const periodProgramRequirementsByPeriodIdAndProgramKeyLoader = new OneToManyLoader({
  fetch: async (periodPrograms: PeriodProgramKey[]) => {
    return await getPeriodProgramRequirements({ periodPrograms })
  },
  extractKey: row => ({ periodId: row.periodId, programKey: row.programKey })
})

export class PeriodRequirementService extends BaseService<PeriodRequirement> {
  async findByPeriodId (periodId: string) {
    return await this.loaders.get(periodRequirementsByPeriodIdLoader).load(periodId)
  }

  async findByPeriodProgramKey (periodId: string, programKey: string) {

  }

  mayConfigure (requirement: PeriodRequirement) {
    return true // TODO
  }
}
