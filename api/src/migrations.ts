import { sortby } from 'txstate-utils'
import db from 'mysql2-async/db'
import { Queryable } from 'mysql2-async'

export interface DatabaseMigration {
  /** datetime represented as '20240529120000' */
  id: string
  /** perform the migration tasks, install test data if so instructed */
  execute: (db: Queryable, installTestData: boolean) => void | Promise<void>
}

async function resetDb () {
  const tables = await db.getvals<string>('SHOW TABLES')
  await db.execute('SET FOREIGN_KEY_CHECKS = 0')
  for (const table of tables) {
    await db.execute(`DROP TABLE IF EXISTS \`${table}\``)
  }
  await db.execute('SET FOREIGN_KEY_CHECKS = 1')
}

async function migrateDb (migrations: DatabaseMigration[], installTestData: boolean) {
  await ensureDbVersion(db)
  const itsme = await db.update('UPDATE dbversion SET inProgressSince = NOW() WHERE inProgressSince IS NULL OR inProgressSince < NOW() - INTERVAL 1 HOUR')
  if (!itsme) return
  try {
    const sorted = sortby(migrations, 'id')
    if (migrations.find(m => !/\d{14}/.test(m.id))) throw new Error('One of your migrations has a malformed id.')
    const dbversion = (await db.getval('SELECT version FROM dbversion'))!
    for (const migration of sorted) {
      if (migration.id <= dbversion) continue
      await db.transaction(async db => {
        await migration.execute(db, installTestData)
        await db.update('UPDATE dbversion SET version = ?, inProgressSince = NOW()', [migration.id])
      })
    }
  } finally {
    await db.update('UPDATE dbversion SET inProgressSince = NULL')
  }
}

async function ensureDbVersion (db: Queryable) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS dbversion (
      id TINYINT NOT NULL,
      version CHAR(14) NOT NULL,
      inProgressSince DATETIME,
      PRIMARY KEY (id)
    )
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    DEFAULT COLLATE = utf8mb4_general_ci
  `)
  await db.insert('INSERT IGNORE INTO dbversion (id, version) VALUES (1, "19700101000000")')
}

export async function initializeDb (migrations: DatabaseMigration[]) {
  const devReset = (process.env.NODE_ENV === 'development' && process.env.RESET_DB_ON_STARTUP === 'true')

  if (devReset) await resetDb()
  await migrateDb(migrations, devReset && process.env.SKIP_TEST_DATA !== 'true')
}
