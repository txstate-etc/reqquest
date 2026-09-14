import type { Context } from '@txstate-mws/graphql-server'
import type { FastifyTxStateAuthInfo } from 'fastify-txstate'
import type { GraphQLError } from 'graphql'
import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { clone, isNotBlank, omit, stringify } from 'txstate-utils'
import {
  ApplicationPhase, ApplicationStatus, AppRequest, AppRequestActivity, AppRequestActivityFilters, AppRequestFilter,
  AppRequestPhase, AppRequestStatus, evaluateAppRequest, getApplications, getPeriodWorkflowStages, Pagination, PaginationInfoWithTotalItems, promptRegistry,
  RQContext, type AppRequestData
} from '../internal.js'

/**
 * This is the status of the whole appRequest as stored in the database. Each application
 * within the request may have its own status. For instance, the appRequest might be CLOSED,
 * but some applications will be INELIGIBLE while others are APPROVED or NOT_APPROVED.
 */
export enum AppRequestStatusDB {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  // The request has been cancelled.
  CANCELLED = 'CANCELLED',
  // The request was withdrawn after submission. The applicant may re-open but
  // the request should go back to SUBMITTED - the applicant may not
  // make edits unless the reviewer sends it back to STARTED.
  WITHDRAWN = 'WITHDRAWN'
}

export interface AppRequestRow {
  id: number
  periodId: number
  periodCode: string | null
  userId: number
  reviewStarted: 0 | 1
  status: AppRequestStatusDB
  phase: AppRequestPhase
  computedStatus: AppRequestStatus
  computedReadyToComplete: 0 | 1
  computedAwaitingCorrection: 0 | 1
  createdAt: Date
  updatedAt: Date
  submittedAt: Date | null
  closedAt: Date | null
  dataVersion: number
  periodClosesAt: Date | null
  periodArchivesAt: Date | null
  periodOpensAt: Date
}

export interface AppRequestRowData {
  id: number
  data?: string
}

export interface AppRequestActivityRow {
  id: number
  appRequestId: number
  userId: number
  impersonatedBy?: number
  action: string
  description?: string
  data?: string
  createdAt: Date
}

export async function getAppRequestData (ids: number[], tdb: Queryable = db): Promise<{ id: number, data: AppRequestData }[]> {
  const rows = await tdb.getall<AppRequestRowData>(`SELECT id, data FROM app_requests WHERE id = ${db.in([], ids)}`, ids)
  return await Promise.all(rows.map(async row => ({ ...row, data: row.data ? await migrateAppRequestData(JSON.parse(row.data) as AppRequestData) : {} as AppRequestData })))
}

async function migrateAppRequestData (appRequestData: AppRequestData, toSchemaVersion: string = promptRegistry.latestMigration()) {
  const fromSchemaVersion = appRequestData.savedAtVersion ?? toSchemaVersion
  let data = clone(omit(appRequestData, 'savedAtVersion'))
  if (fromSchemaVersion > toSchemaVersion) throw new Error('Cannot migrate data to an older schema version.')

  const migrations = promptRegistry.migrations().filter(m => m.id > fromSchemaVersion && m.id <= toSchemaVersion)

  for (const migration of migrations) {
    data = await migration.up(data)
  }
  return { ...data, savedAtVersion: toSchemaVersion }
}

