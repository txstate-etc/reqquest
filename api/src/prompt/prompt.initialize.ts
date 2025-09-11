import { Queryable } from 'mysql2-async'
import { DatabaseMigration } from '../migrations'

export const promptMigrations: DatabaseMigration[] = [
  {
    id: '20250214094100',
    execute: async (db: Queryable) => {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS requirement_prompts (
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          appRequestId INT UNSIGNED NOT NULL,
          applicationId INT UNSIGNED NOT NULL,
          requirementId INT UNSIGNED NOT NULL,
          promptKey VARCHAR(255) NOT NULL,
          evaluationOrder SMALLINT UNSIGNED NOT NULL DEFAULT 0,
          answered TINYINT UNSIGNED NOT NULL DEFAULT 0,
          invalidated TINYINT UNSIGNED NOT NULL DEFAULT 0,
          invalidatedReason TEXT,
          visibility VARCHAR(50) NOT NULL DEFAULT 'UNREACHABLE',
          FOREIGN KEY (appRequestId) REFERENCES app_requests (id),
          FOREIGN KEY (applicationId) REFERENCES applications (id),
          FOREIGN KEY (requirementId) REFERENCES application_requirements (id),
          INDEX (promptKey)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
    }
  }
]
