import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { clone, groupby, omit } from 'txstate-utils'
import { ApplicationRequirement, ApplicationStatus, AppRequest, AppRequestFilter, AppRequestStatus, programRegistry, promptRegistry, RequirementPrompt, requirementRegistry, RequirementStatus, RequirementType, syncApplications, syncPromptRecords, syncRequirementRecords, updateApplicationsComputed, updatePromptComputed, updateRequirementComputed, type AppRequestData } from '../internal.js'

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
  // The request has been closed.
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
  userId: number
  status: AppRequestStatusDB
  computedStatus: AppRequestStatus
  createdAt: Date
  updatedAt: Date
  closedAt: Date
}

export interface AppRequestRowData {
  id: number
  data?: string
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
  return { joins, where, binds }
}

export async function getAppRequests (filter?: AppRequestFilter, tdb: Queryable = db) {
  const { joins, where, binds } = processFilters(filter)
  const rows = await tdb.getall<AppRequestRow>(`
    SELECT ar.id, ar.periodId, ar.userId, ar.status, ar.computedStatus, ar.createdAt, ar.updatedAt, ar.closedAt
    FROM app_requests ar
    ${Array.from(joins.values()).join('\n')}
    WHERE (${where.join(') AND (')})
  `, binds)
  return rows.map(row => new AppRequest(row))
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
  await db.transaction(async db => {
    const computedStatus = await db.getval<AppRequestStatus>('SELECT computedStatus FROM app_requests WHERE id = ? FOR UPDATE', [appRequestId])
    await db.update('UPDATE app_requests SET status = ?, computedStatus = ?, closedAt = NOW() WHERE id = ?', [
      AppRequestStatusDB.CLOSED,
      computedStatus === AppRequestStatus.APPROVED ? AppRequestStatus.APPROVED_CLOSED : AppRequestStatus.DISQUALIFIED_CLOSED
    ])
  })
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
  [RequirementType.PREAPPROVAL]: ApplicationStatus.NOT_APPROVED,
  [RequirementType.APPROVAL]: ApplicationStatus.NOT_APPROVED
}