function processFilters (filter?: AppRequestFilter) {
  const where: string[] = []
  const binds: any[] = []
  const joins = new Map<string, string>()
  if (filter?.ids?.length) {
    where.push(`ar.id IN (${db.in(binds, filter.ids)})`)
  }
  if (filter?.internalIds?.length) {
    where.push(`ar.id IN (${db.in(binds, filter.internalIds)})`)
  }
  if (filter?.status?.length) {
    where.push(`ar.computedStatus IN (${db.in(binds, filter.status)})`)
  }
  if (filter?.rescindedStatus?.length) {
    // EXISTS rather than a join so a multi-program request cannot duplicate rows or throw off the pagination count.
    where.push(`EXISTS (SELECT 1 FROM applications resc WHERE resc.appRequestId = ar.id AND resc.rescindedStatus IN (${db.in(binds, filter.rescindedStatus)}))`)
  }
  if (filter?.periodIds?.length) {
    where.push(`ar.periodId IN (${db.in(binds, filter.periodIds)})`)
  }
  if (filter?.userInternalIds?.length) {
    where.push(`ar.userId IN (${db.in(binds, filter.userInternalIds)})`)
  }
  if (filter?.logins?.length) {
    joins.set('u', 'INNER JOIN accessUsers u ON u.id = ar.userId')
    where.push(`u.login IN (${db.in(binds, filter.logins)})`)
  }
  if (filter?.closed === true) {
    where.push('ar.closedAt IS NOT NULL')
  } else if (filter?.closed === false) {
    where.push('ar.closedAt IS NULL')
  }
  if (filter?.indexes?.length) {
    for (const index of filter.indexes) {
      joins.set('t', 'LEFT JOIN app_request_tags t ON t.appRequestId = ar.id')
      binds.push(index.category)
      where.push(`t.category = ? AND t.tag IN (${db.in(binds, index.tags)})`)
    }
  }
  if (isNotBlank(filter?.search)) {
    joins.set('u', 'INNER JOIN accessUsers u ON u.id = ar.userId')
    joins.set('t', 'LEFT JOIN app_request_tags t ON t.appRequestId = ar.id')
    joins.set('tl', 'LEFT JOIN tag_labels tl ON tl.category = t.category AND tl.tag = t.tag')
    binds.push(`${filter.search}%`, `${filter.search}%`, `%${filter.search}%`, `${filter.search}%`, `${filter.search}%`)
    if (filter.searchNotes) {
      joins.set('arn', 'LEFT JOIN app_request_notes arn ON arn.appRequestId = ar.id')
      binds.push(filter.search)
    }
    where.push(`(p.name LIKE ? OR u.login LIKE ? OR u.fullname LIKE ? OR t.tag LIKE ? OR tl.label LIKE ?${filter.searchNotes ? ' OR MATCH(arn.content) AGAINST (? IN NATURAL LANGUAGE MODE)' : ''})`)
  }
  if (filter?.createdAfter) {
    where.push('ar.createdAt >= ?')
    binds.push(filter.createdAfter.toJSDate())
  }
  if (filter?.createdBefore) {
    where.push('ar.createdAt <= ?')
    binds.push(filter.createdBefore.toJSDate())
  }
  if (filter?.updatedAfter) {
    where.push('ar.updatedAt >= ?')
    binds.push(filter.updatedAfter.toJSDate())
  }
  if (filter?.updatedBefore) {
    where.push('ar.updatedAt <= ?')
    binds.push(filter.updatedBefore.toJSDate())
  }
  if (filter?.submittedAfter) {
    where.push('ar.submittedAt >= ?')
    binds.push(filter.submittedAfter.toJSDate())
  }
  if (filter?.submittedBefore) {
    where.push('ar.submittedAt <= ?')
    binds.push(filter.submittedBefore.toJSDate())
  }
  if (filter?.closedAfter) {
    where.push('ar.closedAt >= ?')
    binds.push(filter.closedAfter.toJSDate())
  }
  if (filter?.closedBefore) {
    where.push('ar.closedAt <= ?')
    binds.push(filter.closedBefore.toJSDate())
  }
  if (filter?.reviewStarted != null) {
    where.push('ar.reviewStarted = ?')
    binds.push(filter.reviewStarted ? 1 : 0)
  }
  if (filter?.complete != null) {
    if (filter.complete) where.push('ar.phase = ?')
    else where.push('ar.phase != ?')
    binds.push(AppRequestPhase.COMPLETE)
  }
  return { joins, where, binds }
}

export async function getAppRequests (filter?: AppRequestFilter & Pagination, tdb: Queryable = db) {
  const { joins, where, binds } = processFilters(filter)
  const limit = filter?.perPage ? `LIMIT ${filter.perPage} OFFSET ${((filter.page ?? 1) - 1) * filter.perPage}` : ''
  const rows = await tdb.getall<AppRequestRow>(`
    SELECT DISTINCT ar.id, ar.periodId, ar.userId, ar.reviewStarted, ar.status, ar.phase, ar.computedStatus, ar.createdAt, ar.updatedAt, ar.closedAt, ar.dataVersion, ar.computedReadyToComplete, ar.computedAwaitingCorrection,
      p.code AS periodCode, p.closeDate AS periodClosesAt, p.archiveDate AS periodArchivesAt, p.openDate AS periodOpensAt
    FROM app_requests ar
    INNER JOIN periods p ON p.id = ar.periodId
    ${Array.from(joins.values()).join('\n')}
    ${where.length === 0 ? '' : `WHERE (${where.join(') AND (')})`}
    ORDER BY ar.id ASC
    ${limit}
  `, binds)
  const tagLookup = await getAppRequestTags(rows.map(row => String(row.id)), tdb)
  return rows.map(row => new AppRequest(row, tagLookup[row.id]))
}

