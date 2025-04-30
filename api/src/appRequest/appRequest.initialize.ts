import { Queryable } from 'mysql2-async'
import { AppRequestStatusDB, DatabaseMigration } from '../internal.js'

export const appRequestMigrations: DatabaseMigration[] = [
  {
    id: '20250210110100',
    async execute (db: Queryable) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS app_requests (
          id INT UNSIGNED NOT NULL PRIMARY KEY,
          periodId INT UNSIGNED NOT NULL,
          userId INT UNSIGNED NOT NULL,
          status VARCHAR(255) NOT NULL DEFAULT '${AppRequestStatusDB.STARTED}',
          submitEligible TINYINT UNSIGNED NOT NULL DEFAULT 0,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          closedAt DATETIME,
          data LONGTEXT,
          submittedData LONGTEXT,
          FOREIGN KEY (userId) REFERENCES accessUsers (id),
          FOREIGN KEY (periodId) REFERENCES periods (id),
          INDEX (status),
          INDEX (createdAt),
          INDEX (updatedAt),
          INDEX (closedAt)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
    }
  }
]