const metStatusLookup = {
  [RequirementType.PREQUAL]: ApplicationStatus.PREQUAL,
  [RequirementType.QUALIFICATION]: ApplicationStatus.QUALIFICATION,
  [RequirementType.PREAPPROVAL]: ApplicationStatus.PREAPPROVAL,
  [RequirementType.APPROVAL]: ApplicationStatus.APPROVED
}

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

    // let's figure out if we're in applicant mode or reviewer mode, we don't
    // need to evaluate reviewer requirements in applicant mode
    const inReview = appRequest.dbStatus === AppRequestStatusDB.SUBMITTED

    const data = (await getAppRequestData([appRequest.internalId], db))[0].data

    // all of the objects we return here are considered mutable - we will be updating
    // them during this evaluation and then we will save them back to the database at
    // the end
    const { applications, requirements, prompts } = await ensureAppRequestRecords(appRequest, db)
    const reqLookup = groupby(requirements, 'applicationId')
    const promptLookup = groupby(prompts, 'requirementId')

    // grab all the prompt and requirement configurations from this apprequest's period
    const configurations = await db.getall<{ definitionKey: string, data: string }>('SELECT definitionKey, data FROM period_configurations WHERE periodId = ?', [appRequest.periodId])
    const configLookup: Record<string, any> = configurations.map(c => ({ ...c, data: JSON.parse(c.data ?? '{}') })).reduce((acc, c) => ({ ...acc, [c.definitionKey]: c.data }), {})

    // keeping track of which prompts have been evaluated so that we can avoid evaluating them twice
    const promptEvaluations: Record<string, boolean> = {}
    let notReadyToSubmit = false

    for (const application of applications) {
      const requirements = reqLookup[application.id] ?? []

      // We're going to build up a data object as we progress through requirements;
      // each requirement's resolve function will be called with only the data that
      // was gathered up to that point. This way, we enforce that later prompts and
      // their answers cannot alter the outcome of earlier requirements. This keeps
      // the system sane and predictable and avoids cycles.
      const dataSoFar: AppRequestData = { savedAtVersion: data.savedAtVersion }

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

      // if we are in applicant mode, we only need to evaluate prequal and qualification requirements
      const sortedRequirements = inReview
        ? [...prequalRequirements, ...qualificationRequirements, ...preapprovalRequirements, ...approvalRequirements]
        : [...prequalRequirements, ...qualificationRequirements]

      // initialize some tracking variables that we will update during this process
      application.status = appRequest.dbStatus === AppRequestStatusDB.STARTED ? ApplicationStatus.PREQUAL : ApplicationStatus.PREAPPROVAL
      let hasPending = false
      let hasIneligible = false
      let reqEvaluationBroken = false
      const promptsSeenInApplication = new Set<string>()
      const unreachablePrompts = new Set<string>()

      for (const requirement of sortedRequirements) {
        if (requirement.definition.allPromptKeys.some(key => unreachablePrompts.has(key))) reqEvaluationBroken = true

        // we use reqEvaluationBroken instead of a loop break because we need to set
        // the reachable status on all requirements/prompts, so we have to continue looping and
        // setting all remaining unevaluated requirements and their prompts to unreachable
        if (reqEvaluationBroken) {
          requirement.reachable = false
          for (const prompt of promptLookup[requirement.id] ?? []) {
            prompt.reachable = false
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
        requirement.status = requirement.definition.resolve(dataSoFar, requirementConfig, configLookup)
        requirement.statusReason = typeof requirement.definition.statusReason === 'string' ? requirement.definition.statusReason : requirement.definition.statusReason?.(dataSoFar, requirement.status, requirementConfig, configLookup)
        for (const prompt of prompts) {
          // if our requirement can be evaluated without any prompts, all its prompts are
          // unreachable, even if it's a promptsAnyOrder requirement
          if (requirement.status !== RequirementStatus.PENDING) {
            promptEvaluationBroken = true
            allPromptsAnswered = false
          }
          if (promptEvaluationBroken) {
            prompt.reachable = false
            prompt.answered = false
            continue
          } else prompt.reachable = true
          prompt.askedInEarlierApplication = promptEvaluations[prompt.key] != null
          if (promptEvaluations[prompt.key] == null) {
            const promptConfig = configLookup[prompt.key] ?? {}
            promptEvaluations[prompt.key] = prompt.invalidated ? false : prompt.definition.answered?.(data[prompt.key] ?? {}, promptConfig) ?? true
          }
          prompt.answered = promptEvaluations[prompt.key]
          if (!prompt.answered) allPromptsAnswered = false
          prompt.askedInEarlierRequirement = promptsSeenInApplication.has(prompt.key)
          promptsSeenInApplication.add(prompt.key)

          // only include data from completed prompts, but go ahead and evaluate requirements
          // with unanswered prompts in case they can make early determinations (as long as
          // they don't depend on partial answers to unanswered prompts)
          if (promptEvaluations[prompt.key]) {
            dataSoFar[prompt.key] = data[prompt.key]
            // If we have a requirement that never disqualifies, we don't want it to evaluate
            // based on partial data, so we will avoid calling resolve on it as we loop through prompts
            // See RequirementDefinition.promptsAnyOrder for more information
            if (!requirement.definition.anyOrderPromptKeySet.has(prompt.key)) {
              requirement.status = requirement.definition.resolve(dataSoFar, requirementConfig, configLookup)
              requirement.statusReason = typeof requirement.definition.statusReason === 'string' ? requirement.definition.statusReason : requirement.definition.statusReason?.(dataSoFar, requirement.status, requirementConfig, configLookup)
            }
          } else if (!requirement.definition.anyOrderPromptKeySet.has(prompt.key)) promptEvaluationBroken = true
        }

        // now that we have evaluated all prompts, if they are all answered, we can
        // evaluate our requirement with all the data (including data from anyOrder prompts)
        if (requirement.definition.anyOrderPromptKeySet.size > 0 && allPromptsAnswered) {
          requirement.status = requirement.definition.resolve(dataSoFar, requirementConfig, configLookup)
          requirement.statusReason = typeof requirement.definition.statusReason === 'string' ? requirement.definition.statusReason : requirement.definition.statusReason?.(dataSoFar, requirement.status, requirementConfig, configLookup)
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
          if (requirement.status === RequirementStatus.WARNING) application.statusReason = requirement.statusReason
        } else { // PENDING
          // this is that code I spoke of a few lines above that upgrades the application status
          // if the first requirement of a certain type is pending
          if (application.status === ApplicationStatus.PREQUAL && requirement.definition.type === RequirementType.QUALIFICATION) {
            application.status = ApplicationStatus.QUALIFICATION
          } else if (application.status === ApplicationStatus.QUALIFICATION && requirement.definition.type === RequirementType.PREAPPROVAL) {
            application.status = ApplicationStatus.PREAPPROVAL
          } else if (application.status === ApplicationStatus.PREAPPROVAL && requirement.definition.type === RequirementType.APPROVAL) {
            application.status = ApplicationStatus.APPROVAL
          }
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
              if (!prompt.reachable) unreachablePrompts.add(prompt.key)
            }
          } else {
            reqEvaluationBroken = true
          }
        }
      }
      // upgrade application to approved if all requirements are met
      if (application.status === ApplicationStatus.APPROVAL && !hasPending && !hasIneligible) {
        application.status = ApplicationStatus.APPROVED
        application.statusReason = undefined
      }
      if (application.status === ApplicationStatus.QUALIFICATION && !hasPending && !hasIneligible) {
        application.status = ApplicationStatus.READY_TO_SUBMIT
        application.statusReason = undefined
      }
    }

    // determine appRequest status based on the application statuses
    // no need to check for closed status, we don't evaluate closed appRequests
    if (appRequest.dbStatus === AppRequestStatusDB.STARTED) appRequest.status = AppRequestStatus.STARTED
    else if (applications.some(a => a.status === ApplicationStatus.PREAPPROVAL)) appRequest.status = AppRequestStatus.PREAPPROVAL
    else if (applications.some(a => a.status === ApplicationStatus.APPROVAL)) appRequest.status = AppRequestStatus.APPROVAL
    else if (applications.some(a => a.status === ApplicationStatus.APPROVED)) appRequest.status = AppRequestStatus.APPROVED
    else appRequest.status = AppRequestStatus.DISQUALIFIED

    if (appRequest.dbStatus === AppRequestStatusDB.STARTED && applications
      .some(a => a.status === ApplicationStatus.READY_TO_SUBMIT) && applications
      .every(a => [ApplicationStatus.READY_TO_SUBMIT, ApplicationStatus.FAILED_PREQUAL, ApplicationStatus.FAILED_QUALIFICATION].includes(a.status))
    ) appRequest.status = AppRequestStatus.READY_TO_SUBMIT

    // save the results of the evaluation to the database
    await updateAppRequestComputed(appRequest, db)
    await updateApplicationsComputed(applications, db)
    await updateRequirementComputed(requirements, db)
    await updatePromptComputed(prompts, db)
  })
}
