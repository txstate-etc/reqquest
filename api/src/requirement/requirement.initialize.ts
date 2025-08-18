import { Queryable } from 'mysql2-async'
import { DatabaseMigration } from '../internal.js'

export const requirementMigrations: DatabaseMigration[] = [
  {
    id: '20250212020000',
    async execute (db: Queryable) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS application_requirements (
          id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
          applicationId INT UNSIGNED NOT NULL,
          appRequestId INT UNSIGNED NOT NULL,
          requirementKey VARCHAR(255) NOT NULL,
          workflowStage VARCHAR(255) NULL,
          evaluationOrder SMALLINT UNSIGNED NOT NULL DEFAULT 0,
          status VARCHAR(255) NOT NULL DEFAULT 'PENDING',
          statusReason TEXT,
          FOREIGN KEY (appRequestId) REFERENCES app_requests (id),
          FOREIGN KEY (applicationId) REFERENCES applications (id),
          INDEX (requirementKey),
          INDEX (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
    }
  }
]
