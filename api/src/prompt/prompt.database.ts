import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { groupby } from 'txstate-utils'
import { ApplicationPhase, ApplicationRequirement, AppRequestPhase, AppRequestStatusDB, bulkUpdateById, InvalidatedResponse, PeriodConfigurationRow, PeriodPrompt, PeriodPromptFilters, promptRegistry, PromptVisibility, RequirementPrompt, RequirementPromptFilter, RequirementType } from '../internal.js'

export interface PromptRow {
  id: number
  appRequestId: number
  appRequestDbStatus: AppRequestStatusDB
  appRequestDbPhase: AppRequestPhase
  periodId: number
  applicationId: number
  requirementId: number
  requirementKey: string
  requirementType: RequirementType
  programKey: string
  userId: number
  promptKey: string
  answered: 0 | 1
  moot: 0 | 1
  locked: 0 | 1
  invalidated: 0 | 1
  invalidatedReason: string | null
  visibility: PromptVisibility
  workflowStage?: string
  applicationWorkflowStage?: string
  applicationPhase: ApplicationPhase
}

function processFilters (filter: RequirementPromptFilter) {
  const where: string[] = []
  const binds: any[] = []
  if (filter.ids?.length) {
    where.push(`p.id IN (${db.in(binds, filter.ids)})`)
  }
  if (filter.appRequestIds?.length) {
    where.push(`p.appRequestId IN (${db.in(binds, filter.appRequestIds)})`)
  }
  if (filter.applicationIds?.length) {
    where.push(`p.applicationId IN (${db.in(binds, filter.applicationIds)})`)
  }
  if (filter.requirementIds?.length) {
    where.push(`p.requirementId IN (${db.in(binds, filter.requirementIds)})`)
  }
  if (filter.promptKeys?.length) {
    where.push(`p.promptKey IN (${db.in(binds, filter.promptKeys)})`)
  }
  if (filter.reachable != null) {
    where.push('p.reachable = ?')
    binds.push(filter.reachable ? 1 : 0)
  }
  if (filter.answered != null) {
    where.push('p.answered = ?')
    binds.push(filter.answered ? 1 : 0)
  }
  return { where, binds }
}

export async function getRequirementPrompts (filter: RequirementPromptFilter, tdb: Queryable = db) {
  const { where, binds } = processFilters(filter)
  const rows = await tdb.getall<PromptRow>(`
    SELECT p.*, ar.userId, ar.periodId, r.requirementKey, a.programKey, ar.status AS appRequestDbStatus, ar.phase AS appRequestDbPhase,
      r.workflowStage, a.workflowStage AS applicationWorkflowStage, a.computedPhase AS applicationPhase, r.type AS requirementType
    FROM requirement_prompts p
    INNER JOIN application_requirements r ON r.id=p.requirementId
    INNER JOIN applications a ON a.id=r.applicationId
    INNER JOIN app_requests ar ON ar.id=p.appRequestId
    WHERE (${where.join(') AND (')})
    ORDER BY a.evaluationOrder, r.evaluationOrder, p.evaluationOrder
  `, binds)
  return rows.map(row => new RequirementPrompt(row))
}

export async function setRequirementPromptValid (prompt: RequirementPrompt, tdb: Queryable = db) {
  await tdb.update('UPDATE requirement_prompts SET invalidated = 0, invalidatedReason = NULL WHERE appRequestId = ? AND promptKey = ?', [prompt.appRequestInternalId, prompt.key])
}

export async function setRequirementPromptsInvalid (appRequestInternalId: number, invalidateResponses: InvalidatedResponse[], tdb: Queryable = db) {
  for (const r of invalidateResponses) {
    await tdb.update('UPDATE requirement_prompts SET invalidated = 1, invalidatedReason = ? WHERE appRequestId = ? AND promptKey = ? AND answered = 1', [r.reason, appRequestInternalId, r.promptKey])
  }
}

export async function setRequirementPromptsValid (appRequestInternalId: number, promptKeys: string[], tdb: Queryable = db) {
  if (promptKeys.length === 0) return
  const binds: any[] = [appRequestInternalId]
  await tdb.update(`UPDATE requirement_prompts SET invalidated = 0, invalidatedReason = NULL WHERE appRequestId = ? AND promptKey IN (${tdb.in(binds, promptKeys)})`, binds)
}

