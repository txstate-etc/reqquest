import db from 'mysql2-async/db'
import { Application, ApplicationFilter, ApplicationStatus, ProgramDefinition, programRegistry } from '../internal.js'
import { Queryable } from 'mysql2-async'

export interface ApplicationRow {
  id: number
  appRequestId: number
  periodId: number
  programKey: string
  userId: number
  computedStatus: ApplicationStatus
  computedStatusReason?: string
}

async function processFilters (filter: ApplicationFilter) {
  const where: string[] = []
  const binds: any[] = []
  if (filter.ids?.length) {
    where.push(`id IN (${db.in(binds, filter.ids)})`)
  }
  if (filter.appRequestIds?.length) {
    where.push(`appRequestId IN (${db.in(binds, filter.appRequestIds)})`)
  }
  return { where, binds }
}

export async function getApplications (filter: ApplicationFilter, tdb: Queryable = db) {
  const { where, binds } = await processFilters(filter)
  const rows = await tdb.getall<ApplicationRow>(`
    SELECT a.id, a.appRequestId, ar.periodId, a.programKey, ar.userId, a.computedStatus, a.computedStatusReason
    FROM applications a
    INNER JOIN app_requests ar ON ar.id = a.appRequestId
    WHERE (${where.join(') AND (')})
    ORDER BY evaluationOrder
  `, binds)
  return rows.map(row => new Application(row))
}

export async function syncApplications (appRequestId: number, enabledKeys: Set<string>, db: Queryable) {
  const activePrograms = programRegistry.list().filter(program => enabledKeys.has(program.key))
  const activeProgramKeySet = new Set(activePrograms.map(program => program.key))
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
  return await getApplications({ appRequestIds: [String(appRequestId)] })
}

export async function updateApplicationsComputed (applications: Application[], db: Queryable) {
  for (const application of applications) {
    await db.update('UPDATE applications SET computedStatus = ?, computedStatusReason = ? WHERE id = ?', [application.status, application.statusReason, application.internalId])
  }
}
