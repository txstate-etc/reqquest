import type { Context } from '@txstate-mws/graphql-server'
import type { FastifyTxStateAuthInfo } from 'fastify-txstate'
import type { GraphQLError } from 'graphql'
import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { clone, groupby, isNotBlank, keyby, omit, stringify } from 'txstate-utils'
import { ApplicationPhase, ApplicationRequirement, ApplicationStatus, AppRequest, AppRequestActivity, AppRequestActivityFilters, AppRequestFilter, AppRequestStatus, getPeriodWorkflowStages, IneligiblePhases, programRegistry, promptRegistry, PromptVisibility, RequirementPrompt, RequirementStatus, RequirementType, RQContext, syncApplications, syncPromptRecords, syncRequirementRecords, updateApplicationsComputed, updatePromptComputed, updateRequirementComputed, type AppRequestData } from '../internal.js'

/**
 * This is the status of the whole appRequest as stored in the database. Each application
 * within the request may have its own status. For instance, the appRequest might be CLOSED,
 * but some applications will be INELIGIBLE while others are APPROVED or NOT_APPROVED.
 */
export enum AppRequestStatusDB {
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
  // The request has been closed.
  CLOSED = 'CLOSED',
  // The request has been cancelled.
  CANCELLED = 'CANCELLED',
  // The request was withdrawn after submission. The applicant may re-open but
  // the request should go back to SUBMITTED - the applicant may not
  // make edits unless the reviewer sends it back to STARTED.
  WITHDRAWN = 'WITHDRAWN'
}

export const closedStatuses = new Set<AppRequestStatusDB>([
  AppRequestStatusDB.CANCELLED,
  AppRequestStatusDB.CLOSED,
  AppRequestStatusDB.WITHDRAWN
])

export interface AppRequestRow {
  id: number
  periodId: number
  userId: number
  status: AppRequestStatusDB
  computedStatus: AppRequestStatus
  createdAt: Date
  updatedAt: Date
  closedAt: Date
  dataVersion: number
  periodClosesAt?: Date
  periodArchivesAt?: Date
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
  const rows = await db.getall<AppRequestRowData>(`SELECT id, data FROM app_requests WHERE id = ${db.in([], ids)}`, ids)
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
    SELECT DISTINCT ar.id, ar.periodId, ar.userId, ar.status, ar.computedStatus, ar.createdAt, ar.updatedAt, ar.closedAt, ar.dataVersion,
      p.closeDate AS periodClosesAt, p.archiveDate AS periodArchivesAt, p.openDate AS periodOpensAt
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
  await db.execute('UPDATE app_requests SET computedStatus = ? WHERE id = ?', [appRequest.status, appRequest.internalId])
}

export async function createAppRequest (periodId: number, userId: number) {
  const appRequestId = await db.insert('INSERT INTO app_requests (periodId, userId) VALUES (?, ?)', [periodId, userId])
  await evaluateAppRequest(appRequestId)
  return appRequestId
}

export async function updateAppRequestData (appRequestId: number, data: AppRequestData, dataVersion?: number) {
  const where = dataVersion != null ? ' AND dataVersion = ?' : ''
  const binds: any[] = [JSON.stringify(data), appRequestId]
  if (dataVersion != null) binds.push(dataVersion)
  const rowsAffected = await db.update('UPDATE app_requests SET data = ?, dataVersion = dataVersion + 1 WHERE id = ?' + where, binds)
  if (!rowsAffected) throw new Error('Someone else is working on the same request and made changes since you loaded. Copy any unsaved work into another document and reload the page to see what has changed.')
  await evaluateAppRequest(appRequestId)
}

