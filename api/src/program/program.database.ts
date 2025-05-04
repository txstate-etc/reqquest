import db from 'mysql2-async/db'
import { PeriodProgramRow, PeriodProgram, PeriodProgramFilters } from '../internal.js'

function processFilters (filters?: PeriodProgramFilters) {
  const where: any[] = []
  const binds: any[] = []
  if (filters?.periodIds?.length) {
    where.push(`pp.periodId IN (${db.in(binds, filters.periodIds)})`)
  }
  if (filters?.keys?.length) {
    where.push(`pp.programKey IN (${db.in(binds, filters.keys)})`)
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
