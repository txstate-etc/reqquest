import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { ApplicationMetric, MetricApplicationFilters } from '../internal.js'

function metricApplicationFilters (filters?: MetricApplicationFilters) {
  const where: string[] = []
  const binds: any[] = []
  if (filters?.applicationIds?.length) {
    where.push(`app.applicationId IN (${db.in(binds, filters.applicationIds)})`)
  }
  if (filters?.startAfterDateTime != null) {
    where.push('ar.createdAt >= ?')
    binds.push(filters.startAfterDateTime)
  }
  if (filters?.startBeforeDateTime != null) {
    where.push('ar.createdAt <= ?')
    binds.push(filters.startBeforeDateTime)
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
  if (filters?.archivedAfterDateTime != null) {
    where.push('ar.archivedAt >= ?')
    binds.push(filters.archivedAfterDateTime)
  }
  if (filters?.archivedBeforeDateTime != null) {
    where.push('ar.archivedAt <= ?')
    binds.push(filters.archivedBeforeDateTime)
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
      where.push(`applicant.id IN (${db.in(binds, filters.applicants.ids)})`)
    }
    if (filters.applicants.logins?.length) {
      where.push(`applicant.login IN (${db.in(binds, filters.applicants.logins)})`)
    }
    if (filters.applicants.fullnames?.length) {
      where.push(`applicant.fullname IN (${db.in(binds, filters.applicants.fullnames)})`)
    }
  }
  if (filters?.reviewers != null) {
    if (filters.reviewers.ids?.length) {
      where.push(`reviewer.id IN (${db.in(binds, filters.reviewers.ids)})`)
    }
    if (filters.reviewers.logins?.length) {
      where.push(`reviewer.login IN (${db.in(binds, filters.reviewers.logins)})`)
    }
    if (filters.reviewers.fullnames?.length) {
      where.push(`reviewer.fullname IN (${db.in(binds, filters.reviewers.fullnames)})`)
    }
  }
  return { where, binds }
}

export async function getApplicationMetrics (filters?: MetricApplicationFilters) {
  const { where, binds } = metricApplicationFilters(filters)
  const rows = await db.getall<ApplicationMetric>(`
    SELECT p.*
    FROM periods p
    ${where.length ? `WHERE (${where.join(') AND (')})` : ''}
    ORDER BY p.openDate DESC
  `, binds)
  return rows.map(row => new ApplicationMetric(row))
}
