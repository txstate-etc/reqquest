import type { Context } from '@txstate-mws/graphql-server'
import type { FastifyTxStateAuthInfo } from 'fastify-txstate'
import type { GraphQLError } from 'graphql'
import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { clone, findIndex, groupby, isNotBlank, keyby, omit, stringify } from 'txstate-utils'
import { ApplicationPhase, ApplicationRequirement, ApplicationStatus, AppRequest, AppRequestActivity, AppRequestActivityFilters, AppRequestFilter, AppRequestStatus, getAcceptancePeriodIds, getApplications, getPeriodWorkflowStages, IneligiblePhases, programRegistry, promptRegistry, PromptVisibility, RequirementPrompt, requirementRegistry, RequirementStatus, RequirementType, RQContext, syncApplications, syncPromptRecords, syncRequirementRecords, updateApplicationsComputed, updatePromptComputed, updateRequirementComputed, type AppRequestData } from '../internal.js'

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

export enum AppRequestPhase {
  // The request has been started but not yet submitted.
  STARTED = 'STARTED',
  // The request has been submitted for review. Reviewers and blocking-workflow auditors
  // need to finish their work before an offer is made to the applicant.
  SUBMITTED = 'SUBMITTED',
  // At least one application has been approved by the reviewer and the reviewer
  // moved it to this state where we are waiting for the applicant to accept the offer(s).
  ACCEPTANCE = 'ACCEPTANCE',
  // The request has moved past ACCEPTANCE and is ready for each application to begin
  // its non-blocking workflow. If there is no non-blocking workflow, the applications should
  // be marked complete and this status should move to CLOSED.
  WORKFLOW_NONBLOCKING = 'WORKFLOW_NONBLOCKING',
  COMPLETE = 'COMPLETE'
}

export interface AppRequestRow {
  id: number
  periodId: number
  periodCode: string | null
  userId: number
  status: AppRequestStatusDB
  phase: AppRequestPhase
  computedStatus: AppRequestStatus
  computedReadyToComplete: 0 | 1
  createdAt: Date
  updatedAt: Date
  closedAt: Date
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
    where.push(`ar.status IN (${db.in(binds, filter.status)})`)
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
      joins.set('t', 'INNER JOIN app_request_tags t ON t.appRequestId = ar.id')
      binds.push(index.category)
      where.push(`t.category = ? AND t.tag IN (${db.in(binds, index.tags)})`)
    }
  }
  if (isNotBlank(filter?.search)) {
    joins.set('u', 'INNER JOIN accessUsers u ON u.id = ar.userId')
    joins.set('t', 'INNER JOIN app_request_tags t ON t.appRequestId = ar.id')
    joins.set('tl', 'LEFT JOIN tag_labels tl ON tl.category = t.category AND tl.tag = t.tag')
    where.push('(p.name LIKE ? OR u.login LIKE ? OR u.fullname LIKE ? OR t.tag LIKE ? OR tl.label LIKE ?)')
    binds.push(`${filter.search}%`, `${filter.search}%`, `%${filter.search}%`, `${filter.search}%`, `${filter.search}%`)
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
  return { joins, where, binds }
}

export async function getAppRequests (filter?: AppRequestFilter, tdb: Queryable = db) {
  const { joins, where, binds } = processFilters(filter)
  const rows = await tdb.getall<AppRequestRow>(`
    SELECT DISTINCT ar.id, ar.periodId, ar.userId, ar.status, ar.phase, ar.computedStatus, ar.createdAt, ar.updatedAt, ar.closedAt, ar.dataVersion,
      p.code AS periodCode, p.closeDate AS periodClosesAt, p.archiveDate AS periodArchivesAt, p.openDate AS periodOpensAt
    FROM app_requests ar
    INNER JOIN periods p ON p.id = ar.periodId
    ${Array.from(joins.values()).join('\n')}
    ${where.length === 0 ? '' : `WHERE (${where.join(') AND (')})`}
  `, binds)
  const tagLookup = await getAppRequestTags(rows.map(row => String(row.id)), tdb)
  return rows.map(row => new AppRequest(row, tagLookup[row.id]))
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
  await db.execute('UPDATE app_requests SET computedStatus = ?, computedReadyToComplete = ? WHERE id = ?', [appRequest.status, appRequest.readyToComplete ? 1 : 0, appRequest.internalId])
}

