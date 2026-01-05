import { Queryable } from 'mysql2-async'
import { DatabaseMigration } from '../internal.js'

export const noteMigrations: DatabaseMigration[] = [
  {
    id: '20260105110000',
    async execute (db: Queryable) {
      await db.execute(`CREATE TABLE IF NOT EXISTS app_request_notes (
        id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        appRequestId INT UNSIGNED NOT NULL,
        authorId INT UNSIGNED NOT NULL,
        content TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (appRequestId) REFERENCES app_requests (id) ON DELETE CASCADE,
        FOREIGN KEY (authorId) REFERENCES accessUsers (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
    }
  }
]