export async function countAppRequests (filter?: AppRequestFilter, tdb: Queryable = db) {
  const { joins, where, binds } = processFilters(filter)
  const count = await tdb.getval<number>(`
    SELECT COUNT(DISTINCT ar.id)
    FROM app_requests ar
    INNER JOIN periods p ON p.id = ar.periodId
    ${Array.from(joins.values()).join('\n')}
    ${where.length === 0 ? '' : `WHERE (${where.join(') AND (')})`}
  `, binds)
  return count
}

export async function getAppRequestTags (appRequestIds: string[], tdb: Queryable = db) {
  if (appRequestIds.length === 0) return {}
  const rows = await tdb.getall<{ id: number, category: string, tag: string }>(`
    SELECT ar.id, t.category, t.tag
    FROM app_requests ar
    INNER JOIN app_request_tags t ON t.appRequestId = ar.id
    WHERE ar.id IN (${db.in([], appRequestIds)})
  `, appRequestIds)
  const tagLookup: Record<string, Record<string, string[]>> = {}
  for (const appRequestId of appRequestIds) tagLookup[appRequestId] = {}
  for (const tag of rows) {
    const appRequestId = String(tag.id)
    tagLookup[appRequestId][tag.category] ??= []
    tagLookup[appRequestId][tag.category].push(tag.tag)
  }
  return tagLookup
}

export async function getIndexesInUse (category: string) {
  return await db.getall<{ value: string, label: string }>(`
    SELECT DISTINCT art.tag AS value, tl.label
    FROM app_request_tags art
    INNER JOIN app_requests r ON r.id = art.appRequestId
    INNER JOIN tag_labels tl ON tl.category = art.category AND tl.tag = art.tag
    WHERE art.category = ?
  `, [category])
}

export async function updateAppRequestComputed (appRequest: AppRequest, db: Queryable) {
  await db.execute('UPDATE app_requests SET computedStatus = ?, computedReadyToComplete = ?, computedAwaitingCorrection = ? WHERE id = ?', [appRequest.status, appRequest.readyToComplete ? 1 : 0, appRequest.awaitingCorrection ? 1 : 0, appRequest.internalId])
}

export async function createAppRequest (periodId: number, userId: number) {
  const appRequestId = await db.insert('INSERT INTO app_requests (periodId, userId) VALUES (?, ?)', [periodId, userId])
  await evaluateAppRequest(appRequestId)
  return appRequestId
}

export async function updateAppRequestData (appRequestId: number, data: AppRequestData, dataVersion?: number, tdb: Queryable = db) {
  const where = dataVersion != null ? ' AND dataVersion = ?' : ''
  const binds: any[] = [JSON.stringify(data), AppRequestPhase.SUBMITTED, appRequestId]
  if (dataVersion != null) binds.push(dataVersion)
  const rowsAffected = await tdb.update('UPDATE app_requests SET data = ?, reviewStarted=(CASE WHEN phase=? THEN 1 ELSE reviewStarted END), dataVersion = dataVersion + 1 WHERE id = ?' + where, binds)
  if (!rowsAffected) throw new Error('Someone else is working on the same request and made changes since you loaded. Copy any unsaved work into another document and reload the page to see what has changed.')
  return await evaluateAppRequest(appRequestId, tdb)
}