export async function createAppRequest (periodId: number, userId: number) {
  const appRequestId = await db.insert('INSERT INTO app_requests (periodId, userId) VALUES (?, ?)', [periodId, userId])
  await evaluateAppRequest(appRequestId)
  return appRequestId
}

export async function updateAppRequestData (appRequestId: number, data: AppRequestData, dataVersion?: number, tdb: Queryable = db) {
  const where = dataVersion != null ? ' AND dataVersion = ?' : ''
  const binds: any[] = [JSON.stringify(data), appRequestId]
  if (dataVersion != null) binds.push(dataVersion)
  const rowsAffected = await tdb.update('UPDATE app_requests SET data = ?, dataVersion = dataVersion + 1 WHERE id = ?' + where, binds)
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
  await db.update('UPDATE app_requests SET status = CASE WHEN phase=? THEN ? ELSE ? END, closedAt = NOW() WHERE id = ?', [
    AppRequestPhase.STARTED, AppRequestStatusDB.CANCELLED, AppRequestStatusDB.CLOSED, appRequestId
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
    const workflowStages = await getPeriodWorkflowStages({ periodIds: [applications[0]?.periodId], hasEnabledRequirements: true, blocking: false }, db)
    for (const application of applications) {
      await db.execute('UPDATE applications SET computedPhase = ?, workflowStage = ? WHERE id = ?', [ApplicationPhase.WORKFLOW_NONBLOCKING, workflowStages.find(w => w.programKey === application.programKey)?.key, application.internalId])
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
  await db.execute('UPDATE app_requests SET phase = ? WHERE id = ?', [AppRequestPhase.SUBMITTED, appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function appRequestReturnToNonBlocking (appRequestId: number) {
  return await appRequestTransaction(appRequestId, async db => {
    await db.execute('UPDATE app_requests SET phase = ? WHERE id = ?', [AppRequestPhase.WORKFLOW_NONBLOCKING, appRequestId])
    const applications = await getApplications({ appRequestIds: [String(appRequestId)] }, db)
    const workflowStages = await getPeriodWorkflowStages({ periodIds: [applications[0]?.periodId], hasEnabledRequirements: true, blocking: false }, db)
    for (const app of applications) {
      await db.execute('UPDATE applications SET computedPhase = ?, workflowStage = ? WHERE appRequestId = ?', [ApplicationPhase.WORKFLOW_NONBLOCKING, workflowStages.toReversed().find(s => s.programKey === app.programKey), appRequestId])
    }
    await evaluateAppRequest(appRequestId, db)
  })
}

/**
 * This method will fill in any missing application, requirement, or prompt records for the appRequest.
 * It will be called upon creation of an appRequest and each time it is evaluated, in case the system has
 * added a requirement since the last evaluation.
 */
export async function ensureAppRequestRecords (appRequest: AppRequest, db: Queryable) {
  const disabledPrograms = new Set(await db.getvals<string>('SELECT programKey FROM period_programs WHERE periodId = ? AND disabled = 1', [appRequest.periodId]))
  const disabledRequirements = await db.getall<{ programKey: string, requirementKey: string }>('SELECT programKey, requirementKey FROM period_program_requirements WHERE periodId = ? AND disabled = 1', [appRequest.periodId])
  const disabledRequirementLookup = disabledRequirements.reduce((acc, { programKey, requirementKey }) => ({ ...acc, [programKey]: { [requirementKey]: true } }), {} as Record<string, Record<string, boolean>>)
  const programs = programRegistry.list().filter(program => !disabledPrograms.has(program.key))
  const reqKeyLookup: Record<string, Set<string>> = {}
  for (const program of programs) {
    reqKeyLookup[program.key] ??= new Set()
    for (const rkey of program.requirementKeys) {
      if (!disabledRequirementLookup[program.key]?.[rkey]) {
        reqKeyLookup[program.key].add(rkey)
      }
    }
    for (const rkey of program.workflowStages?.flatMap(stage => stage.requirementKeys) ?? []) {
      if (!disabledRequirementLookup[program.key]?.[rkey]) {
        reqKeyLookup[program.key].add(rkey)
      }
    }
  }
  const applications = await syncApplications(appRequest.internalId, new Set(programs.map(p => p.key)), db)
  const allRequirements: ApplicationRequirement[] = []
  const allPrompts: RequirementPrompt[] = []
  for (const application of applications) {
    const enabledKeys = reqKeyLookup[application.programKey] ?? new Set()
    const requirements = await syncRequirementRecords(application, enabledKeys, db)
    allRequirements.push(...requirements)
    for (const requirement of requirements) {
      const prompts = await syncPromptRecords(requirement, db)
      allPrompts.push(...prompts)
    }
  }
  return { applications, requirements: allRequirements, prompts: allPrompts }
}

export const applicantRequirementTypes = new Set<RequirementType>([
  RequirementType.PREQUAL,
  RequirementType.QUALIFICATION,
  RequirementType.POSTQUAL,
  RequirementType.ACCEPTANCE
])

export async function tagAppRequest (appRequestInternalId: number, data: AppRequestData, prompts: RequirementPrompt[], tdb: Queryable = db) {
  const tagRows = []
  const seenPrompts = new Set<string>()
  for (const prompt of prompts) {
    if (seenPrompts.has(prompt.key)) continue
    seenPrompts.add(prompt.key)
    for (const category of prompt.definition.tags ?? []) {
      for (const tag of category.extract(data)) tagRows.push({ category: category.category, tag: tag, indexOnly: 0 })
    }
    for (const index of prompt.definition.indexes ?? []) {
      for (const idx of index.extract(data)) tagRows.push({ category: index.category, tag: idx, indexOnly: 1 })
    }
  }

  if (tagRows.length > 0) {
    const ibinds: any[] = []
    await tdb.insert(`
      INSERT INTO app_request_tags (appRequestId, indexOnly, category, tag)
      VALUES ${tdb.in(ibinds, tagRows.map(r => [appRequestInternalId, r.indexOnly, r.category, r.tag]))}
      ON DUPLICATE KEY UPDATE appRequestId = appRequestId
    `, ibinds)
    const dbinds: any[] = [appRequestInternalId]
    await tdb.delete(`
      DELETE FROM app_request_tags
      WHERE appRequestId = ? AND (category, tag) NOT IN (${tdb.in(dbinds, tagRows.map(r => [r.category, r.tag]))})
    `, dbinds)
  } else {
    await tdb.delete('DELETE FROM app_request_tags WHERE appRequestId = ?', [appRequestInternalId])
  }
}

export async function evaluateAppRequest (appRequestInternalId: number, tdb?: Queryable) {
  // after an appRequest is created and each time it is modified, we will evaluate
  // requirement status and update application and appRequest status accordingly, then
  // save all those results to the database for indexing and querying
  async function action (db: Queryable) {
    const appRequest = (await getAppRequests({ internalIds: [appRequestInternalId] }, db))[0]
    if (!appRequest) throw new Error(`AppRequest ${appRequestInternalId} not found`)

    // if the appRequest is closed or complete, we don't need to evaluate
    if (appRequest.dbStatus !== AppRequestStatusDB.OPEN || appRequest.phase === AppRequestPhase.COMPLETE) return

    const data = (await getAppRequestData([appRequest.internalId], db))[0].data

    // all of the objects we return here are considered mutable - we will be updating
    // them during this evaluation and then we will save them back to the database at
    // the end
    const { applications, requirements, prompts } = await ensureAppRequestRecords(appRequest, db)
    const reqLookup = groupby(requirements, 'applicationId')
    const promptLookup = groupby(prompts, 'requirementId')
    const workflowStageKeys = applications.map(app => app.workflowStageKey).filter(isNotBlank) as string[]
    const workflowStages = await getPeriodWorkflowStages({ periodIds: [appRequest.periodId], workflowKeys: workflowStageKeys }, db)
    const workflowStageLookup = keyby(workflowStages, 'key')
    const workflowStagesByProgramKey = groupby(workflowStages, 'programKey')
    const previousApplicationPhases = applications.reduce((acc, app) => ({ ...acc, [app.programKey]: app.phase }), {} as Record<string, ApplicationPhase>)

    await tagAppRequest(appRequest.internalId, data, prompts, db)

    // grab all the prompt and requirement configurations from this apprequest's period
    const configurations = await db.getall<{ definitionKey: string, data: string }>('SELECT definitionKey, data FROM period_configurations WHERE periodId = ?', [appRequest.periodId])
    const configLookup: Record<string, any> = configurations.map(c => ({ ...c, data: JSON.parse(c.data ?? '{}') })).reduce((acc, c) => ({ ...acc, [c.definitionKey]: c.data }), {})

    for (const prompt of prompts) {
      if (
        /**
         * Some applicant prompts may be optional - as in there are no required fields in them.
         *
         * In this case, they will be undefined upon request creation and {} after being viewed and saved
         * without filling in any fields.
         *
         * We want to consider these prompts unanswered until the applicant has at least seen the screen
         * and hit save. Otherwise the UI may skip over the prompt entirely and the user will never have
         * a chance to fill it in.
         *
         * Reviewers are allowed to leave prompts blank without interacting because their interface is
         * always an overview of all the prompts in an application, so there is no risk of skipping over one.
         *
         * I'm intentionally avoiding using promptRegistry.isUserPrompt() here because in the rare case a
         * prompt is shared between an applicant requirement and a reviewer requirement, we only want the
         * applicant version of the prompt to be answered=false.
         */
        (data[prompt.key] == null && applicantRequirementTypes.has(prompt.requirementType))
        || prompt.invalidated
      ) {
        prompt.answered = false
      } else {
        const validationMessages = prompt.definition.validate?.(data[prompt.key] ?? {}, configLookup[prompt.key] ?? {}, data, configLookup, db) ?? []
        prompt.answered = !validationMessages.some(m => m.type === 'error')
      }
    }

    const promptsSeenInRequest = new Set<string>()
    const promptKeysLocked = new Set<string>()
    for (const application of applications) {
      const requirements = reqLookup[application.id] ?? []
      const workflowStages = workflowStagesByProgramKey[application.programKey] ?? []
      const activeWorkflowStage = application.workflowStageKey ? workflowStageLookup[application.workflowStageKey] : undefined
      const previousWorkflowStages = []
      for (const stage of workflowStages) {
        if (stage.key === application.workflowStageKey) break
        previousWorkflowStages.push(stage)
      }

      const phase = application.phase === ApplicationPhase.COMPLETE || application.phase === ApplicationPhase.READY_TO_COMPLETE
        ? 'complete'
        : appRequest.phase === AppRequestPhase.STARTED
          ? 'applicant'
          : appRequest.phase === AppRequestPhase.ACCEPTANCE
            ? 'acceptance'
            : application.workflowStageKey
              ? activeWorkflowStage?.blocking
                ? 'blocking'
                : 'nonblocking'
              : appRequest.phase === AppRequestPhase.WORKFLOW_NONBLOCKING
                ? 'nonblocking'
                : 'review'

      // in the reviewer's view, we will often want related requirements to be grouped together,
      // so we will probably have a mixed overall order like:
      // requirement: user must upload driver license (PREQUAL)
      // requirement: reviewer must confirm upload is a driver license (APPROVAL)
      // requirement: user must upload proof of insurance (PREQUAL)
      // requirement: reviewer must confirm upload is a proof of insurance (APPROVAL)
      // we therefore cannot demand that the developer put requirements in an order where all prequals
      // precede all approvals, etc. Instead, we will sort them here.
      const prequalRequirements = requirements.filter(req => req.type === RequirementType.PREQUAL)
      const qualificationRequirements = requirements.filter(req => req.type === RequirementType.QUALIFICATION)
      const postqualRequirements = requirements.filter(req => req.type === RequirementType.POSTQUAL)
      const preapprovalRequirements = requirements.filter(req => req.type === RequirementType.PREAPPROVAL)
      const approvalRequirements = requirements.filter(req => req.type === RequirementType.APPROVAL)
      const acceptanceRequirements = requirements.filter(req => req.type === RequirementType.ACCEPTANCE)
      const blockingWorkflowRequirements = requirements.filter(req => req.workflowStageKey ? workflowStageLookup[req.workflowStageKey]?.blocking : false)
      const nonblockingWorkflowRequirements = requirements.filter(req => req.workflowStageKey ? !workflowStageLookup[req.workflowStageKey]?.blocking : false)
      const currentWorkflowRequirements = requirements.filter(req => req.workflowStageKey === application.workflowStageKey)
      const presubmitRequirements = [...prequalRequirements, ...qualificationRequirements, ...postqualRequirements]
      const reviewRequirements = [...presubmitRequirements, ...preapprovalRequirements, ...approvalRequirements]

      // if we are in applicant phase, we only need to evaluate prequal, postqual, and qualification requirements
      // acceptance requirements if we are in acceptance phase, etc
      const sortedRequirements = phase === 'complete'
        ? []
        : phase === 'applicant'
          ? presubmitRequirements
          : phase === 'acceptance'
            ? [...presubmitRequirements, ...reviewRequirements, ...blockingWorkflowRequirements, ...acceptanceRequirements]
            : phase === 'blocking' || phase === 'nonblocking'
              ? currentWorkflowRequirements
              : [...presubmitRequirements, ...reviewRequirements]

      const promptsSeenInApplication = new Set<string>()
      let applicationIsIneligible = false
      for (const requirement of sortedRequirements) {
        const requiredData = {} as AppRequestData
        const prompts = promptLookup[requirement.id] ?? []
        const anyOrderPrompts = prompts.filter(p => requirement.definition.anyOrderPromptKeySet.has(p.key))
        const noDisplayPrompts = prompts.filter(p => requirement.definition.noDisplayPromptKeySet.has(p.key))
        const regularPrompts = prompts.filter(p => !requirement.definition.anyOrderPromptKeySet.has(p.key) && !requirement.definition.noDisplayPromptKeySet.has(p.key))
        let hasUnanswered = false
        for (const prompt of noDisplayPrompts) {
          prompt.visibility = PromptVisibility.UNREACHABLE
          if (!prompt.answered) hasUnanswered = true
          else requiredData[prompt.key] = data[prompt.key]
        }
        let resolveInfo = requirement.definition.resolve(requiredData, configLookup[requirement.definition.key] ?? {}, configLookup)

        const anyOrderAllAnswered = anyOrderPrompts.every(p => p.answered)
        for (const prompt of anyOrderPrompts) {
          prompt.visibility = PromptVisibility.UNREACHABLE
          if (!hasUnanswered && resolveInfo.status === RequirementStatus.PENDING) {
            if (anyOrderAllAnswered) requiredData[prompt.key] = data[prompt.key]
            prompt.visibility = PromptVisibility.AVAILABLE
            promptsSeenInApplication.add(prompt.key)
            promptsSeenInRequest.add(prompt.key)
          }
        }
        if (!hasUnanswered && anyOrderAllAnswered && anyOrderPrompts.length) resolveInfo = requirement.definition.resolve(requiredData, configLookup[requirement.definition.key] ?? {}, configLookup)
        hasUnanswered ||= !anyOrderAllAnswered

        for (const prompt of regularPrompts) {
          prompt.moot = applicationIsIneligible && requirement.type !== RequirementType.WORKFLOW
          if (hasUnanswered || resolveInfo.status !== RequirementStatus.PENDING) prompt.visibility = PromptVisibility.UNREACHABLE
          else {
            if (promptsSeenInApplication.has(prompt.key)) prompt.visibility = PromptVisibility.APPLICATION_DUPE
            else if (promptsSeenInRequest.has(prompt.key)) prompt.visibility = PromptVisibility.REQUEST_DUPE
            else prompt.visibility = PromptVisibility.AVAILABLE
            promptsSeenInApplication.add(prompt.key)
            promptsSeenInRequest.add(prompt.key)
            if (prompt.answered) {
              requiredData[prompt.key] = data[prompt.key]
              resolveInfo = requirement.definition.resolve(requiredData, configLookup[requirement.definition.key] ?? {}, configLookup)
            } else hasUnanswered = true
          }
        }

        requirement.status = resolveInfo.status
        requirement.statusReason = resolveInfo.reason
        if (requirement.status === RequirementStatus.DISQUALIFYING) applicationIsIneligible = true
      }

      const firstFailingRequirement = sortedRequirements.find(r => r.status === RequirementStatus.DISQUALIFYING)
      const firstPendingRequirement = sortedRequirements.find(r => r.status === RequirementStatus.PENDING)
      const nonPassingRequirement = firstFailingRequirement ?? firstPendingRequirement
      const requirementsResolution = firstFailingRequirement != null
        ? 'fail'
        : firstPendingRequirement != null
          ? 'pending'
          : 'pass'

      application.status = phase === 'nonblocking' || phase === 'complete'
        ? application.status
        : phase === 'acceptance'
          ? requirementsResolution === 'pass'
            ? ApplicationStatus.ACCEPTED
            : requirementsResolution === 'fail'
              ? ApplicationStatus.REJECTED
              : ApplicationStatus.ELIGIBLE
          : requirementsResolution === 'pending'
            ? ApplicationStatus.PENDING
            : requirementsResolution === 'fail'
              ? ApplicationStatus.INELIGIBLE
              : ApplicationStatus.ELIGIBLE

      application.statusReason = firstFailingRequirement?.statusReason ?? firstPendingRequirement?.statusReason

      application.phase = phase === 'complete'
        ? ApplicationPhase.COMPLETE
        : phase === 'nonblocking'
          ? application.workflowStageKey
            ? requirementsResolution === 'pass'
              ? ApplicationPhase.READY_FOR_WORKFLOW
              : ApplicationPhase.WORKFLOW_NONBLOCKING
            : ApplicationPhase.READY_TO_COMPLETE
          : phase === 'acceptance'
            ? requirementsResolution !== 'pending'
              ? ApplicationPhase.READY_TO_ACCEPT
              : ApplicationPhase.ACCEPTANCE
            : phase === 'applicant'
              ? requirementsResolution !== 'pending'
                ? ApplicationPhase.READY_TO_SUBMIT
                : nonPassingRequirement?.type === RequirementType.PREQUAL
                  ? ApplicationPhase.PREQUAL
                  : ApplicationPhase.QUALIFICATION
              : phase === 'review'
                ? requirementsResolution !== 'pending'
                  ? application.phase === ApplicationPhase.REVIEW_COMPLETE
                    ? ApplicationPhase.REVIEW_COMPLETE
                    : ApplicationPhase.READY_FOR_WORKFLOW
                  : nonPassingRequirement?.type === RequirementType.PREAPPROVAL
                    ? ApplicationPhase.PREAPPROVAL
                    : ApplicationPhase.APPROVAL
                : requirementsResolution === 'pass' // phase === 'blocking'
                  ? application.phase === ApplicationPhase.REVIEW_COMPLETE
                    ? ApplicationPhase.REVIEW_COMPLETE
                    : ApplicationPhase.READY_FOR_WORKFLOW
                  : ApplicationPhase.WORKFLOW_BLOCKING

      if (application.phase === ApplicationPhase.READY_FOR_WORKFLOW && applications.length === 1 && (!workflowStages.length || workflowStages[workflowStages.length - 1].key === application.workflowStageKey)) {
        application.phase = ApplicationPhase.REVIEW_COMPLETE
      }
      if (requirementsResolution === 'fail') {
        if (phase === 'acceptance') application.ineligiblePhase = IneligiblePhases.ACCEPTANCE
        else if (phase === 'applicant') application.ineligiblePhase = firstFailingRequirement?.type === RequirementType.PREQUAL ? IneligiblePhases.PREQUAL : IneligiblePhases.QUALIFICATION
        else if (phase === 'review') application.ineligiblePhase = firstFailingRequirement?.type === RequirementType.PREAPPROVAL ? IneligiblePhases.PREAPPROVAL : IneligiblePhases.APPROVAL
        else if (phase === 'blocking') application.ineligiblePhase ??= IneligiblePhases.WORKFLOW
      } else if (phase !== 'nonblocking' && phase !== 'blocking' && phase !== 'complete') {
        application.ineligiblePhase = undefined
      }

      const requirementsToLock = []
      if ([ApplicationPhase.REVIEW_COMPLETE].includes(application.phase)) {
        requirementsToLock.push(...reviewRequirements)
      } else if ([ApplicationPhase.READY_TO_COMPLETE, ApplicationPhase.COMPLETE].includes(application.phase)) {
        requirementsToLock.push(...requirements)
      } else if (phase === 'blocking') {
        requirementsToLock.push(...reviewRequirements, ...blockingWorkflowRequirements.slice(0, findIndex(blockingWorkflowRequirements, r => r.workflowStageKey === application.workflowStageKey) ?? blockingWorkflowRequirements.length))
      } else if (phase === 'nonblocking') {
        requirementsToLock.push(...reviewRequirements, ...blockingWorkflowRequirements, ...acceptanceRequirements, ...nonblockingWorkflowRequirements.slice(0, findIndex(nonblockingWorkflowRequirements, r => r.workflowStageKey === application.workflowStageKey) ?? nonblockingWorkflowRequirements.length))
      } else if (phase === 'acceptance') {
        requirementsToLock.push(...reviewRequirements, ...blockingWorkflowRequirements)
      }
      for (const requirement of requirementsToLock) {
        for (const prompt of prompts.filter(p => p.requirementId === requirement.id)) {
          promptKeysLocked.add(prompt.key)
        }
      }
    }

    for (const prompt of prompts) {
      prompt.locked = promptKeysLocked.has(prompt.key)
    }

    // determine appRequest status based on the application statuses
    if (applications.every(a => a.status === ApplicationStatus.INELIGIBLE || a.status === ApplicationStatus.REJECTED)) {
      if (applications.some(a => a.ineligiblePhase === IneligiblePhases.ACCEPTANCE)) appRequest.status = AppRequestStatus.NOT_ACCEPTED
      else if (applications.some(a => a.ineligiblePhase === IneligiblePhases.APPROVAL || a.ineligiblePhase === IneligiblePhases.WORKFLOW)) appRequest.status = AppRequestStatus.NOT_APPROVED
      else appRequest.status = AppRequestStatus.DISQUALIFIED
    } else if (applications.some(a => a.phase === ApplicationPhase.READY_TO_SUBMIT) && !applications.some(a => a.status === ApplicationStatus.PENDING)) appRequest.status = AppRequestStatus.READY_TO_SUBMIT
    else if (applications.some(a => a.phase === ApplicationPhase.READY_FOR_WORKFLOW)) appRequest.status = AppRequestStatus.APPROVAL
    else if (applications.some(a => a.phase === ApplicationPhase.REVIEW_COMPLETE) && !applications.some(a => a.status === ApplicationStatus.PENDING)) appRequest.status = AppRequestStatus.REVIEW_COMPLETE
    else if (applications.some(a => a.phase === ApplicationPhase.READY_TO_ACCEPT) && !applications.some(a => a.status === ApplicationStatus.PENDING)) appRequest.status = AppRequestStatus.READY_TO_ACCEPT
    else if (applications.some(a => a.phase === ApplicationPhase.ACCEPTANCE)) appRequest.status = AppRequestStatus.ACCEPTANCE
    else if (applications.some(a => a.phase === ApplicationPhase.PREAPPROVAL)) appRequest.status = AppRequestStatus.PREAPPROVAL
    else if (applications.some(a => a.phase === ApplicationPhase.WORKFLOW_BLOCKING)) appRequest.status = AppRequestStatus.APPROVAL
    else if (applications.some(a => a.phase === ApplicationPhase.APPROVAL)) appRequest.status = AppRequestStatus.APPROVAL
    else if (applications.some(a => a.phase === ApplicationPhase.WORKFLOW_NONBLOCKING)) appRequest.status = applications.some(a => a.status === ApplicationStatus.ACCEPTED) ? AppRequestStatus.ACCEPTED : AppRequestStatus.APPROVED
    else if (applications.every(a => a.phase === ApplicationPhase.COMPLETE)) appRequest.status = applications.some(a => a.status === ApplicationStatus.ACCEPTED) ? AppRequestStatus.ACCEPTED : AppRequestStatus.APPROVED
    else appRequest.status = AppRequestStatus.STARTED

    appRequest.readyToComplete = appRequest.phase === AppRequestPhase.WORKFLOW_NONBLOCKING && applications.every(a => a.phase === ApplicationPhase.READY_TO_COMPLETE)

    // save the results of the evaluation to the database
    await updateAppRequestComputed(appRequest, db)
    await updateApplicationsComputed(applications, db)
    await updateRequirementComputed(requirements, db)
    await updatePromptComputed(prompts, db)

    return previousApplicationPhases
  }

  if (tdb) return await action(tdb)
  return await appRequestTransaction(appRequestInternalId, action)
}

export async function recordAppRequestActivity (appRequestId: number, userId: number, action: string, info?: { description?: string, data?: any, impersonatedBy?: number }, tdb: Queryable = db) {
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
}

export async function getAppRequestActivity (filter: AppRequestActivityFilters) {
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
  if (filter.happenedAfter) {
    where.push('createdAt >= ?')
    binds.push(filter.happenedAfter.toJSDate())
  }
  if (filter.happenedBefore) {
    where.push('createdAt <= ?')
    binds.push(filter.happenedBefore.toJSDate())
  }

  const rows = await db.getall<AppRequestActivityRow>(`
    SELECT ara.* FROM app_request_activity ara
    INNER JOIN accessUsers u ON u.id = ara.userId
    LEFT JOIN accessUsers iu ON iu.id = ara.impersonatedBy
    WHERE (${where.join(') AND (')})
    ORDER BY ara.createdAt DESC
  `, binds)
  return rows.map(row => new AppRequestActivity(row))
}

export async function addAppRequestNote (appRequestId: number, authorId: number, note: string, internal: boolean) {
  await db.insert(`
    INSERT INTO app_request_notes (appRequestId, userId, content, internal)
    VALUES (?, ?, ?, ?)
  `, [appRequestId, authorId, note, internal])
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
