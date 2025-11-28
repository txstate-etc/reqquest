import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { Application, ApplicationRequirement, ApplicationRequirementFilter, PeriodProgramRequirementFilters, PeriodProgramRequirementRow, PeriodProgramRequirement, RequirementStatus, requirementRegistry, RequirementType, ApplicationPhase } from '../internal.js'

export interface ApplicationRequirementRow {
  id: number
  type: RequirementType
  applicationId: number
  applicationPhase: ApplicationPhase
  appRequestId: number
  periodId: number
  userId: number
  requirementKey: string
  programKey: string
  workflowStage?: string
  evaluationOrder: number
  status: RequirementStatus
  statusReason?: string
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
    SELECT r.*, a.periodId, app.programKey, a.userId, app.computedPhase as applicationPhase
    FROM application_requirements r
    INNER JOIN applications app ON app.id=r.applicationId
    INNER JOIN app_requests a ON a.id=r.appRequestId
    WHERE (${where.join(') AND (')})
    ORDER BY app.evaluationOrder, r.evaluationOrder
  `, binds)
  return rows.map(row => new ApplicationRequirement(row))
}

export async function syncRequirementRecords (application: Application, enabledKeys: Set<string>, db: Queryable) {
  const existingRequirements = await db.getall<ApplicationRequirementRow>('SELECT * FROM application_requirements WHERE applicationId = ?', [application.internalId])
  const existingRequirementKeys = new Set(existingRequirements.map(row => row.requirementKey))
  // TODO: this needs to be using the period to see what's disalbled/enabled!
  const activeRequirementKeys = application.program.requirementKeys.filter(requirementKey => enabledKeys.has(requirementKey))
  const activeRequirementKeysSet = new Set(activeRequirementKeys)
  const workflowRequirementKeys: string[] = []
  const workflowRequirementKeyStage = new Map<string, number>()
  for (let i = 0; i < (application.program.workflowStages?.length ?? 0); i++) {
    const stage = application.program.workflowStages![i]
    for (const requirementKey of stage.requirementKeys) {
      if (enabledKeys.has(requirementKey)) {
        workflowRequirementKeys.push(requirementKey)
        workflowRequirementKeyStage.set(requirementKey, i)
      }
    }
  }
  const requirementsToInsert = activeRequirementKeys.filter(requirementKey => !existingRequirementKeys.has(requirementKey))
  const requirementsToDelete = existingRequirements.filter(row => !activeRequirementKeysSet.has(row.requirementKey))
  if (requirementsToInsert.length) {
    const binds: any[] = []
    await db.insert(`
      INSERT INTO application_requirements (type, applicationId, appRequestId, requirementKey, workflowStage)
      VALUES ${db.in(binds, requirementsToInsert.map(requirementKey => [requirementRegistry.get(requirementKey)?.type ?? RequirementType.QUALIFICATION, application.internalId, application.appRequestId, requirementKey, workflowRequirementKeyStage.get(requirementKey) ?? 0]))}
    `, binds)
  }
  if (requirementsToDelete.length) {
    const binds: any[] = []
    await db.query(`DELETE FROM application_requirements WHERE id IN (${db.in(binds, requirementsToDelete.map(row => row.id))})`, binds)
  }
  for (let i = 0; i < activeRequirementKeys.length; i++) {
    const requirementKey = activeRequirementKeys[i]
    await db.update('UPDATE application_requirements SET type = ?, workflowStage = ?, evaluationOrder = ? WHERE applicationId = ? AND requirementKey = ?', [requirementRegistry.get(requirementKey)?.type ?? RequirementType.QUALIFICATION, workflowRequirementKeyStage.get(requirementKey) ?? 0, i, application.internalId, requirementKey])
  }
  return await getApplicationRequirements({ applicationIds: [application.id] }, db)
}

export async function updateRequirementComputed (requirements: ApplicationRequirement[], db: Queryable) {
  for (const requirement of requirements) {
    await db.update('UPDATE application_requirements SET status = ?, statusReason = ? WHERE id = ?', [requirement.status, requirement.statusReason ?? null, requirement.internalId])
  }
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

export async function updatePeriodProgramRequirement (periodId: string, requirementKey: string, disabled: boolean) {
  await db.update('UPDATE period_program_requirements SET disabled = ? WHERE periodId = ? AND requirementKey = ?', [disabled, periodId, requirementKey])
}
