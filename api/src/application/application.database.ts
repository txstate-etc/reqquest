import db from 'mysql2-async/db'
import { Application, ApplicationFilter, ApplicationPhase, ApplicationStatus, IneligiblePhases, PeriodWorkflowRow, programRegistry } from '../internal.js'
import { Queryable } from 'mysql2-async'
import { findIndex } from 'txstate-utils'

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
  workflowStage: string
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
  const rows = await tdb.getall<ApplicationRow>(`
    SELECT a.id, a.appRequestId, ar.periodId, a.programKey, ar.userId, a.computedStatus, a.computedStatusReason
    FROM applications a
    INNER JOIN app_requests ar ON ar.id = a.appRequestId
    WHERE (${where.join(') AND (')})
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
    await db.update('UPDATE applications SET computedStatus = ?, computedStatusReason = ?, computedPhase = ?, computedIneligiblePhase = ? WHERE id = ?', [application.status, application.statusReason, application.phase, application.ineligiblePhase, application.internalId])
  }
}

export async function advanceWorkflow (applicationId: string, tdb: Queryable = db) {
  const application = await tdb.getrow<ApplicationRow>('SELECT * FROM applications WHERE id = ?', [applicationId])
  if (!application) throw new Error(`Application not found: ${applicationId}`)
  if (application.computedPhase !== ApplicationPhase.READY_FOR_WORKFLOW) throw new Error('Application is not ready to advance workflow.')

  const stages = await tdb.getall<PeriodWorkflowRow>(`
    SELECT w.* FROM period_workflow_stages w
    WHERE w.programKey=? AND w.periodId=?
    ORDER BY w.evaluationOrder
  `, [application.programKey, application.periodId])
  const blocking = stages.filter(stage => !!stage.blocking)
  const nonblocking = stages.filter(stage => !stage.blocking)
  const current = stages.find(stage => stage.stageKey === application.workflowStage)

  let toStage: PeriodWorkflowRow | undefined
  let toPhase: ApplicationPhase = application.computedPhase
  if (!current) {
    toStage = blocking[0]
    if (!toStage) toPhase = ApplicationPhase.READY_FOR_OFFER
    else toPhase = ApplicationPhase.WORKFLOW_BLOCKING
  } else if (current.blocking) {
    const currIdx = findIndex(blocking, stage => stage.stageKey === current.stageKey)
    if (currIdx) {
      toStage = blocking[currIdx + 1]
      if (!toStage) toPhase = ApplicationPhase.READY_FOR_OFFER
      else toPhase = ApplicationPhase.WORKFLOW_BLOCKING
    } else toPhase = ApplicationPhase.READY_FOR_OFFER
  } else {
    const currIdx = findIndex(nonblocking, stage => stage.stageKey === current.stageKey)
    if (currIdx) {
      toStage = nonblocking[currIdx + 1]
      if (!toStage) toPhase = ApplicationPhase.COMPLETE
      else toPhase = ApplicationPhase.WORKFLOW_NONBLOCKING
    } else toPhase = ApplicationPhase.COMPLETE
  }

  await tdb.update('UPDATE applications SET computedPhase = ?, workflowStage = ? WHERE id = ?', [toPhase, toStage, applicationId])
}
