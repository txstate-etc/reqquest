import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { MetricRequestFilter } from '../internal.js'

function metricFilters (filter: MetricRequestFilter) {
  const where: string[] = []
  const binds: any[] = []
  if (filter.ids?.length) {
    where.push(`p.id IN (${db.in(binds, filter.ids)})`)
  }
  if (filter.appRequestIds?.length) {
    where.push(`p.appRequestId IN (${db.in(binds, filter.appRequestIds)})`)
  }
  if (filter.applicationIds?.length) {
    where.push(`p.applicationId IN (${db.in(binds, filter.applicationIds)})`)
  }
  if (filter.requirementIds?.length) {
    where.push(`p.requirementId IN (${db.in(binds, filter.requirementIds)})`)
  }
  if (filter.promptKeys?.length) {
    where.push(`p.promptKey IN (${db.in(binds, filter.promptKeys)})`)
  }
  if (filter.reachable != null) {
    where.push('p.reachable = ?')
    binds.push(filter.reachable ? 1 : 0)
  }
  if (filter.answered != null) {
    where.push('p.answered = ?')
    binds.push(filter.answered ? 1 : 0)
  }
  return { where, binds }
}