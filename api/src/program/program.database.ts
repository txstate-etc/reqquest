import db from 'mysql2-async/db'
import { PeriodProgramRow, PeriodProgram, PeriodProgramFilters, PeriodWorkflowRow, PeriodWorkflowStage, WorkflowStageFilters } from '../internal.js'
import { sortby } from 'txstate-utils'
import { Queryable } from 'mysql2-async'

function processFilters (filters?: PeriodProgramFilters) {
  const where: any[] = []
  const binds: any[] = []
  if (filters?.periodIds?.length) {
    where.push(`pp.periodId IN (${db.in(binds, filters.periodIds)})`)
  }
  if (filters?.keys?.length) {
    where.push(`pp.programKey IN (${db.in(binds, filters.keys)})`)
  }
  if (filters?.periodKeys?.length) {
    where.push(`(pp.periodId, pp.programKey) IN (${db.in(binds, filters.periodKeys.map(pk => [pk.periodId, pk.key]))})`)
  }
  return { where, binds }
}

export async function getPeriodPrograms (filters?: PeriodProgramFilters) {
  const { where, binds } = processFilters(filters)
  return (await db.getall<PeriodProgramRow>(`
    SELECT pp.* FROM period_programs pp
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
  `, binds)).map(row => new PeriodProgram(row))
}

export async function getPeriodWorkflowStages (filter: WorkflowStageFilters, tdb: Queryable = db) {
  const binds: any[] = []
  const where: string[] = []
  const joins = new Map<string, string>()
  if (filter.periodIds?.length) {
    where.push(`pws.periodId IN (${db.in(binds, filter.periodIds)})`)
  }
  if (filter.workflowKeys?.length) {
    where.push(`pws.stageKey IN (${db.in(binds, filter.workflowKeys)})`)
  }
  if (filter.periodIdProgramKeys?.length) {
    where.push(`(pws.periodId, pws.programKey) IN (${db.in(binds, filter.periodIdProgramKeys.map(pk => [pk.periodId, pk.programKey]))})`)
  }
  if (filter.workflowIds?.length) {
    where.push(`(pws.periodId, pws.programKey, pws.stageKey) IN (${db.in(binds, filter.workflowIds.map(wi => [wi.periodId, wi.programKey, wi.workflowKey]))})`)
  }
  if (filter.hasEnabledRequirements) {
    joins.set('requirements', 'INNER JOIN period_program_requirements ppr ON ppr.periodId = pws.periodId AND ppr.programKey = pws.programKey AND ppr.workflowStageKey = pws.stageKey')
    where.push('ppr.disabled = 0')
  }
  if (filter.blocking != null) {
    where.push('pws.blocking = ' + (filter.blocking ? '1' : '0'))
  }
  if (!where.length) return []
  const rows = (await tdb.getall<PeriodWorkflowRow>(`
    SELECT DISTINCT pws.* FROM period_workflow_stages pws
    ${Array.from(joins.values()).join('\n')}
    WHERE (${where.join(') AND (')})
    ORDER BY pws.evaluationOrder
  `, binds))
  return rows.map(r => new PeriodWorkflowStage(r))
}
