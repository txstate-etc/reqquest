import { BaseService } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { AuthService, MetricApplicationFilters, ApplicationMetric, ApplicationMetricEntry, getApplicationMetricEntries, ApplicationMetricTiming, IneligiblePhases, ApplicationPhase, ApplicationStatus } from '../internal.js'

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

  getStarted (applicationMetric: ApplicationMetric): ApplicationMetricEntry[] {
    return applicationMetric.entries?.filter(entry => entry.createdAt != null && (entry.phase !== ApplicationPhase.PREQUAL && entry.ineligiblePhase !== IneligiblePhases.PREQUAL)) ?? []
  }

  getSubmitted (applicationMetric: ApplicationMetric): ApplicationMetricEntry[] {
    return applicationMetric.entries?.filter(entry => entry.submittedAt != null && (entry.ineligiblePhase !== IneligiblePhases.PREQUAL && entry.ineligiblePhase !== IneligiblePhases.QUALIFICATION)) ?? []
  }

  getClosed (applicationMetric: ApplicationMetric): ApplicationMetricEntry[] {
    return applicationMetric.entries?.filter(entry => entry.closedAt != null && (entry.ineligiblePhase !== IneligiblePhases.PREQUAL && entry.ineligiblePhase !== IneligiblePhases.QUALIFICATION)) ?? []
  }

  getApproved (applicationMetric: ApplicationMetric): ApplicationMetricEntry[] {
    return applicationMetric.entries?.filter(entry => entry.phase === ApplicationPhase.COMPLETE && entry.status === ApplicationStatus.ELIGIBLE) ?? []
  }

  getDenied (applicationMetric: ApplicationMetric): ApplicationMetricEntry[] {
    return applicationMetric.entries?.filter(entry => entry.phase === ApplicationPhase.COMPLETE && entry.status === ApplicationStatus.INELIGIBLE && (entry.ineligiblePhase !== IneligiblePhases.PREQUAL && entry.ineligiblePhase !== IneligiblePhases.QUALIFICATION)) ?? []
  }

  getSubmissionTimings (applicationMetric: ApplicationMetric): ApplicationMetricTiming {
    const submitted = this.getSubmitted(applicationMetric)
    const submissionTimes = submitted.map(entry => (entry.submittedAt!.toMillis() - entry.createdAt!.toMillis()) / 1000)
    if (!submissionTimes.length) return {}
    const avg = submissionTimes.reduce((sum, time) => sum + time, 0) / submissionTimes.length
    const max = Math.max(...submissionTimes)
    const min = Math.min(...submissionTimes)
    return { avg, min, max }
  }

  getDecisionTimings (applicationMetric: ApplicationMetric): ApplicationMetricTiming {
    const approved = this.getApproved(applicationMetric)
    const denied = this.getDenied(applicationMetric)
    const merged = [...approved, ...denied]
    const decisionTimes = merged.map(entry => ((entry.updatedAt!.toMillis() - entry.submittedAt!.toMillis()) / (merged.filter(m => m.appRequestId === entry.appRequestId).length)) / 1000)
    if (!decisionTimes.length) return {}
    const avg = decisionTimes.reduce((sum, time) => sum + time, 0) / decisionTimes.length
    const max = Math.max(...decisionTimes)
    const min = Math.min(...decisionTimes)
    return { avg, min, max }
  }
}