export async function submitAppRequest (appRequestId: number) {
  await db.update('UPDATE app_requests SET phase = ?, submittedData = data, submittedAt=NOW() WHERE id = ?', [AppRequestPhase.SUBMITTED, appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function appRequestReturnToApplicant (appRequestId: number, dataVersion?: number) {
  await appRequestTransaction(appRequestId, async db => {
    const where = dataVersion != null ? ' AND dataVersion = ?' : ''
    const binds: any[] = [AppRequestPhase.STARTED, appRequestId]
    if (dataVersion != null) binds.push(dataVersion)
    const updated = await db.update('UPDATE app_requests SET phase = ?, submittedAt = NULL WHERE id = ?' + where, binds)
    if (!updated) throw new Error('Someone else is working on the same request and made changes since you loaded. Reload the page to try again.')
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function appRequestComplete (appRequestId: number, tdb: Queryable = db) {
  const applications = await getApplications({ appRequestIds: [String(appRequestId)] }, tdb)
  const computedStatus = applications.some(a => a.status === ApplicationStatus.ACCEPTED)
    ? AppRequestStatus.ACCEPTED
    : applications.some(a => a.status === ApplicationStatus.ELIGIBLE)
      ? AppRequestStatus.APPROVED
      : applications.some(a => a.status === ApplicationStatus.REJECTED)
        ? AppRequestStatus.NOT_ACCEPTED
        : AppRequestStatus.NOT_APPROVED
  await tdb.execute('UPDATE applications SET computedPhase = ?, workflowStage = NULL WHERE appRequestId = ?', [ApplicationPhase.COMPLETE, appRequestId])
  await tdb.execute('UPDATE app_requests SET phase = ?, computedStatus = ? WHERE id = ?', [AppRequestPhase.COMPLETE, computedStatus, appRequestId])
}

export async function restoreAppRequest (appRequestId: number) {
  await db.update('UPDATE app_requests SET phase = ?, data = submittedData WHERE id = ?', [AppRequestPhase.SUBMITTED, appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function closeAppRequest (appRequestId: number) {
  await db.update(`UPDATE app_requests
    SET
      closedAt = NOW(),
      status = CASE WHEN phase=? THEN ? ELSE ? END,
      computedStatus = CASE
        WHEN phase=? THEN ?
        WHEN phase=? THEN ?
        WHEN phase=? THEN ?
        ELSE computedStatus
      END
    WHERE id = ?`, [
    AppRequestPhase.STARTED, AppRequestStatusDB.CANCELLED, AppRequestStatusDB.CLOSED,
    AppRequestPhase.STARTED, AppRequestStatus.CANCELLED,
    AppRequestPhase.SUBMITTED, AppRequestStatus.NOT_APPROVED,
    AppRequestPhase.ACCEPTANCE, AppRequestStatus.NOT_ACCEPTED,
    appRequestId
  ])
}

export async function cancelAppRequest (appRequestId: number, existingDataVersion?: number) {
  return await db.transaction(async db => {
    const row = await db.getrow<Pick<AppRequestRow, 'phase' | 'status' | 'dataVersion'>>('SELECT phase, status, dataVersion FROM app_requests WHERE id = ? FOR UPDATE', [appRequestId])
    if (!row) throw new Error(`AppRequest ${appRequestId} not found`)
    if (row.status !== AppRequestStatusDB.OPEN) throw new Error(`AppRequest ${appRequestId} is already closed and cannot be cancelled.`)
    if (existingDataVersion && row.dataVersion !== existingDataVersion) throw new Error(`AppRequest ${appRequestId} has been modified by another user. Reload the page and try cancelling again if it is still eligible.`)
    const withdrawn = row.phase !== AppRequestPhase.STARTED
    await db.update('UPDATE app_requests SET status = ?, computedStatus = ? WHERE id = ?', [
      withdrawn ? AppRequestStatusDB.WITHDRAWN : AppRequestStatusDB.CANCELLED,
      withdrawn ? AppRequestStatus.WITHDRAWN : AppRequestStatus.CANCELLED,
      appRequestId
    ])
    return withdrawn
  })
}

export async function reopenAppRequest (appRequestId: number) {
  return await db.transaction(async db => {
    const dbStatus = await db.getval<AppRequestStatusDB>('SELECT status FROM app_requests WHERE id = ? FOR UPDATE', [appRequestId])
    if (!dbStatus) throw new Error(`AppRequest ${appRequestId} not found`)
    if (dbStatus === AppRequestStatusDB.OPEN) throw new Error(`AppRequest ${appRequestId} is already open.`)
    await db.update('UPDATE app_requests SET status = ?, closedAt = NULL WHERE id = ?', [AppRequestStatusDB.OPEN, appRequestId])
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function acceptOffer (appRequestId: number, nextPhase: AppRequestPhase, incomingDataVersion?: number) {
  if (nextPhase === AppRequestPhase.COMPLETE) return await appRequestComplete(appRequestId, db)
  return await appRequestTransaction(appRequestId, async db => {
    const existingDataVersion = await db.getval<number>('SELECT dataVersion FROM app_requests WHERE id = ?', [appRequestId])
    if (existingDataVersion == null) throw new Error(`AppRequest ${appRequestId} not found`)
    if (incomingDataVersion && existingDataVersion !== incomingDataVersion) throw new Error('Someone else is working on the same request and made changes since you loaded. Reload the page to try again.')
    const applications = await getApplications({ appRequestIds: [String(appRequestId)] }, db)
    for (const application of applications) {
      // non-blocking workflow is non-sequential so there is no active stage pointer. All non-blocking requirements
      // become visible/editable at once and marks the application READY_TO_COMPLETE once they are all
      // resolved. Completion is via the whole-request complete action, not per stage advancing.
      await db.execute('UPDATE applications SET computedPhase = ?, workflowStage = ? WHERE id = ?', [ApplicationPhase.WORKFLOW_NONBLOCKING, null, application.internalId])
    }
    await db.update('UPDATE app_requests SET phase = ? WHERE id = ?', [nextPhase, appRequestId])
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function appRequestMakeOffer (appRequestId: number, nextPhase: AppRequestPhase.ACCEPTANCE | AppRequestPhase.WORKFLOW_NONBLOCKING | AppRequestPhase.COMPLETE) {
  if (nextPhase !== AppRequestPhase.ACCEPTANCE) return await acceptOffer(appRequestId, nextPhase, undefined)
  await appRequestTransaction(appRequestId, async db => {
    await db.execute('UPDATE app_requests SET phase = ? WHERE id = ?', [nextPhase, appRequestId])
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function appRequestReturnToOffer (appRequestId: number) {
  await db.execute('UPDATE app_requests SET phase = ? WHERE id = ?', [AppRequestPhase.SUBMITTED, appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function appRequestReturnToReview (appRequestId: number) {
  return await appRequestTransaction(appRequestId, async db => {
    await db.execute('UPDATE app_requests SET phase = ? WHERE id = ?', [AppRequestPhase.SUBMITTED, appRequestId])
    const applications = await getApplications({ appRequestIds: [String(appRequestId)] }, db)
    const workflowStages = await getPeriodWorkflowStages({ periodIds: [applications[0]?.periodId], hasEnabledRequirements: true, blocking: true }, db)
    for (const app of applications) {
      await db.execute('UPDATE applications SET computedPhase = ?, workflowStage = ? WHERE id = ?', [ApplicationPhase.READY_FOR_WORKFLOW, workflowStages.toReversed().find(s => s.programKey === app.programKey)?.key, app.internalId])
    }
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function appRequestReturnToNonBlocking (appRequestId: number) {
  return await appRequestTransaction(appRequestId, async db => {
    await db.execute('UPDATE app_requests SET phase = ? WHERE id = ?', [AppRequestPhase.WORKFLOW_NONBLOCKING, appRequestId])
    const applications = await getApplications({ appRequestIds: [String(appRequestId)] }, db)
    for (const app of applications) {
      // non-blocking workflow is non-sequential so recompute readiness from the resolution of all non-blocking requirements.
      await db.execute('UPDATE applications SET computedPhase = ?, workflowStage = ? WHERE id = ?', [ApplicationPhase.WORKFLOW_NONBLOCKING, null, app.internalId])
    }
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function recordAppRequestActivity (appRequestId: number | string, userId: number, action: string, info?: { description?: string, data?: any, impersonatedBy?: number }, tdb: Queryable = db) {
  await tdb.insert(`
    INSERT INTO app_request_activity (appRequestId, userId, impersonatedBy, action, description, data)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    appRequestId,
    userId,
    info?.impersonatedBy,
    action,
    info?.description,
    info?.data ? stringify(info.data) : null
  ])
  await tdb.update('UPDATE app_requests SET reviewStarted = (CASE WHEN userId != ? THEN 1 ELSE reviewStarted END) WHERE id = ?', [userId, appRequestId])
}

export async function getAppRequestActivity (filter: AppRequestActivityFilters, pageInfo?: PaginationInfoWithTotalItems, paged?: Pagination) {
  const where = []
  const binds: any[] = []

  if (filter.appRequestIds?.length) {
    where.push(`ara.appRequestId IN (${db.in(binds, filter.appRequestIds)})`)
  }
  if (filter.appRequestInternalIds?.length) {
    where.push(`ara.appRequestId IN (${db.in(binds, filter.appRequestInternalIds)})`)
  }
  if (filter.users?.length) {
    where.push(`u.login IN (${db.in(binds, filter.users)}) OR iu.login IN (${db.in(binds, filter.users)})`)
  }
  if (filter.actions?.length) {
    where.push(`action IN (${db.in(binds, filter.actions)})`)
  }
  if (filter.impersonatedBy?.length) {
    where.push(`iu.login IN (${db.in(binds, filter.impersonatedBy)})`)
  }
  if (filter.impersonatedUsers?.length) {
    where.push(`u.login IN (${db.in(binds, filter.impersonatedUsers)}) AND impersonatedBy IS NOT NULL`)
  }
  if (filter.impersonated != null) {
    if (filter.impersonated) {
      where.push('impersonatedBy IS NOT NULL')
    } else {
      where.push('impersonatedBy IS NULL')
    }
  }
  if (isNotBlank(filter?.search)) {
    where.push('MATCH(ara.description) AGAINST (? IN NATURAL LANGUAGE MODE)')
    binds.push(filter.search)
  }
  if (filter.happenedAfter) {
    where.push('createdAt >= ?')
    binds.push(filter.happenedAfter.toJSDate())
  }
  if (filter.happenedBefore) {
    where.push('createdAt <= ?')
    binds.push(filter.happenedBefore.toJSDate())
  }

  if (pageInfo) {
    pageInfo.totalItems = await db.getval(`
      SELECT COUNT(DISTINCT ara.id) FROM app_request_activity ara
      INNER JOIN accessUsers u ON u.id = ara.userId
      LEFT JOIN accessUsers iu ON iu.id = ara.impersonatedBy
      WHERE (${where.join(') AND (')})
      ORDER BY ara.createdAt DESC
    `, binds)

    if (paged?.page || paged?.perPage) {
      pageInfo.currentPage = paged.page ?? 1
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      pageInfo.perPage = paged?.perPage || 100 // 0 should also be overridden, so || is better than nullish coalescing ??
      pageInfo.hasNextPage = (pageInfo.totalItems ?? 0) > pageInfo.currentPage * pageInfo.perPage
    } else {
      pageInfo.currentPage = 1
      pageInfo.perPage = undefined
      pageInfo.hasNextPage = false
    }
  }

  const rows = await db.getall<AppRequestActivityRow>(`
    SELECT ara.* FROM app_request_activity ara
    INNER JOIN accessUsers u ON u.id = ara.userId
    LEFT JOIN accessUsers iu ON iu.id = ara.impersonatedBy
    WHERE (${where.join(') AND (')})
    ORDER BY ara.createdAt DESC
    ${pageInfo?.perPage ? `LIMIT ${pageInfo.perPage} OFFSET ${(pageInfo.currentPage - 1) * pageInfo.perPage}` : ''}
  `, binds)
  return rows.map(row => new AppRequestActivity(row))
}

export async function logMutation (queryTime: number, operationName: string, query: string, auth: FastifyTxStateAuthInfo, variables: any, data: any, errors: GraphQLError[] | undefined, context: Context) {
  try {
    // only log mutations, and only if they were successful
    if (!query.trimStart().startsWith('mutation') || !data?.[Object.keys(data)[0]]?.success) return
    // don't log mutations that are only validating
    const m = query.match(/validateOnly:\s*\$(\w+)/)
    if (m && variables[m[1]] === true) return

    const authInfo = (context as RQContext).authInfo
    await db.insert('INSERT INTO mutationlog (userId, impersonatedBy, clientId, scope, mutation, query, variables) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [authInfo.user!.internalId, authInfo.impersonationUser?.internalId, auth.clientId, auth.scope, operationName, query, stringify(variables)]
    )
  } catch (e: any) {
    console.error('Error logging mutation:', e)
  }
}

export async function appRequestTransaction<T = any> (appRequestInternalId: number, callback: (db: Queryable) => Promise<T>, tdb?: Queryable) {
  if (tdb) return await callback(tdb)
  return await db.transaction(async db => {
    // lock the appRequest while we evaluate
    await db.getval('SELECT id FROM app_requests WHERE id = ? FOR UPDATE', [appRequestInternalId])
    return await callback(db)
  }, { retries: 2 })
}

export async function saveTicket (code: string, auth: any) {
  await db.delete('DELETE FROM temp_authorizations WHERE createdAt < NOW() - INTERVAL 5 MINUTE')
  await db.insert('INSERT INTO temp_authorizations (code, auth) VALUES (?, ?)', [code, JSON.stringify(auth)])
}

export async function useTicket (code: string) {
  const auth = await db.getval<string>('SELECT auth FROM temp_authorizations WHERE code = ? AND createdAt >= NOW() - INTERVAL 5 MINUTE', [code])
  await db.delete('DELETE FROM temp_authorizations WHERE code = ?', [code])
  return auth ? JSON.parse(auth) : undefined
}
