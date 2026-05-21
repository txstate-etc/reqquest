import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { ApplicationMetricEntry, MetricApplicationFilters } from '../internal.js'

function metricApplicationFilters (filters?: MetricApplicationFilters) {
  const where: string[] = []
  const binds: any[] = []
  if (filters?.applicationIds?.length) {
    where.push(`app.applicationId IN (${db.in(binds, filters.applicationIds)})`)
  }
  if (filters?.startedAfterDateTime != null) {
    where.push('app.createdAt >= ?')
    binds.push(filters.startedAfterDateTime)
  }
  if (filters?.startedBeforeDateTime != null) {
    where.push('app.createdAt <= ?')
    binds.push(filters.startedBeforeDateTime)
  }
  if (filters?.submittedAfterDateTime != null) {
    where.push('ar.submittedAt >= ?')
    binds.push(filters.submittedAfterDateTime)
  }
  if (filters?.submittedBeforeDateTime != null) {
    where.push('ar.submittedAt <= ?')
    binds.push(filters.submittedBeforeDateTime)
  }
  if (filters?.closedAfterDateTime != null) {
    where.push('ar.closedAt >= ?')
    binds.push(filters.closedAfterDateTime)
  }
  if (filters?.closedBeforeDateTime != null) {
    where.push('ar.closedAt <= ?')
    binds.push(filters.closedBeforeDateTime)
  }
  if (filters?.periods != null) {
    if (filters.periods.ids?.length) {
      where.push(`per.id IN (${db.in(binds, filters.periods.ids)})`)
    }
    if (filters.periods.names?.length) {
      where.push(`per.name IN (${db.in(binds, filters.periods.names)})`)
    }
    if (filters.periods.codes?.length) {
      where.push(`per.code IN (${db.in(binds, filters.periods.codes)})`)
    }
  }
  if (filters?.applicants != null) {
    if (filters.applicants.ids?.length) {
      where.push(`au.id IN (${db.in(binds, filters.applicants.ids)})`)
    }
    if (filters.applicants.logins?.length) {
      where.push(`au.login IN (${db.in(binds, filters.applicants.logins)})`)
    }
    if (filters.applicants.fullnames?.length) {
      where.push(`au.fullname IN (${db.in(binds, filters.applicants.fullnames)})`)
    }
  }
  return { where, binds }
}

export async function getApplicationMetricEntries (filters?: MetricApplicationFilters) {
  const { where, binds } = metricApplicationFilters(filters)
  const rows = await db.getall<ApplicationMetricEntry>(`
    SELECT app.id as applicationId, app.createdAt, app.updatedAt, app.computedStatus , app.computedPhase , app.computedIneligiblePhase, app.programKey,
    ar.submittedAt, ar.closedAt,
    au.id as applicantId, au.login as applicantLogin, au.fullname as applicantFullname,
    per.id as periodId, per.name as periodName, per.code as periodCode
    from applications as app
    left join app_requests ar on app.appRequestId = ar.id
    left join accessUsers au on ar.userId = au.id 
    left join periods per on ar.periodId = per.id
    ${where.length ? `WHERE (${where.join(') AND (')})` : ''}
    ORDER BY app.id ASC
  `, binds)
  return rows.map(row => new ApplicationMetricEntry(row))
}
