import type { Context } from '@txstate-mws/graphql-server'
import type { FastifyTxStateAuthInfo } from 'fastify-txstate'
import type { GraphQLError } from 'graphql'
import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { clone, groupby, omit, stringify } from 'txstate-utils'
import { ApplicationRequirement, ApplicationStatus, AppRequest, AppRequestActivity, AppRequestActivityFilters, AppRequestFilter, AppRequestStatus, programRegistry, promptRegistry, PromptVisibility, RequirementPrompt, RequirementStatus, RequirementType, RQContext, syncApplications, syncPromptRecords, syncRequirementRecords, updateApplicationsComputed, updatePromptComputed, updateRequirementComputed, type AppRequestData } from '../internal.js'

/**
 * This is the status of the whole appRequest as stored in the database. Each application
 * within the request may have its own status. For instance, the appRequest might be CLOSED,
 * but some applications will be INELIGIBLE while others are APPROVED or NOT_APPROVED.
 */
export enum AppRequestStatusDB {
  // The request has been started but not yet submitted.
  STARTED = 'STARTED',
  // The request has been submitted for review.
  SUBMITTED = 'SUBMITTED',
  // At least one application has been approved by the reviewer and the reviewer
  // moved it to this state where we are waiting for the applicant to accept the offer(s).
  ACCEPTANCE = 'ACCEPTANCE',
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
  return { joins, where, binds }
}

