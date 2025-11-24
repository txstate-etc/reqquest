import { DatabaseMigration } from '../migrations'

export const periodMigrations: DatabaseMigration[] = [
  {
    id: '20250114094100',
    async execute (db) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS periods (
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          code VARCHAR(255),
          name VARCHAR(255) NOT NULL,
          openDate DATETIME NOT NULL,
          closeDate DATETIME,
          archiveDate DATETIME,
          reviewed TINYINT(1) NOT NULL DEFAULT 0,
          UNIQUE (name),
          INDEX (openDate),
          INDEX (closeDate),
          INDEX (archiveDate)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS period_programs (
          periodId INT UNSIGNED NOT NULL,
          programKey VARCHAR(255) NOT NULL,
          disabled TINYINT(1) NOT NULL DEFAULT 0,
          PRIMARY KEY (periodId, programKey),
          FOREIGN KEY (periodId) REFERENCES periods (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `) // test
      await db.execute(`
        CREATE TABLE IF NOT EXISTS period_configurations (
          periodId INT UNSIGNED NOT NULL,
          definitionKey VARCHAR(255) NOT NULL,
          data TEXT NOT NULL,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (periodId, definitionKey),
          FOREIGN KEY (periodId) REFERENCES periods (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS period_program_requirements (
          periodId INT UNSIGNED NOT NULL,
          programKey VARCHAR(255) NOT NULL,
          requirementKey VARCHAR(255) NOT NULL,
          workflowStageKey VARCHAR(255) NULL,
          disabled TINYINT(1) NOT NULL DEFAULT 0,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (periodId, programKey, requirementKey),
          FOREIGN KEY (periodId) REFERENCES periods (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS period_workflow_stages (
          periodId INT UNSIGNED NOT NULL,
          stageKey VARCHAR(255) NOT NULL,
          programKey VARCHAR(255) NOT NULL,
          title TEXT NOT NULL,
          blocking TINYINT(1) NOT NULL DEFAULT 0,
          evaluationOrder TINYINT UNSIGNED NOT NULL DEFAULT 0,
          PRIMARY KEY (periodId, stageKey, programKey),
          FOREIGN KEY (periodId) REFERENCES periods (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
    }
  }
]
