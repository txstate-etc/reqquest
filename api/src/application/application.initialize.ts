import { DatabaseMigration } from '../internal.js'

export const applicationMigrations: DatabaseMigration[] = [
  {
    id: '20250211230000',
    async execute (db) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS applications (
          id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
          programKey VARCHAR(255) NOT NULL,
          evaluationOrder SMALLINT UNSIGNED NOT NULL DEFAULT 0,
          appRequestId INT UNSIGNED NOT NULL,
          computedStatus VARCHAR(255) NOT NULL DEFAULT 'PENDING',
          computedStatusReason TEXT,
          computedPhase VARCHAR(255) NOT NULL DEFAULT 'PREQUAL',
          computedIneligiblePhase VARCHAR(255) NULL,
          computedAwaitingCorrection TINYINT(1) NOT NULL DEFAULT 0,
          workflowStage VARCHAR(255) NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX (programKey, evaluationOrder),
          INDEX (computedStatus),
          FOREIGN KEY (appRequestId) REFERENCES app_requests (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
    }
  },
  {
    id: '20260715000100',
    async execute (db) {
      const exists = await db.getval("SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_NAME = 'applications' AND COLUMN_NAME = 'computedAwaitingCorrection'")
      if (!exists) await db.execute('ALTER TABLE applications ADD COLUMN computedAwaitingCorrection TINYINT(1) NOT NULL DEFAULT 0 AFTER computedIneligiblePhase')
    }
  }
]