export async function getAppRequests (filter?: AppRequestFilter, tdb: Queryable = db) {
  const { joins, where, binds } = processFilters(filter)
  const rows = await tdb.getall<AppRequestRow>(`
    SELECT ar.id, ar.periodId, ar.userId, ar.status, ar.computedStatus, ar.createdAt, ar.updatedAt, ar.closedAt,
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

export async function updateAppRequestData (appRequestId: number, data: AppRequestData) {
  await db.execute('UPDATE app_requests SET data = ? WHERE id = ?', [JSON.stringify(data), appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function submitAppRequest (appRequestId: number) {
  await db.execute('UPDATE app_requests SET status = ?, submittedData = data WHERE id = ?', [AppRequestStatusDB.SUBMITTED, appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function restoreAppRequest (appRequestId: number) {
  await db.execute('UPDATE app_requests SET status = ?, data = submittedData WHERE id = ?', [AppRequestStatusDB.SUBMITTED, appRequestId])
  await evaluateAppRequest(appRequestId)
}

export async function closeAppRequest (appRequestId: number) {
  await db.update('UPDATE app_requests SET status = ?, closedAt = NOW() WHERE id = ?', [
    AppRequestStatusDB.CLOSED, appRequestId
  ])
}

export async function cancelAppRequest (appRequestId: number) {
  await db.transaction(async db => {
    const dbStatus = await db.getval<AppRequestStatusDB>('SELECT status FROM app_requests WHERE id = ? FOR UPDATE', [appRequestId])
    const withdrawn = dbStatus === AppRequestStatusDB.SUBMITTED
    await db.update('UPDATE app_requests SET status = ?, computedStatus = ? WHERE id = ?', [
      withdrawn ? AppRequestStatusDB.WITHDRAWN : AppRequestStatusDB.CANCELLED,
      withdrawn ? AppRequestStatus.WITHDRAWN : AppRequestStatus.CANCELLED,
      appRequestId
    ])
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

const failureStatusLookup = {
  [RequirementType.PREQUAL]: ApplicationStatus.FAILED_PREQUAL,
  [RequirementType.QUALIFICATION]: ApplicationStatus.FAILED_QUALIFICATION,
  [RequirementType.POSTQUAL]: ApplicationStatus.FAILED_QUALIFICATION,
  [RequirementType.PREAPPROVAL]: ApplicationStatus.NOT_APPROVED,
  [RequirementType.APPROVAL]: ApplicationStatus.NOT_APPROVED,
  [RequirementType.ACCEPTANCE]: ApplicationStatus.NOT_ACCEPTED
}

const metStatusLookup = {
  [RequirementType.PREQUAL]: ApplicationStatus.PREQUAL,
  [RequirementType.QUALIFICATION]: ApplicationStatus.QUALIFICATION,
  [RequirementType.POSTQUAL]: ApplicationStatus.QUALIFICATION,
  [RequirementType.PREAPPROVAL]: ApplicationStatus.PREAPPROVAL,
  [RequirementType.APPROVAL]: ApplicationStatus.APPROVED,
  [RequirementType.ACCEPTANCE]: ApplicationStatus.ACCEPTED
}

export const applicantRequirementTypes = new Set<RequirementType>([
  RequirementType.PREQUAL,
  RequirementType.QUALIFICATION,
  RequirementType.POSTQUAL,
  RequirementType.ACCEPTANCE
])

export async function evaluateAppRequest (appRequestInternalId: number) {
  // after an appRequest is created and each time it is modified, we will evaluate
  // requirement status and update application and appRequest status accordingly, then
  // save all those results to the database for indexing and querying

  return await db.transaction(async db => {
    // lock the appRequest while we evaluate
    await db.getval('SELECT id FROM app_requests WHERE id = ? FOR UPDATE', [appRequestInternalId])

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
      await db.insert(`
        INSERT INTO app_request_tags (appRequestId, indexOnly, category, tag)
        VALUES ${db.in(ibinds, tagRows.map(r => [appRequestInternalId, r.indexOnly, r.category, r.tag]))}
        ON DUPLICATE KEY UPDATE appRequestId = appRequestId
      `, ibinds)
      const dbinds: any[] = [appRequestInternalId]
      await db.delete(`
        DELETE FROM app_request_tags
        WHERE appRequestId = ? AND (category, tag) NOT IN (${db.in(dbinds, tagRows.map(r => [r.category, r.tag]))})
      `, dbinds)
    } else {
      await db.delete('DELETE FROM app_request_tags WHERE appRequestId = ?', [appRequestInternalId])
    }

    // grab all the prompt and requirement configurations from this apprequest's period
    const configurations = await db.getall<{ definitionKey: string, data: string }>('SELECT definitionKey, data FROM period_configurations WHERE periodId = ?', [appRequest.periodId])
    const configLookup: Record<string, any> = configurations.map(c => ({ ...c, data: JSON.parse(c.data ?? '{}') })).reduce((acc, c) => ({ ...acc, [c.definitionKey]: c.data }), {})

    // keeping track of which prompts have been evaluated so that we can avoid evaluating them twice
    const promptEvaluations: Record<string, boolean> = {}

    for (const application of applications) {
      const requirements = reqLookup[application.id] ?? []

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
      const preapprovalRequirements = requirements.filter(req => req.definition.type === 'PREAPPROVAL')
      const approvalRequirements = requirements.filter(req => req.definition.type === 'APPROVAL')
      const acceptanceRequirements = requirements.filter(req => req.definition.type === 'ACCEPTANCE')

      // if we are in applicant phase, we only need to evaluate prequal and qualification requirements
      // or perhaps acceptance requirements if we are in acceptance phase
      const sortedRequirements = appRequest.dbStatus === AppRequestStatusDB.STARTED
        ? [...prequalRequirements, ...qualificationRequirements]
        : appRequest.dbStatus === AppRequestStatusDB.ACCEPTANCE
          ? acceptanceRequirements
          : [...prequalRequirements, ...qualificationRequirements, ...preapprovalRequirements, ...approvalRequirements]

      // initialize some tracking variables that we will update during this process
      application.status = appRequest.dbStatus === AppRequestStatusDB.STARTED
        ? ApplicationStatus.PREQUAL
        : appRequest.dbStatus === AppRequestStatusDB.SUBMITTED
          ? ApplicationStatus.PREAPPROVAL
          : ApplicationStatus.ACCEPTANCE
      application.statusReason = undefined
      let hasPending = false
      let hasIneligible = false
      let reqEvaluationBroken = false
      const promptsSeenInApplication = new Set<string>()
      const unreachablePrompts = new Set<string>()
      let lastType: RequirementType | undefined
      for (const requirement of sortedRequirements) {
        requirement.status = RequirementStatus.PENDING
        if (requirement.definition.visiblePromptKeys.some(key => unreachablePrompts.has(key))) reqEvaluationBroken = true

        // we use reqEvaluationBroken instead of a loop break because we need to set
        // the reachable status on all requirements/prompts, so we have to continue looping and
        // setting all remaining unevaluated requirements and their prompts to unreachable
        if (reqEvaluationBroken) {
          requirement.reachable = false
          for (const prompt of promptLookup[requirement.id] ?? []) {
            prompt.visibility = PromptVisibility.UNREACHABLE
            prompt.answered = false
          }
          continue
        } else {
          requirement.reachable = true
        }

        const requirementConfig = configLookup[requirement.definition.key] ?? {}

        // this requirement has not been evaluated yet, so we need to do that; we
        // don't want to `continue` the loop because we need to update the status
        // of the application based on the result, even if we calculated that result
        // processing an earlier application
        const prompts = promptLookup[requirement.id] ?? []
        let promptEvaluationBroken = false
        let allPromptsAnswered = true
        const dataRequired = {} as AppRequestData
        for (const prompt of prompts) {
          if (requirement.status !== RequirementStatus.PENDING) {
            promptEvaluationBroken = true
            allPromptsAnswered = false
          }
          if (promptEvaluationBroken) {
            prompt.visibility = PromptVisibility.UNREACHABLE
            prompt.answered = false
            continue
          } else prompt.visibility = requirement.definition.noDisplayPromptKeySet.has(prompt.key) ? PromptVisibility.AUTOMATION : PromptVisibility.AVAILABLE
          if (promptEvaluations[prompt.key] != null) prompt.visibility = PromptVisibility.REQUEST_DUPE
          if (promptEvaluations[prompt.key] == null) {
            const promptConfig = configLookup[prompt.key] ?? {}
            promptEvaluations[prompt.key] = prompt.invalidated ? false : prompt.definition.answered?.(data[prompt.key] ?? {}, promptConfig) ?? true
          }
          prompt.answered = promptEvaluations[prompt.key]
          if (!prompt.answered) allPromptsAnswered = false
          if (promptsSeenInApplication.has(prompt.key)) prompt.visibility = PromptVisibility.APPLICATION_DUPE
          promptsSeenInApplication.add(prompt.key)

          // only include data from completed prompts, but go ahead and evaluate requirements
          // with unanswered prompts in case they can make early determinations (as long as
          // they don't depend on partial answers to unanswered prompts)
          if (promptEvaluations[prompt.key]) {
            dataRequired[prompt.key] = data[prompt.key]
            // If we have anyOrder prompts, we can't evaluate the requirement with partial data
            // because we could end up making one of them moot after it's already out and on display
            // to the user - we don't want to have it disappear suddenly.
            // So we will avoid calling resolve on anyOrder prompts as we loop through
            // See RequirementDefinition.promptsAnyOrder for more information
            if (!requirement.definition.anyOrderPromptKeySet.has(prompt.key)) {
              const { status, reason } = requirement.definition.resolve(dataRequired, requirementConfig, configLookup)
              requirement.status = status
              requirement.statusReason = reason
            }
          } else if (!requirement.definition.anyOrderPromptKeySet.has(prompt.key)) promptEvaluationBroken = true
        }

        // now that we have evaluated all prompts, if they are all answered, we can
        // evaluate our requirement with all the data (including data from anyOrder prompts)
        if (requirement.definition.anyOrderPromptKeySet.size > 0 && allPromptsAnswered) {
          const { status, reason } = requirement.definition.resolve(dataRequired, requirementConfig, configLookup)
          requirement.status = status
          requirement.statusReason = reason
        }

        // now we have the requirement status (either cached or fresh), so we can update the
        // application status
        if (requirement.status === RequirementStatus.DISQUALIFYING) {
          // if this requirement was disqualifying, we need to stop processing and give the
          // application one of the failure statuses
          application.status = failureStatusLookup[requirement.definition.type]
          application.statusReason = requirement.statusReason
          hasIneligible = true
          reqEvaluationBroken = true
        } else if ([RequirementStatus.MET, RequirementStatus.NOT_APPLICABLE, RequirementStatus.WARNING].includes(requirement.status)) {
          // if this is one of the met statuses, we will upgrade the application status to at least match
          // the requirement that just passed... we do need another piece of code to upgrade the status if
          // all requirements of the previous type have passed and the first requirement of the next type is
          // pending
          application.status = metStatusLookup[requirement.definition.type]
        } else { // PENDING
          // this is that code I spoke of a few lines above that upgrades the application status
          // if the first requirement of a certain type is pending
          if (requirement.definition.type !== lastType) {
            application.status = metStatusLookup[requirement.definition.type]
          }
          application.statusReason = requirement.statusReason
          lastType = requirement.definition.type
          hasPending = true
          // allow the user to continue to the next requirement if this one is neverDisqualifying and
          // either all of its prompts are reachable, or later requirements do not depend on any of the
          // unreachable prompts
          // we need this logic to avoid having prompts move from later in the application to earlier
          // in the application as the user answers things out of order
          // it's still possible for a prompt to move earlier if the user is changing answers, but we
          // can't avoid that, and it's less disturbing than having navigation change as they are just
          // filling things in rather than making big changes
          if (requirement.definition.neverDisqualifying) {
            for (const prompt of prompts) {
              if (prompt.visibility === PromptVisibility.UNREACHABLE) unreachablePrompts.add(prompt.key)
            }
          } else {
            reqEvaluationBroken = true
          }
        }
      }
      // upgrade application to approved if all requirements are met
      if (application.status === ApplicationStatus.APPROVAL && !hasPending && !hasIneligible) {
        application.status = ApplicationStatus.APPROVED
      }
      if (application.status === ApplicationStatus.QUALIFICATION && !hasPending && !hasIneligible) {
        application.status = ApplicationStatus.READY_TO_SUBMIT
      }
    }

    // determine appRequest status based on the application statuses
    // no need to check for closed status, we don't evaluate closed appRequests
    if (applications.some(a => a.status === ApplicationStatus.PREQUAL || a.status === ApplicationStatus.QUALIFICATION)) appRequest.status = AppRequestStatus.STARTED
    else if (applications.some(a => a.status === ApplicationStatus.READY_TO_SUBMIT)) appRequest.status = AppRequestStatus.READY_TO_SUBMIT
    else if (applications.some(a => a.status === ApplicationStatus.PREAPPROVAL)) appRequest.status = AppRequestStatus.PREAPPROVAL
    else if (applications.some(a => a.status === ApplicationStatus.APPROVAL)) appRequest.status = AppRequestStatus.APPROVAL
    else if (applications.some(a => a.status === ApplicationStatus.APPROVED)) appRequest.status = AppRequestStatus.APPROVED
    else if (applications.some(a => a.status === ApplicationStatus.ACCEPTANCE)) appRequest.status = AppRequestStatus.ACCEPTANCE
    else if (applications.some(a => a.status === ApplicationStatus.ACCEPTED)) appRequest.status = AppRequestStatus.ACCEPTED
    else if (applications.some(a => a.status === ApplicationStatus.NOT_ACCEPTED)) appRequest.status = AppRequestStatus.NOT_ACCEPTED
    else if (applications.some(a => a.status === ApplicationStatus.NOT_APPROVED)) appRequest.status = AppRequestStatus.NOT_APPROVED
    else appRequest.status = AppRequestStatus.DISQUALIFIED

    // save the results of the evaluation to the database
    await updateAppRequestComputed(appRequest, db)
    await updateApplicationsComputed(applications, db)
    await updateRequirementComputed(requirements, db)
    await updatePromptComputed(prompts, db)
  })
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