/**
 * Reconcile the requirement_prompts rows of every requirement on an appRequest with the
 * definitions in one pass: one read, one insert, one delete, one update, one reload regardless of how many requirements the request has.
 */
export async function syncPromptRecords (appRequestId: number, requirements: ApplicationRequirement[], db: Queryable) {
  const existing = await db.getall<{ id: number, requirementId: number, promptKey: string, evaluationOrder: number }>(
    'SELECT id, requirementId, promptKey, evaluationOrder FROM requirement_prompts WHERE appRequestId = ?', [appRequestId])
  const existingByRequirement = groupby(existing, 'requirementId')
  const toInsert: any[][] = []
  const toDelete: number[] = []
  const toUpdate: { id: number, evaluationOrder: number }[] = []
  for (const requirement of requirements) {
    const rows = existingByRequirement[requirement.internalId] ?? []
    const rowsByKey = new Map(rows.map(row => [row.promptKey, row]))
    const promptKeys = requirement.definition.allPromptKeys
    for (let i = 0; i < promptKeys.length; i++) {
      const row = rowsByKey.get(promptKeys[i])
      if (!row) toInsert.push([appRequestId, requirement.applicationInternalId, requirement.internalId, promptKeys[i], i])
      else if (row.evaluationOrder !== i) toUpdate.push({ id: row.id, evaluationOrder: i })
    }
    for (const row of rows) if (!requirement.definition.promptKeySet.has(row.promptKey)) toDelete.push(row.id)
  }
  if (toInsert.length) {
    const binds: any[] = []
    await db.insert(`
      INSERT INTO requirement_prompts (appRequestId, applicationId, requirementId, promptKey, evaluationOrder)
      VALUES ${db.in(binds, toInsert)}
    `, binds)
  }
  if (toDelete.length) {
    const binds: any[] = []
    await db.delete(`DELETE FROM requirement_prompts WHERE id IN (${db.in(binds, toDelete)})`, binds)
  }
  await bulkUpdateById(db, 'requirement_prompts', ['evaluationOrder'], toUpdate)
  return await getRequirementPrompts({ appRequestIds: [String(appRequestId)] }, db)
}

// The computed columns the evaluation writes back, shaped for `bulkUpdateById` and for change detection.
export function promptComputedRow (prompt: RequirementPrompt) {
  return {
    id: prompt.internalId,
    visibility: prompt.visibility,
    answered: prompt.answered ? 1 : 0,
    moot: prompt.moot ? 1 : 0,
    locked: prompt.locked ? 1 : 0
  }
}

export async function updatePromptComputed (prompts: RequirementPrompt[], db: Queryable) {
  await bulkUpdateById(db, 'requirement_prompts', ['visibility', 'answered', 'moot', 'locked'], prompts.map(promptComputedRow))
}

function processPeriodPromptFilters (filter: PeriodPromptFilters) {
  const where: string[] = []
  const binds: any[] = []
  if (filter.periodIds?.length) {
    where.push(`pc.periodId IN (${db.in(binds, filter.periodIds)})`)
  }
  if (filter.promptKeys?.length) {
    where.push(`pc.definitionKey IN (${db.in(binds, filter.promptKeys)})`)
  }
  if (filter.periodPromptKeys?.length) {
    where.push(`(pc.periodId, pc.definitionKey) IN (${db.in(binds, filter.periodPromptKeys.map(pk => [pk.periodId, pk.promptKey]))})`)
  }
  return { where, binds }
}

export async function getPeriodPrompts (filter: PeriodPromptFilters) {
  const { where, binds } = processPeriodPromptFilters(filter)
  return (await db.getall<PeriodConfigurationRow>(`
    SELECT pc.* FROM period_configurations pc
    WHERE (${where.join(' AND ')}) AND definitionKey IN (${db.in(binds, promptRegistry.list().map(d => d.key))})
  `, binds)).map(row => new PeriodPrompt(String(row.periodId), row.definitionKey))
}
