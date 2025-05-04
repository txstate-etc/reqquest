import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { Application, ApplicationRequirement, ApplicationRequirementFilter, PeriodConfigurationRow, PeriodProgramRequirement, PeriodProgramRequirementFilters, PeriodProgramRequirementRow, PeriodRequirement, PeriodRequirementFilters, RequirementStatus } from '../internal.js'

export interface ApplicationRequirementRow {
  id: number
  applicationId: number
  appRequestId: number
  periodId: number
  requirementKey: string
  status: RequirementStatus
  statusReason?: string
  reachable: 0 | 1
}

async function processFilters (filter: ApplicationRequirementFilter) {
  const where: string[] = []
  const binds: any[] = []
  if (filter.ids?.length) {
    where.push(`r.id IN (${db.in(binds, filter.ids)})`)
  }
  if (filter.applicationIds?.length) {
    where.push(`r.applicationId IN (${db.in(binds, filter.applicationIds)})`)
  }
  if (filter.appRequestIds?.length) {
    where.push(`r.appRequestId IN (${db.in(binds, filter.appRequestIds)})`)
  }
  if (filter.requirementKeys?.length) {
    where.push(`r.requirementKey IN (${db.in(binds, filter.requirementKeys)})`)
  }
  return { where, binds }
}

export async function getApplicationRequirements (filter: ApplicationRequirementFilter, tdb: Queryable = db) {
  const { where, binds } = await processFilters(filter)
  const rows = await tdb.getall<ApplicationRequirementRow>(`
    SELECT r.*, a.periodId FROM application_requirements r INNER JOIN app_requests a ON a.id=r.appRequestId WHERE (${where.join(') AND (')})
    ORDER BY evaluationOrder
  `, binds)
  return rows.map(row => new ApplicationRequirement(row))
}

export async function syncRequirementRecords (application: Application, enabledKeys: Set<string>, db: Queryable) {
  const existingRequirements = await db.getall<ApplicationRequirementRow>('SELECT * FROM application_requirements WHERE applicationId = ?', [application.internalId])
  const existingRequirementKeys = new Set(existingRequirements.map(row => row.requirementKey))
  const activeRequirementKeys = application.program.requirementKeys.filter(requirementKey => enabledKeys.has(requirementKey))
  const activeRequirementKeysSet = new Set(activeRequirementKeys)
  const requirementsToInsert = activeRequirementKeys.filter(requirementKey => !existingRequirementKeys.has(requirementKey))
  const requirementsToDelete = existingRequirements.filter(row => !activeRequirementKeysSet.has(row.requirementKey))
  if (requirementsToInsert.length) {
    const binds: any[] = []
    await db.insert(`
      INSERT INTO application_requirements (applicationId, appRequestId, requirementKey)
      VALUES ${db.in(binds, requirementsToInsert.map(requirementKey => [application.internalId, application.appRequestId, requirementKey]))}
    `, binds)
  }
  if (requirementsToDelete.length) {
    const binds: any[] = []
    await db.query(`DELETE FROM application_requirements WHERE id IN (${db.in(binds, requirementsToDelete.map(row => row.id))})`, binds)
  }
  for (let i = 0; i < activeRequirementKeys.length; i++) {
    const requirementKey = activeRequirementKeys[i]
    await db.update('UPDATE application_requirements SET evaluationOrder = ? WHERE applicationId = ? AND requirementKey = ?', [i, application.internalId, requirementKey])
  }
  return await getApplicationRequirements({ applicationIds: [application.id] }, db)
}

export async function updateRequirementComputed (requirements: ApplicationRequirement[], db: Queryable) {
  for (const requirement of requirements) {
    await db.update('UPDATE application_requirements SET reachable = ?, status = ?, statusReason = ? WHERE id = ?', [requirement.reachable, requirement.status, requirement.statusReason ?? null, requirement.internalId])
  }
}

export async function getPeriodRequirements (filter: PeriodRequirementFilters) {
  const where: string[] = []
  const binds: any[] = []
  if (filter.periodIds?.length) {
    where.push(`pc.periodId IN (${db.in(binds, filter.periodIds)})`)
  }
  if (filter.keys?.length) {
    where.push(`pc.key IN (${db.in(binds, filter.keys)})`)
  }

  return (await db.getall<PeriodConfigurationRow>(`
    SELECT pc.* FROM period_requirements pc
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
  `, binds)).map(row => new PeriodRequirement(row))
}

export async function getPeriodProgramRequirements (filter: PeriodProgramRequirementFilters) {
  const where: string[] = []
  const binds: any[] = []
  if (filter.periodIds?.length) {
    where.push(`ppr.periodId IN (${db.in(binds, filter.periodIds)})`)
  }
  if (filter.programKeys?.length) {
    where.push(`ppr.programKey IN (${db.in(binds, filter.programKeys)})`)
  }
  if (filter.requirementKeys?.length) {
    where.push(`ppr.requirementKey IN (${db.in(binds, filter.requirementKeys)})`)
  }
  if (filter.periodPrograms?.length) {
    where.push(`(ppr.periodId, ppr.programKey) IN (${db.in(binds, filter.periodPrograms.map(pp => [pp.periodId, pp.programKey]))})`)
  }
  if (filter.keys?.length) {
    where.push(`(ppr.periodId, ppr.programKey, ppr.requirementKey) IN (${db.in(binds, filter.keys.map(k => [k.periodId, k.programKey, k.requirementKey]))})`)
  }

  return (await db.getall<PeriodProgramRequirementRow>(`
    SELECT ppr.* FROM period_program_requirements ppr
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
  `, binds)).map(row => new PeriodProgramRequirement(row))
}
