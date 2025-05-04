import db from 'mysql2-async/db'
import type { Queryable } from 'mysql2-async'
import { Configuration, ConfigurationFilters, ensureAppRequestRecords, getAppRequests, Period, PeriodFilters, PeriodUpdate, programRegistry, promptRegistry, requirementRegistry } from '../internal.js'

export interface PeriodRow {
  id: number
  code?: string
  name: string
  openDate: Date
  closeDate: Date
  archiveAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface PeriodConfigurationRow {
  periodId: number
  /* might be a requirement or prompt key */
  definitionKey: string
  createdAt: Date
  updatedAt: Date
}

export interface PeriodProgramRow {
  periodId: number
  programKey: string
  disabled: 0 | 1
}

export interface PeriodProgramRequirementRow {
  periodId: number
  programKey: string
  requirementKey: string
  disabled: 0 | 1
}

function processFilters (filters?: PeriodFilters) {
  const where: string[] = []
  const binds: any[] = []
  if (filters?.ids?.length) {
    where.push(`p.id IN (${db.in(binds, filters.ids)})`)
  }
  if (filters?.codes?.length) {
    where.push(`p.code IN (${db.in(binds, filters.codes)})`)
  }
  if (filters?.opensAfter) {
    where.push('p.openDate > ?')
    binds.push(filters.opensAfter)
  }
  if (filters?.opensBefore) {
    where.push('p.openDate < ?')
    binds.push(filters.opensBefore)
  }
  if (filters?.closesAfter) {
    where.push('p.closeDate > ?')
    binds.push(filters.closesAfter)
  }
  if (filters?.closesBefore) {
    where.push('p.closeDate < ?')
    binds.push(filters.closesBefore)
  }
  if (filters?.archiveAfter) {
    where.push('p.archiveAt > ?')
    binds.push(filters.archiveAfter)
  }
  if (filters?.archiveBefore) {
    where.push('p.archiveAt < ?')
    binds.push(filters.archiveBefore)
  }
  if (filters?.openNow != null) {
    if (filters.openNow) {
      where.push('p.openDate < NOW() AND p.closeDate > NOW()')
    } else {
      where.push('p.openDate > NOW() OR p.closeDate < NOW()')
    }
  }
  return { where, binds }
}

export async function getPeriods (filters?: PeriodFilters) {
  const { where, binds } = processFilters(filters)
  const rows = await db.getall<PeriodRow>(`
    SELECT p.*
    FROM periods p
    WHERE (${where.join(') AND (')})
  `, binds)
  return rows.map(row => new Period(row))
}

export async function copyConfigurations (fromPeriodId: number | string | undefined, toPeriodId: number | string, db: Queryable) {
  if (!fromPeriodId) return
  const hasAppRequests = await db.getval<number>('SELECT COUNT(*) FROM app_requests WHERE periodId = ?', [toPeriodId])
  if (hasAppRequests) throw new Error('Cannot alter the configurations of a period that has app requests.')
  await Promise.all([
    db.delete('DELETE FROM period_configurations WHERE periodId = ?', [toPeriodId]),
    db.delete('DELETE FROM period_programs WHERE periodId = ?', [toPeriodId]),
    db.delete('DELETE FROM period_program_requirements WHERE periodId = ?', [toPeriodId])
  ])
  const reachableConfigKeys = [...promptRegistry.reachable.map(p => p.key), ...requirementRegistry.reachable.map(r => r.key)]
  const configBinds: any[] = [toPeriodId, fromPeriodId]
  await db.insert(`
    INSERT INTO period_configurations (periodId, definitionKey, data)
    SELECT ?, definitionKey, data
    FROM period_configurations
    WHERE periodId = ? AND definitionKey IN (${db.in(configBinds, reachableConfigKeys)})
  `, configBinds)

  const reachableProgramKeys = programRegistry.reachable.map(p => p.key)
  const disabledProgramKeys = new Set(await db.getvals<string>('SELECT programKey FROM period_programs WHERE periodId = ? AND disabled = 1', [fromPeriodId]))
  if (reachableProgramKeys.length) {
    const binds: any[] = []
    await db.insert(`
      INSERT INTO period_programs (periodId, programKey, disabled)
      VALUES ${db.in(binds, reachableProgramKeys.map(key => [toPeriodId, key, disabledProgramKeys.has(key) ? 1 : 0]))}
    `, binds)
  }

  const reachableRequirementKeys = requirementRegistry.reachable.map(r => r.key)
  const disabledRequirementKeys = await db.getall<{ requirementKey: string, programKey: string }>('SELECT requirementKey, programKey FROM period_program_requirements WHERE periodId = ? AND disabled = 1', [fromPeriodId])
  const disabledByRequirementKeyAndProgramKey = disabledRequirementKeys.reduce((acc, { requirementKey, programKey }) => {
    acc[requirementKey] ??= {}
    acc[requirementKey][programKey] = true
    return acc
  }, {} as Record<string, Record<string, boolean>>)
  if (reachableRequirementKeys.length) {
    const binds: any[] = []
    await db.insert(`
      INSERT INTO period_program_requirements (periodId, programKey, requirementKey, disabled)
      VALUES ${db.in(binds, reachableProgramKeys.flatMap(pk => reachableRequirementKeys.map(rk => [toPeriodId, pk, rk, disabledByRequirementKeyAndProgramKey[rk]?.[pk] ? 1 : 0])))}
    `, binds)
  }
}

export async function createPeriod (period: PeriodUpdate) {
  const { code, name, openDate, closeDate, archiveAt } = period
  const prevId = await db.getval<number>('SELECT id FROM periods ORDER BY id DESC LIMIT 1')
  return await db.transaction(async db => {
    const periodId = await db.insert(`
      INSERT INTO periods (code, name, openDate, closeDate, archiveAt)
      VALUES (?, ?, ?, ?, ?)
    `, [code, name, openDate?.toJSDate(), closeDate?.toJSDate(), archiveAt?.toJSDate()])
    await copyConfigurations(prevId, periodId, db)
    return periodId
  })
}

export async function updatePeriod (id: string, period: PeriodUpdate) {
  const { code, name, openDate, closeDate, archiveAt } = period
  await db.update(`
    UPDATE periods
    SET code = ?, name = ?, openDate = ?, closeDate = ?, archiveAt = ?
    WHERE id = ?
  `, [code, name, openDate, closeDate, archiveAt, id])
}

function processConfigurationFilters (filters?: ConfigurationFilters) {
  const where: string[] = []
  const binds: any[] = []
  if (filters?.ids?.length) {
    where.push(`(c.periodId, c.key) IN (${db.in(binds, filters.ids.map(({ periodId, key }) => [periodId, key]))})`)
  }
  if (filters?.periodIds?.length) {
    where.push(`c.periodId IN (${db.in(binds, filters.periodIds)})`)
  }
  if (filters?.periodCodes?.length) {
    where.push(`p.code IN (${db.in(binds, filters.periodCodes)})`)
  }
  if (filters?.keys?.length) {
    where.push(`c.key IN (${db.in(binds, filters.keys)})`)
  }
  return { where, binds }
}

export async function getConfigurations (filters?: ConfigurationFilters) {
  const { where, binds } = processConfigurationFilters(filters)
  const rows = await db.getall<PeriodConfigurationRow>(`
    SELECT c.periodId, c.key, c.createdAt, c.updatedAt
    INNER JOIN periods p ON p.id = c.periodId
    FROM period_configurations c
    WHERE (${where.join(') AND (')})
  `, binds)
  return rows.map(row => new Configuration(row))
}

export async function getConfigurationData (ids: { periodId: string, key: string }[]) {
  const binds: any[] = []
  const rows = await db.getall<{ periodId: number, key: string, data: string }>(`
    SELECT periodId, definitionKey, data
    FROM period_configurations
    WHERE (periodId, definitionKey) IN (${db.in(binds, ids.map(pair => [pair.periodId, pair.key]))})
  `, binds)
  return rows.map(row => ({ periodId: String(row.periodId), key: row.key, data: JSON.parse(row.data || '{}') }))
}

export async function upsertConfiguration (periodId: string, key: string, data: any) {
  const dataStr = JSON.stringify(data)
  await db.update(`
    INSERT INTO period_configurations (periodId, key, data)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE data = ?
  `, [periodId, key, dataStr, dataStr])
}

/**
 * This function is run on startup and makes sure future periods have entries for all the
 * configurations, programs, and requirements that are available in the code.
 */
export async function ensureConfigurationRecords () {
  await db.transaction(async db => {
    const futurePeriodIds = await db.getvals<number>('SELECT id FROM periods WHERE openDate > NOW()')
    if (!futurePeriodIds.length) return
    const configurations = await db.getall<{ periodId: number, key: string }>(`SELECT periodId, key FROM period_configurations WHERE periodId IN (${db.in([], futurePeriodIds)})`, futurePeriodIds)
    const configMap: Record<string, Set<string>> = {}
    for (const { periodId, key } of configurations) {
      if (!configMap[periodId]) configMap[periodId] = new Set()
      configMap[periodId].add(key)
    }
    const promptAndReqKeys = [...promptRegistry.reachable.map(p => p.key), ...requirementRegistry.reachable.map(r => r.key)]
    const promptAndReqKeysSet = new Set(promptAndReqKeys)
    const configurationsToInsert = futurePeriodIds.flatMap(periodId => promptAndReqKeys.filter(key => !configMap?.[periodId]?.has(key)).map(key => ({ periodId: periodId, key })))
    const configurationsToDelete = futurePeriodIds.flatMap(periodId => Array.from(configMap?.[periodId] ?? []).filter(key => !promptAndReqKeysSet.has(key)).map(key => ({ periodId: periodId, key })))
    if (configurationsToInsert.length) {
      const binds: any[] = []
      await db.insert(`
        INSERT INTO period_configurations (periodId, key, data)
        VALUES ${db.in(binds, configurationsToInsert.map(({ periodId, key }) => [periodId, key, '']))}
        `, binds)
    }
    if (configurationsToDelete.length) {
      const binds: any[] = []
      await db.query(`DELETE FROM period_configurations WHERE (periodId, key) IN (${db.in(binds, configurationsToDelete.map(({ periodId, key }) => [periodId, key]))})`, binds)
    }

    const program_rows = await db.getall<{ periodId: number, key: string }>(`SELECT periodId, key FROM period_programs WHERE periodId IN (${db.in([], futurePeriodIds)})`, futurePeriodIds)
    const programKeys = programRegistry.reachable.map(p => p.key)
    const programKeysSet = new Set(programKeys)
    const programMap: Record<string, Set<string>> = {}
    for (const { periodId, key } of program_rows) {
      if (!programMap[periodId]) programMap[periodId] = new Set()
      programMap[periodId].add(key)
    }

    const programsToInsert = futurePeriodIds.flatMap(periodId => programKeys.filter(key => !programMap?.[periodId]?.has(key)).map(key => ({ periodId: periodId, key })))
    const programsToDelete = futurePeriodIds.flatMap(periodId => Array.from(programMap?.[periodId] ?? []).filter(key => !programKeysSet.has(key)).map(key => ({ periodId: periodId, key })))
    if (programsToInsert.length) {
      const binds: any[] = []
      await db.insert(`
        INSERT INTO period_programs (periodId, key)
        VALUES ${db.in(binds, programsToInsert.map(({ periodId, key }) => [periodId, key]))}
      `, binds)
    }
    if (programsToDelete.length) {
      const binds: any[] = []
      await db.query(`
        DELETE FROM period_programs
        WHERE (periodId, key) IN (${db.in(binds, programsToDelete.map(({ periodId, key }) => [periodId, key]))})
      `, binds)
    }

    const requirement_rows = await db.getall<{ periodId: number, programKey: string, requirementKey: string }>(`SELECT periodId, programKey, requirementKey FROM period_program_requirements WHERE periodId IN (${db.in([], futurePeriodIds)})`, futurePeriodIds)
    const reqKeys = requirementRegistry.reachable.map(r => r.key)
    const reqKeysSet = new Set(reqKeys)
    const requirementMap: Record<string, Record<string, Set<string>>> = {}
    for (const { periodId, programKey, requirementKey } of requirement_rows) {
      requirementMap[periodId] ??= {}
      requirementMap[periodId][programKey] ??= new Set()
      requirementMap[periodId][programKey].add(requirementKey)
    }
    const requirementsToInsert = futurePeriodIds.flatMap(periodId => programKeys.flatMap(programKey => reqKeys.filter(requirementKey => !requirementMap?.[periodId]?.[programKey]?.has(requirementKey)).map(requirementKey => ({ periodId: periodId, programKey, requirementKey }))))
    const requirementsToDelete = futurePeriodIds.flatMap(periodId => programKeys.flatMap(programKey => Array.from(requirementMap?.[periodId]?.[programKey] ?? []).filter(requirementKey => !reqKeysSet.has(requirementKey)).map(requirementKey => ({ periodId: periodId, programKey, requirementKey }))))
    if (requirementsToInsert.length) {
      const binds: any[] = []
      await db.insert(`
        INSERT INTO period_program_requirements (periodId, programKey, requirementKey)
        VALUES ${db.in(binds, requirementsToInsert.map(({ periodId, programKey, requirementKey }) => [periodId, programKey, requirementKey]))})
      `, binds)
    }
    if (requirementsToDelete.length) {
      const binds: any[] = []
      await db.query(`
        DELETE FROM period_program_requirements
        WHERE (periodId, programKey, requirementKey) IN (${db.in(binds, requirementsToDelete.map(({ periodId, programKey, requirementKey }) => [periodId, programKey, requirementKey]))})
      `, binds)
    }

    // if we added or removed any configurations, programs, or requirements, we need to ensure that the app requests are updated
    const periodIdsAffected = new Set([...configurationsToInsert.map(c => c.periodId), ...configurationsToDelete.map(c => c.periodId), ...programsToInsert.map(p => p.periodId), ...programsToDelete.map(p => p.periodId), ...requirementsToInsert.map(r => r.periodId), ...requirementsToDelete.map(r => r.periodId)])
    const appRequestsAffected = periodIdsAffected.size ? await getAppRequests({ periodIds: Array.from(periodIdsAffected).map(String) }) : []
    for (const appRequest of appRequestsAffected) await ensureAppRequestRecords(appRequest, db)
  })
}
