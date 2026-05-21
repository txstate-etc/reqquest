import { BaseService } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { AuthService, ApplicationMetric, MetricRequestFilters } from '../internal.js'

const byInternalApplicationIdLoader = new PrimaryKeyLoader({
  fetch: async (applicationIds: number[]) => {
    return await getApplicationMetrics({ applicationIds: applicationIds.map(String) })
  },
  extractId: (row: ApplicationMetric) => row.internalApplicationId
})

export class ApplicationMetricServiceInternal extends BaseService<ApplicationMetric> {
  async findByInternalApplicationId (internalApplicationId: number) {
    return await this.loaders.get(byInternalApplicationIdLoader).load(internalApplicationId)
  }

  async findById (id: string) {
    return await this.findByInternalApplicationId(Number(id))
  }

  async find (filters?: MetricRequestFilters) {
    const applicationMetrics = await getApplicationMetrics(filters)
    for (const applicationMetric of applicationMetrics) {
      this.loaders.get(byInternalApplicationIdLoader).prime(applicationMetric.internalApplicationId, applicationMetric)
    }
    return applicationMetrics
  }
}

export class ApplicationMetricService extends AuthService<ApplicationMetric> {
  raw = this.svc(ApplicationMetricServiceInternal)

  mayViewMetrics () {
    return this.hasAnyControl('Metrics', 'view')
  }

  async find (filters?: MetricRequestFilters) {
    if (!this.mayViewMetrics()) throw new Error('You are not allowed to view metrics.')
    return await this.raw.find(filters)
  }
}
