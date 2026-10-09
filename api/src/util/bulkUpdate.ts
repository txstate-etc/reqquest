import type { Queryable } from 'mysql2-async'

/**
 * Update many rows of one table in a single statement per chunk.
 *
 * Each row carries the primary key under `id` plus a value for every column in `columns`. The rows
 * are bound into a derived table and joined to the target on `id`, so an evaluation that touches
 * hundreds of rows costs a handful of round trips instead of one per row.
 *
 * Returns the number of rows matched, like `Queryable.update`.
 */
export async function bulkUpdateById (tdb: Queryable, table: string, columns: string[], rows: ({ id: number } & Record<string, any>)[], chunkSize = 500) {
  if (!rows.length || !columns.length) return 0
  let affected = 0
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    const binds: any[] = []
    const selects = chunk.map((row, idx) => {
      binds.push(row.id, ...columns.map(c => row[c] ?? null))
      return idx === 0
        ? `SELECT ? AS id, ${columns.map(c => `? AS \`${c}\``).join(', ')}`
        : `SELECT ?, ${columns.map(() => '?').join(', ')}`
    })
    affected += await tdb.update(`
      UPDATE \`${table}\` t
      INNER JOIN (${selects.join(' UNION ALL ')}) v ON v.id = t.id
      SET ${columns.map(c => `t.\`${c}\` = v.\`${c}\``).join(', ')}
    `, binds)
  }
  return affected
}
