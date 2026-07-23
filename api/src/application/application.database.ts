import db from 'mysql2-async/db'
import { Application, ApplicationFilter, ApplicationPhase, ApplicationStatus, AppRequestPhase, AppRequestStatus, AppRequestStatusDB, IneligiblePhases, PeriodWorkflowRow, programRegistry } from '../internal.js'
import { Queryable } from 'mysql2-async'

export interface ApplicationRow {
  id: number
  appRequestId: number
  periodId: number
  programKey: string
  userId: number
  computedStatus: ApplicationStatus
  computedStatusReason?: string
  computedPhase: ApplicationPhase
  computedIneligiblePhase?: IneligiblePhases
  computedAwaitingCorrection: 0 | 1
  workflowStage: string
  appRequestStatus: AppRequestStatusDB
  appRequestComputedStatus: AppRequestStatus
  appRequestPhase: AppRequestPhase
}

function processFilters (filter: ApplicationFilter) {
  const where: string[] = []
  const binds: any[] = []
  if (filter.ids?.length) {
    where.push(`a.id IN (${db.in(binds, filter.ids)})`)
  }
  if (filter.appRequestIds?.length) {
    where.push(`a.appRequestId IN (${db.in(binds, filter.appRequestIds)})`)
  }
  return { where, binds }
}

export async function getApplications (filter: ApplicationFilter, tdb: Queryable = db) {
  const { where, binds } = processFilters(filter)
  const whereClause = where.length > 0 ? `WHERE (${where.join(') AND (')})` : ''
  const rows = await tdb.getall<ApplicationRow>(`
    SELECT a.id, a.appRequestId, ar.periodId, a.programKey, ar.userId, a.computedStatus, a.computedStatusReason, a.computedPhase,
      a.computedIneligiblePhase, a.computedAwaitingCorrection, a.workflowStage, ar.status AS appRequestStatus, ar.phase AS appRequestPhase, ar.computedStatus AS appRequestComputedStatus
    FROM applications a
    INNER JOIN app_requests ar ON ar.id = a.appRequestId
    ${whereClause}
    ORDER BY evaluationOrder
  `, binds)
  return rows.map(row => new Application(row))
}

export async function syncApplications (appRequestId: number, activeProgramKeySet: Set<string>, db: Queryable) {
  const activePrograms = programRegistry.list().filter(program => activeProgramKeySet.has(program.key))
  const existingApplications = await db.getall<ApplicationRow>('SELECT * FROM applications WHERE appRequestId = ?', [appRequestId])
  const existingProgramKeys = new Set(existingApplications.map(row => row.programKey))
  const programsToInsert = activePrograms.filter(program => !existingProgramKeys.has(program.key))
  const programsToDelete = existingApplications.filter(row => !activeProgramKeySet.has(row.programKey))
  if (programsToInsert.length) {
    const binds: any[] = []
    await db.insert(`
      INSERT INTO applications (appRequestId, programKey)
      VALUES ${db.in(binds, programsToInsert.map(program => [appRequestId, program.key]))}
    `, binds)
  }
  if (programsToDelete.length) {
    const binds: any[] = []
    await db.delete(`DELETE FROM applications WHERE id IN (${db.in(binds, programsToDelete.map(row => row.id))})`, binds)
  }
  for (let i = 0; i < activePrograms.length; i++) {
    const program = activePrograms[i]
    await db.update('UPDATE applications SET evaluationOrder = ? WHERE appRequestId = ? AND programKey = ?', [i, appRequestId, program.key])
  }
  return await getApplications({ appRequestIds: [String(appRequestId)] }, db)
}

export async function updateApplicationsComputed (applications: Application[], db: Queryable) {
  for (const application of applications) {
    await db.update('UPDATE applications SET computedStatus = ?, computedStatusReason = ?, computedPhase = ?, computedIneligiblePhase = ?, computedAwaitingCorrection = ? WHERE id = ?', [application.status, application.statusReason, application.phase, application.ineligiblePhase, application.awaitingCorrection ? 1 : 0, application.internalId])
  }
}

