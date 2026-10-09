import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { groupby } from 'txstate-utils'
import { Application, ApplicationRequirement, ApplicationRequirementFilter, bulkUpdateById, PeriodProgramRequirementFilters, PeriodProgramRequirementRow, PeriodProgramRequirement, RequirementStatus, requirementRegistry, RequirementType, ApplicationPhase, AppRequestPhase } from '../internal.js'

export interface ApplicationRequirementRow {
  id: number
  type: RequirementType
  applicationId: number
  applicationPhase: ApplicationPhase
  appRequestId: number
  appRequestPhase: AppRequestPhase
  periodId: number
  userId: number
  requirementKey: string
  programKey: string
  workflowStage?: string
  evaluationOrder: number
  status: RequirementStatus
  statusReason?: string
  // JSON array of prompt keys as stored; the model parses it into ApplicationRequirement.blame
  blame?: string
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
    SELECT r.*, a.periodId, app.programKey, a.userId, app.computedPhase as applicationPhase, a.phase as appRequestPhase
    FROM application_requirements r
    INNER JOIN applications app ON app.id=r.applicationId
    INNER JOIN app_requests a ON a.id=r.appRequestId
    WHERE (${where.join(') AND (')})
    ORDER BY app.evaluationOrder, r.evaluationOrder
  `, binds)
  return rows.map(row => new ApplicationRequirement(row))
}

// The requirements a program should have on an application this period, in evaluation order, with the workflow stage 
function desiredRequirements (application: Application, enabledKeys: Set<string>) {
  const desired: { key: string, type: RequirementType, workflowStage: string | null }[] = []
  const seen = new Set<string>()
  const add = (key: string, workflowStage: string | null) => {
    if (!enabledKeys.has(key) || seen.has(key)) return
    seen.add(key)
    desired.push({ key, type: requirementRegistry.get(key)?.type ?? RequirementType.QUALIFICATION, workflowStage })
  }
  for (const key of application.program.requirementKeys) add(key, null)
  for (const stage of application.program.workflowStages ?? []) {
    for (const key of stage.requirementKeys) add(key, stage.key)
  }
  return desired
}


// Reconcile the application_requirements rows of every application on an appRequest with the
// definitions in one pass: one read, one insert, one delete, one update, one reload regardless of program count.
export async function syncRequirementRecords (appRequestId: number, applications: Application[], enabledKeysByProgram: Record<string, Set<string>>, db: Queryable) {
  const existing = await db.getall<{ id: number, applicationId: number, requirementKey: string, type: RequirementType, workflowStage: string | null, evaluationOrder: number }>(
    'SELECT id, applicationId, requirementKey, type, workflowStage, evaluationOrder FROM application_requirements WHERE appRequestId = ?', [appRequestId])
  const existingByApplication = groupby(existing, 'applicationId')
  const toInsert: any[][] = []
  const toDelete: number[] = []
  const toUpdate: { id: number, type: RequirementType, workflowStage: string | null, evaluationOrder: number }[] = []
  for (const application of applications) {
    const desired = desiredRequirements(application, enabledKeysByProgram[application.programKey] ?? new Set())
    const desiredKeys = new Set(desired.map(d => d.key))
    const rows = existingByApplication[application.internalId] ?? []
    const rowsByKey = new Map(rows.map(row => [row.requirementKey, row]))
    for (let i = 0; i < desired.length; i++) {
      const { key, type, workflowStage } = desired[i]
      const row = rowsByKey.get(key)
      if (!row) toInsert.push([type, application.internalId, appRequestId, key, workflowStage, i])
      else if (row.type !== type || (row.workflowStage ?? null) !== workflowStage || row.evaluationOrder !== i) toUpdate.push({ id: row.id, type, workflowStage, evaluationOrder: i })
    }
    for (const row of rows) if (!desiredKeys.has(row.requirementKey)) toDelete.push(row.id)
  }
  if (toInsert.length) {
    const binds: any[] = []
    await db.insert(`
      INSERT INTO application_requirements (type, applicationId, appRequestId, requirementKey, workflowStage, evaluationOrder)
      VALUES ${db.in(binds, toInsert)}
    `, binds)
  }
  if (toDelete.length) {
    const binds: any[] = []
    await db.delete(`DELETE FROM application_requirements WHERE id IN (${db.in(binds, toDelete)})`, binds)
  }
  await bulkUpdateById(db, 'application_requirements', ['type', 'workflowStage', 'evaluationOrder'], toUpdate)
  return await getApplicationRequirements({ appRequestIds: [String(appRequestId)] }, db)
}

/** The computed columns the evaluation writes back, shaped for `bulkUpdateById` and for change detection. */
export function requirementComputedRow (requirement: ApplicationRequirement) {
  return {
    id: requirement.internalId,
    status: requirement.status,
    statusReason: requirement.statusReason ?? null,
    blame: requirement.blame?.length ? JSON.stringify(requirement.blame) : null
  }
}

export async function updateRequirementComputed (requirements: ApplicationRequirement[], db: Queryable) {
  await bulkUpdateById(db, 'application_requirements', ['status', 'statusReason', 'blame'], requirements.map(requirementComputedRow))
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
