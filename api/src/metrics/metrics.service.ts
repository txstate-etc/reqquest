import { BaseService } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { AuthService, MetricApplicationFilters, ApplicationMetric, ApplicationMetricEntry, getApplicationMetricEntries } from '../internal.js'

const byInternalApplicationIdLoader = new PrimaryKeyLoader({
  fetch: async (applicationIds: number[]) => {
    return await getApplicationMetricEntries({ applicationIds: applicationIds.map(String) })
  },
  extractId: (row: ApplicationMetricEntry) => row.internalApplicationId
})

export class ApplicationMetricServiceInternal extends BaseService<ApplicationMetricEntry> {
  async findByInternalApplicationId (internalApplicationId: number) {
    return await this.loaders.get(byInternalApplicationIdLoader).load(internalApplicationId)
  }

  async findById (id: string) {
    return await this.findByInternalApplicationId(Number(id))
  }

  async find (filters?: MetricApplicationFilters): Promise<ApplicationMetric> {
    const applicationMetricEntries = await getApplicationMetricEntries(filters)
    for (const entry of applicationMetricEntries) {
      this.loaders.get(byInternalApplicationIdLoader).prime(entry.internalApplicationId, entry)
    }
    return { entries: applicationMetricEntries }
  }
}

export class ApplicationMetricService extends AuthService<ApplicationMetricEntry> {
  raw = this.svc(ApplicationMetricServiceInternal)

  mayViewMetrics () {
    return this.hasAnyControl('Metrics', 'view')
  }

  async findByInternalApplicationId (internalApplicationId: number) {
    return await this.raw.findByInternalApplicationId(internalApplicationId)
  }

  async findById (id: string) {
    return await this.raw.findById(id)
  }

  async find (filters?: MetricApplicationFilters): Promise<ApplicationMetric> {
    if (!this.mayViewMetrics()) throw new Error('You are not allowed to view metrics.')
    return await this.raw.find(filters)
  }
}