export async function advanceWorkflow (applicationId: string, tdb: Queryable = db) {
  const [application] = await getApplications({ ids: [applicationId] }, tdb)
  if (!application) throw new Error(`Application not found: ${applicationId}`)
  if (application.phase !== ApplicationPhase.READY_FOR_WORKFLOW) throw new Error('Application is not ready to advance workflow.')

  const stages = await tdb.getall<PeriodWorkflowRow>(`
    SELECT DISTINCT w.* FROM period_workflow_stages w
    INNER JOIN application_requirements r ON r.workflowStage = w.stageKey
    INNER JOIN applications a ON a.id = r.applicationId AND a.programKey = w.programKey
    WHERE w.programKey=? AND w.periodId=?
    ORDER BY w.evaluationOrder
  `, [application.programKey, application.periodId])
  const blocking = stages.filter(stage => !!stage.blocking)
  const nonblocking = stages.filter(stage => !stage.blocking)
  const current = stages.find(stage => stage.stageKey === application.workflowStageKey)

  let toStage: PeriodWorkflowRow | undefined
  let toPhase: ApplicationPhase = application.phase
  if (!current) {
    toStage = blocking[0]
    if (!toStage) toPhase = ApplicationPhase.REVIEW_COMPLETE
    else toPhase = ApplicationPhase.WORKFLOW_BLOCKING
  } else if (current.blocking) {
    const currIdx = blocking.findIndex(stage => stage.stageKey === current.stageKey)
    if (currIdx > -1) {
      toStage = blocking[currIdx + 1]
      if (!toStage) toPhase = ApplicationPhase.REVIEW_COMPLETE
      else toPhase = ApplicationPhase.WORKFLOW_BLOCKING
    } else toPhase = ApplicationPhase.REVIEW_COMPLETE
  } else {
    const currIdx = nonblocking.findIndex(stage => stage.stageKey === current.stageKey)
    if (currIdx > -1) {
      toStage = nonblocking[currIdx + 1]
      if (!toStage) toPhase = ApplicationPhase.COMPLETE
      else toPhase = ApplicationPhase.WORKFLOW_NONBLOCKING
    } else toPhase = ApplicationPhase.COMPLETE
  }

  await tdb.update('UPDATE applications SET computedPhase = ?, workflowStage = ? WHERE id = ?', [toPhase, toStage?.stageKey, applicationId])
}

export async function reverseWorkflow (applicationId: string, tdb: Queryable = db) {
  const [application] = await getApplications({ ids: [applicationId] }, tdb)
  if (!application) throw new Error(`Application not found: ${applicationId}`)

  const stages = await tdb.getall<PeriodWorkflowRow>(`
    SELECT DISTINCT w.* FROM period_workflow_stages w
    INNER JOIN application_requirements r ON r.workflowStage = w.stageKey
    INNER JOIN applications a ON a.id = r.applicationId AND a.programKey = w.programKey
    WHERE w.programKey=? AND w.periodId=?
    ORDER BY w.evaluationOrder
  `, [application.programKey, application.periodId])
  // Non-blocking workflow stages are excluded from the reverse (return) order — reversal only steps back
  // through the blocking workflow and never targets a non-blocking stage. Aligns with new non-blocking
  // workflows being allowed to surface earlier.
  const blocking = stages.filter(stage => !!stage.blocking)
  // Needed to take into consideration blocking workflow stages and not just move back to APPROVAL
  const currIdx = application.phase === ApplicationPhase.REVIEW_COMPLETE
    ? blocking.length
    : blocking.findIndex(stage => stage.stageKey === application.workflowStageKey)
  const toStage: PeriodWorkflowRow | undefined = currIdx > 0 ? blocking[currIdx - 1] : undefined
  const toPhase = toStage ? ApplicationPhase.WORKFLOW_BLOCKING : ApplicationPhase.APPROVAL
  await tdb.update('UPDATE applications SET computedPhase = ?, workflowStage = ? WHERE id = ?', [toPhase, toStage?.stageKey, applicationId])
}
