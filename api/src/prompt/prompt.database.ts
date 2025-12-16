import type { Queryable } from 'mysql2-async'
import db from 'mysql2-async/db'
import { ApplicationPhase, ApplicationRequirement, AppRequestPhase, AppRequestStatusDB, InvalidatedResponse, PeriodConfigurationRow, PeriodPrompt, PeriodPromptFilters, promptRegistry, PromptVisibility, RequirementPrompt, RequirementPromptFilter, RequirementType } from '../internal.js'

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
    ORDER BY evaluationOrder
  `, binds)
  return rows.map(row => new RequirementPrompt(row))
}

export async function setRequirementPromptValid (prompt: RequirementPrompt, tdb: Queryable = db) {
  await tdb.update('UPDATE requirement_prompts SET invalidated = 0, invalidatedReason = NULL WHERE promptKey = ?', [prompt.key])
}

export async function setRequirementPromptsInvalid (invalidateResponses: InvalidatedResponse[], tdb: Queryable = db) {
  if (!invalidateResponses?.length) return
  const answeredPromptsToInvalidate = await getRequirementPrompts({ promptKeys: invalidateResponses.map(ir => ir.promptKey), answered: true })
  const invalidateAnsweredResponses = invalidateResponses.filter(ir => answeredPromptsToInvalidate.find(ap => ir.promptKey === ap.promptKey))
  for (const r of invalidateAnsweredResponses) {
    await tdb.update('UPDATE requirement_prompts SET invalidated = 1, invalidatedReason = ? WHERE promptKey = ?', [r.reason, r.promptKey])
  }
}

export async function syncPromptRecords (requirement: ApplicationRequirement, db: Queryable) {
  const existingPrompts = await db.getall<PromptRow>('SELECT * FROM requirement_prompts WHERE requirementId = ?', [requirement.internalId])
  const existingPromptKeys = new Set(existingPrompts.map(row => row.promptKey))
  const definitionPromptKeys = requirement.definition.promptKeySet
  const promptsToInsert = requirement.definition.allPromptKeys.filter(promptKey => !existingPromptKeys.has(promptKey))
  const promptsToDelete = existingPrompts.filter(row => !definitionPromptKeys.has(row.promptKey))
  if (promptsToInsert?.length) {
    const binds: any[] = []
    await db.query(`
      INSERT INTO requirement_prompts (appRequestId, applicationId, requirementId, promptKey)
      VALUES ${db.in(binds, promptsToInsert.map(promptKey => [requirement.appRequestId, requirement.applicationId, requirement.internalId, promptKey]))}
    `, binds)
  }
  if (promptsToDelete.length) {
    const binds: any[] = []
    await db.query(`DELETE FROM requirement_prompts WHERE id IN (${db.in(binds, promptsToDelete.map(row => row.id))})`, binds)
  }
  for (let i = 0; i < requirement.definition.allPromptKeys.length; i++) {
    const promptKey = requirement.definition.allPromptKeys[i]
    await db.update('UPDATE requirement_prompts SET evaluationOrder = ? WHERE requirementId = ? AND promptKey = ?', [i, requirement.internalId, promptKey])
  }
  return await getRequirementPrompts({ requirementIds: [requirement.id] }, db)
}

export async function updatePromptComputed (prompts: RequirementPrompt[], db: Queryable) {
  for (const prompt of prompts) {
    await db.update('UPDATE requirement_prompts SET visibility = ?, answered = ?, moot = ?, locked = ? WHERE id = ?', [prompt.visibility, prompt.answered, prompt.moot, prompt.locked, prompt.internalId])
  }
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