export async function submitAppRequest (appRequestId: number) {
  await db.update('UPDATE app_requests SET status = ?, submittedData = data, submittedAt=NOW() WHERE id = ?', [AppRequestStatusDB.SUBMITTED, appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function returnAppRequest (appRequestId: number, dataVersion?: number) {
  await appRequestTransaction(appRequestId, async db => {
    const where = dataVersion != null ? ' AND dataVersion = ?' : ''
    const binds: any[] = [AppRequestStatusDB.STARTED, appRequestId]
    if (dataVersion != null) binds.push(dataVersion)
    const updated = await db.update('UPDATE app_requests SET status = ?, submittedAt = NULL WHERE id = ?' + where, binds)
    if (!updated) throw new Error('Someone else is working on the same request and made changes since you loaded. Reload the page to try again.')
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function restoreAppRequest (appRequestId: number) {
  await db.update('UPDATE app_requests SET status = ?, data = submittedData WHERE id = ?', [AppRequestStatusDB.SUBMITTED, appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function closeAppRequest (appRequestId: number) {
  await db.update('UPDATE app_requests SET status = ?, closedAt = NOW() WHERE id = ?', [
    AppRequestStatusDB.CLOSED, appRequestId
  ])
}

export async function cancelAppRequest (appRequestId: number, existingDataVersion?: number) {
  return await db.transaction(async db => {
    const row = await db.getrow<Pick<AppRequestRow, 'status' | 'dataVersion'>>('SELECT status, dataVersion FROM app_requests WHERE id = ? FOR UPDATE', [appRequestId])
    if (!row) throw new Error(`AppRequest ${appRequestId} not found`)
    if (existingDataVersion && row.dataVersion !== existingDataVersion) throw new Error(`AppRequest ${appRequestId} has been modified by another user. Reload the page and try cancelling again if it is still eligible.`)
    const withdrawn = row.status === AppRequestStatusDB.SUBMITTED
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
    if (![AppRequestStatusDB.CANCELLED, AppRequestStatusDB.WITHDRAWN, AppRequestStatusDB.CLOSED].includes(dbStatus)) throw new Error(`AppRequest ${appRequestId} is already open.`)
    const newStatus = dbStatus === AppRequestStatusDB.CANCELLED
      ? AppRequestStatusDB.STARTED
      : AppRequestStatusDB.SUBMITTED
    await db.update('UPDATE app_requests SET status = ?, closedAt = NULL WHERE id = ?', [newStatus, appRequestId])
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function acceptOffer (appRequestId: number, existingDataVersion?: number) {
  return await appRequestTransaction(appRequestId, async db => {
    const row = await db.getrow<{ computedStatus: AppRequestStatus, dataVersion: number, periodId: number }>('SELECT computedStatus, dataVersion, periodId FROM app_requests WHERE id = ?', [appRequestId])
    if (!row) throw new Error(`AppRequest ${appRequestId} not found`)
    if (existingDataVersion && row.dataVersion !== existingDataVersion) throw new Error('Someone else is working on the same request and made changes since you loaded. Reload the page to try again.')
    if (row.computedStatus !== AppRequestStatus.READY_TO_ACCEPT) throw new Error(`AppRequest ${appRequestId} is not ready to accept.`)
    const nonblockingWorkflows = await db.getvals<string>('SELECT DISTINCT stageKey FROM period_workflow_stages WHERE periodId = ? AND blocking = 0', [row.periodId])
    let newStatus: AppRequestStatusDB
    if (nonblockingWorkflows.length) {
      newStatus = AppRequestStatusDB.WORKFLOW_NONBLOCKING
    } else {
      newStatus = AppRequestStatusDB.CLOSED
      await db.update('UPDATE applications SET computedPhase = ? WHERE appRequestId = ?', [ApplicationPhase.COMPLETE, appRequestId])
    }
    await db.update('UPDATE app_requests SET status = ?, computedStatus = ? WHERE id = ?', [newStatus, AppRequestStatus.ACCEPTED, appRequestId])
    await evaluateAppRequest(appRequestId, db)
  })
}

export async function appRequestMakeOffer (appRequestId: number) {
  await db.execute('UPDATE app_requests SET status = ? WHERE id = ?', [AppRequestStatusDB.ACCEPTANCE, appRequestId])
  await evaluateAppRequest(appRequestId)
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

    // if the appRequest is closed, we don't need to evaluate
    if ([AppRequestStatusDB.CLOSED, AppRequestStatusDB.CANCELLED, AppRequestStatusDB.WITHDRAWN].includes(appRequest.dbStatus)) return

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

    await tagAppRequest(appRequest.internalId, data, prompts, db)

    // grab all the prompt and requirement configurations from this apprequest's period
    const configurations = await db.getall<{ definitionKey: string, data: string }>('SELECT definitionKey, data FROM period_configurations WHERE periodId = ?', [appRequest.periodId])
    const configLookup: Record<string, any> = configurations.map(c => ({ ...c, data: JSON.parse(c.data ?? '{}') })).reduce((acc, c) => ({ ...acc, [c.definitionKey]: c.data }), {})

    const promptsSeenInRequest = new Set<string>()
    for (const application of applications) {
      const requirements = reqLookup[application.id] ?? []
      const workflowStages = workflowStagesByProgramKey[application.programKey] ?? []
      const activeWorkflowStage = application.workflowStageKey ? workflowStageLookup[application.workflowStageKey] : undefined
      const previousWorkflowStages = []
      for (const stage of workflowStages) {
        if (stage.key === application.workflowStageKey) break
        previousWorkflowStages.push(stage)
      }

      const phase = appRequest.dbStatus === AppRequestStatusDB.STARTED
        ? 'applicant'
        : appRequest.dbStatus === AppRequestStatusDB.ACCEPTANCE
          ? 'acceptance'
          : application.workflowStageKey
            ? activeWorkflowStage?.blocking
              ? 'blocking'
              : 'nonblocking'
            : 'review'

      // in the reviewer's view, we will often want related requirements to be grouped together,
      // so we will probably have a mixed overall order like:
      // requirement: user must upload driver license (PREQUAL)
      // requirement: reviewer must confirm upload is a driver license (APPROVAL)
      // requirement: user must upload proof of insurance (PREQUAL)
      // requirement: reviewer must confirm upload is a proof of insurance (APPROVAL)
      // we therefore cannot demand that the developer put requirements in an order where all prequals
      // precede all approvals, etc. Instead, we will sort them here.
      const prequalRequirements = requirements.filter(req => req.definition.type === 'PREQUAL')
      const qualificationRequirements = requirements.filter(req => req.definition.type === 'QUALIFICATION')
      const postqualRequirements = requirements.filter(req => req.definition.type === 'POSTQUAL')
      const preapprovalRequirements = requirements.filter(req => req.definition.type === 'PREAPPROVAL')
      const approvalRequirements = requirements.filter(req => req.definition.type === 'APPROVAL')
      const acceptanceRequirements = requirements.filter(req => req.definition.type === 'ACCEPTANCE')
      const blockingWorkflowRequirements = requirements.filter(req => req.workflowStageKey ? workflowStageLookup[req.workflowStageKey]?.blocking : false)
      const currentWorkflowRequirements = requirements.filter(req => req.workflowStageKey === application.workflowStageKey)

      // if we are in applicant phase, we only need to evaluate prequal and qualification requirements
      // or perhaps acceptance requirements if we are in acceptance phase
      const sortedRequirements = phase === 'applicant'
        ? [...prequalRequirements, ...qualificationRequirements, ...postqualRequirements]
        : phase === 'acceptance'
          ? acceptanceRequirements
          : phase === 'blocking' || phase === 'nonblocking'
            ? currentWorkflowRequirements
            : [...prequalRequirements, ...qualificationRequirements, ...preapprovalRequirements, ...approvalRequirements, ...blockingWorkflowRequirements]

      for (const prompt of prompts) {
        prompt.answered = prompt.definition.answered?.(data[prompt.key] ?? {}, configLookup[prompt.key] ?? {}) ?? false
      }

      const promptsSeenInApplication = new Set<string>()
      for (const requirement of sortedRequirements) {
        const requiredData = {} as AppRequestData
        let resolveInfo = requirement.definition.resolve(requiredData, configLookup[requirement.definition.key] ?? {}, configLookup)
        const prompts = promptLookup[requirement.id] ?? []
        const anyOrderPrompts = prompts.filter(p => requirement.definition.anyOrderPromptKeySet.has(p.key))
        const regularPrompts = prompts.filter(p => !requirement.definition.anyOrderPromptKeySet.has(p.key))
        for (const prompt of anyOrderPrompts) prompt.visibility = PromptVisibility.AVAILABLE
        if (anyOrderPrompts.every(p => p.answered)) {
          for (const prompt of anyOrderPrompts) {
            requiredData[prompt.key] = data[prompt.key]
            promptsSeenInApplication.add(prompt.key)
            promptsSeenInRequest.add(prompt.key)
          }
          if (anyOrderPrompts.length) resolveInfo = requirement.definition.resolve(requiredData, configLookup[requirement.definition.key] ?? {}, configLookup)
          let hasUnanswered = false
          for (const prompt of regularPrompts) {
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
        }
        requirement.status = resolveInfo.status
        requirement.statusReason = resolveInfo.reason
      }

      const firstFailingRequirement = sortedRequirements.find(r => r.status === RequirementStatus.DISQUALIFYING)
      const firstPendingRequirement = sortedRequirements.find(r => r.status === RequirementStatus.PENDING)
      const nonPassingRequirement = firstFailingRequirement ?? firstPendingRequirement
      const requirementsResolution = firstPendingRequirement != null
        ? 'pending'
        : firstFailingRequirement != null
          ? 'fail'
          : 'pass'

      application.status = phase === 'nonblocking'
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

      application.phase = phase === 'nonblocking'
        ? application.phase
        : phase === 'acceptance'
          ? requirementsResolution !== 'pending'
            ? ApplicationPhase.READY_TO_ACCEPT
            : ApplicationPhase.ACCEPTANCE
          : phase === 'applicant'
            ? requirementsResolution === 'pass'
              ? ApplicationPhase.READY_TO_SUBMIT
              : nonPassingRequirement?.type === RequirementType.PREQUAL
                ? ApplicationPhase.PREQUAL
                : ApplicationPhase.QUALIFICATION
            : phase === 'review'
              ? requirementsResolution !== 'pending'
                ? ApplicationPhase.READY_FOR_WORKFLOW
                : nonPassingRequirement?.type === RequirementType.PREAPPROVAL
                  ? ApplicationPhase.PREAPPROVAL
                  : ApplicationPhase.APPROVAL
              : requirementsResolution === 'pass' // phase === 'blocking'
                ? ApplicationPhase.READY_FOR_WORKFLOW
                : ApplicationPhase.WORKFLOW_BLOCKING

      if (application.phase === ApplicationPhase.READY_FOR_WORKFLOW && (!workflowStages.length || workflowStages[workflowStages.length - 1].key === application.workflowStageKey)) {
        application.phase = ApplicationPhase.READY_FOR_OFFER
      } else if (requirementsResolution === 'fail') {
        if (phase === 'acceptance') application.ineligiblePhase = IneligiblePhases.ACCEPTANCE
        else if (phase === 'applicant') application.ineligiblePhase = application.phase === ApplicationPhase.PREQUAL ? IneligiblePhases.PREQUAL : IneligiblePhases.QUALIFICATION
        else if (phase === 'review') application.ineligiblePhase = application.phase === ApplicationPhase.PREAPPROVAL ? IneligiblePhases.PREAPPROVAL : IneligiblePhases.APPROVAL
        else if (phase === 'blocking') application.ineligiblePhase ??= IneligiblePhases.WORKFLOW
      }
    }

    // determine appRequest status based on the application statuses
    if (appRequest.dbStatus === AppRequestStatusDB.WITHDRAWN) appRequest.status = AppRequestStatus.WITHDRAWN
    else if (appRequest.dbStatus === AppRequestStatusDB.CANCELLED) appRequest.status = AppRequestStatus.CANCELLED
    else if (applications.every(a => a.status === ApplicationStatus.INELIGIBLE || a.status === ApplicationStatus.REJECTED)) {
      if (applications.some(a => a.ineligiblePhase === IneligiblePhases.ACCEPTANCE)) appRequest.status = AppRequestStatus.NOT_ACCEPTED
      else if (applications.some(a => a.ineligiblePhase === IneligiblePhases.APPROVAL || a.ineligiblePhase === IneligiblePhases.WORKFLOW)) appRequest.status = AppRequestStatus.NOT_APPROVED
      else appRequest.status = AppRequestStatus.DISQUALIFIED
    } else if (applications.some(a => a.phase === ApplicationPhase.READY_TO_SUBMIT) && !applications.some(a => a.status === ApplicationStatus.PENDING)) appRequest.status = AppRequestStatus.READY_TO_SUBMIT
    else if (applications.some(a => a.phase === ApplicationPhase.READY_FOR_OFFER) && !applications.some(a => a.status === ApplicationStatus.PENDING)) appRequest.status = AppRequestStatus.APPROVED
    else if (applications.some(a => a.phase === ApplicationPhase.READY_TO_ACCEPT) && !applications.some(a => a.status === ApplicationStatus.PENDING)) appRequest.status = AppRequestStatus.READY_TO_ACCEPT
    else if (applications.some(a => a.phase === ApplicationPhase.ACCEPTANCE)) appRequest.status = AppRequestStatus.ACCEPTANCE
    else if (applications.some(a => a.phase === ApplicationPhase.PREAPPROVAL)) appRequest.status = AppRequestStatus.PREAPPROVAL
    else if (applications.some(a => a.phase === ApplicationPhase.WORKFLOW_BLOCKING)) appRequest.status = AppRequestStatus.APPROVAL
    else if (applications.some(a => a.phase === ApplicationPhase.APPROVAL)) appRequest.status = AppRequestStatus.APPROVAL
    else if (applications.some(a => a.phase === ApplicationPhase.WORKFLOW_NONBLOCKING)) appRequest.status = AppRequestStatus.APPROVED
    else if (applications.every(a => a.phase === ApplicationPhase.COMPLETE)) appRequest.status = AppRequestStatus.APPROVED
    else appRequest.status = AppRequestStatus.STARTED

    // save the results of the evaluation to the database
    await updateAppRequestComputed(appRequest, db)
    await updateApplicationsComputed(applications, db)
    await updateRequirementComputed(requirements, db)
    await updatePromptComputed(prompts, db)
  }

  if (tdb) return await action(tdb)
  return await appRequestTransaction(appRequestInternalId, action)
}

export async function recordAppRequestActivity (appRequestId: number, userId: number, action: string, info?: { description?: string, data?: any, impersonatedBy?: number }) {
  await db.insert(`
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

export async function appRequestTransaction (appRequestInternalId: number, callback: (db: Queryable) => Promise<void>) {
  return await db.transaction(async db => {
    // lock the appRequest while we evaluate
    await db.getval('SELECT id FROM app_requests WHERE id = ? FOR UPDATE', [appRequestInternalId])
    await callback(db)
  }, { retries: 2 })
}
