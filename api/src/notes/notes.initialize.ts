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
  },
  {
    id: '20260414110000',
    async execute (db: Queryable) {
      const exists = await db.getval("SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_NAME = 'app_request_notes' AND COLUMN_NAME = 'persistent'")
      if (!exists) await db.execute('ALTER TABLE app_request_notes ADD COLUMN persistent TINYINT(1) NOT NULL DEFAULT 0')
    }
  },
  {
    id: '20260617120000',
    async execute (db: Queryable) {
      // NOTE: Requires mysql version 5.7 which our systems support (may even be supported earlier)
      //   https://dev.mysql.com/doc/refman/5.7/en/fulltext-natural-language.html
      // However if this is an issue we can revert to searching with LIKEs.
      const exists = await db.getval("SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_NAME = 'app_request_notes' AND INDEX_NAME = 'ft_content'")
      if (!exists) await db.execute('ALTER TABLE app_request_notes ADD FULLTEXT INDEX ft_content (content)')
    }
  }
]
