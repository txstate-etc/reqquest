import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import {
  Application, AuthService, getApplicationRequirements, ApplicationRequirement,
  ApplicationRequirementFilter, PeriodProgramRequirement, getPeriodProgramRequirements,
  PeriodProgramKey, PeriodProgramRequirementKey, PeriodRequirementKey, AppRequest,
  AppRequestService, requirementRegistry
} from '../internal.js'

const byIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return await getApplicationRequirements({ ids })
  }
})

const byApplicationIdLoader = new OneToManyLoader({
  fetch: async (applicationIds: string[]) => {
    return await getApplicationRequirements({ applicationIds })
  },
  extractKey: requirement => requirement.applicationId,
  idLoader: byIdLoader
})

const byAppRequestIdLoader = new OneToManyLoader({
  fetch: async (appRequestIds: string[], filters: ApplicationRequirementFilter) => {
    return await getApplicationRequirements({ ...filters, appRequestIds })
  },
  extractKey: (requirement: ApplicationRequirement) => requirement.appRequestId,
  idLoader: [byIdLoader]
})

export class ApplicationRequirementService extends AuthService<ApplicationRequirement> {
  async findById (id: string, appRequestTags?: Record<string, string[]>) {
    const req = await this.loaders.get(byIdLoader).load(id)
    req!.appRequestTags = appRequestTags ?? await this.svc(AppRequestService).getTags(req!.appRequestId)
    return req
  }

  async findByAppRequest (appRequest: AppRequest) {
    const reqs = await this.loaders.get(byAppRequestIdLoader).load(appRequest.id)
    for (const req of reqs) req.appRequestTags = appRequest.tags
  }

  async findByApplication (application: Application) {
    const reqs = await this.loaders.get(byApplicationIdLoader).load(application.id)
    for (const req of reqs) req.appRequestTags = application.appRequestTags
    return reqs
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
    return this.hasControl('Requirement', 'configure', requirement.authorizationKeys)
  }
}
