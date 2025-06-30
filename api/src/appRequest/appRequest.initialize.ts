import { Queryable } from 'mysql2-async'
import { AppRequestStatusDB, DatabaseMigration } from '../internal.js'

export const appRequestMigrations: DatabaseMigration[] = [
  {
    id: '20250210110100',
    async execute (db: Queryable) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS app_requests (
          id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
          periodId INT UNSIGNED NOT NULL,
          userId INT UNSIGNED NOT NULL,
          status VARCHAR(255) NOT NULL DEFAULT '${AppRequestStatusDB.STARTED}',
          computedStatus VARCHAR(255) NOT NULL DEFAULT 'PREQUAL',
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
      await db.execute(`CREATE TABLE IF NOT EXISTS tag_labels (
        category VARCHAR(128) NOT NULL,
        tag VARCHAR(128) NOT NULL,
        label VARCHAR(255) NOT NULL,
        PRIMARY KEY (category, tag)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
      await db.execute(`CREATE TABLE IF NOT EXISTS app_request_tags (
        appRequestId INT UNSIGNED NOT NULL,
        indexOnly TINYINT(1) NOT NULL DEFAULT 0,
        category VARCHAR(128) NOT NULL,
        tag VARCHAR(128) NOT NULL,
        PRIMARY KEY (appRequestId, category, tag),
        FOREIGN KEY (appRequestId) REFERENCES app_requests (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
      await db.execute(`CREATE TABLE IF NOT EXISTS app_request_activity (
        id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        appRequestId INT UNSIGNED NOT NULL,
        userId INT UNSIGNED NOT NULL,
        impersonatedBy INT UNSIGNED,
        action VARCHAR(255) NOT NULL,
        description TEXT,
        data TEXT,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appRequestId) REFERENCES app_requests (id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES accessUsers (id),
        FOREIGN KEY (impersonatedBy) REFERENCES accessUsers (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
      await db.execute(`CREATE TABLE IF NOT EXISTS app_request_notes (
        id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        appRequestId INT UNSIGNED NOT NULL,
        authorId INT UNSIGNED NOT NULL,
        internal TINYINT(1) NOT NULL,
        content TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appRequestId) REFERENCES app_requests (id) ON DELETE CASCADE,
        FOREIGN KEY (authorId) REFERENCES accessUsers (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
      await db.execute(`CREATE TABLE IF NOT EXISTS mutationlog (
        id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        userId INT UNSIGNED NOT NULL,
        impersonatedBy INT UNSIGNED,
        clientId VARCHAR(255) NOT NULL,
        scope VARCHAR(255),
        mutation VARCHAR(255) NOT NULL,
        query TEXT NOT NULL,
        variables LONGTEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES accessUsers (id),
        FOREIGN KEY (impersonatedBy) REFERENCES accessUsers (id),
        INDEX (createdAt),
        INDEX (mutation),
        INDEX (clientId, scope)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
    }
  }
]
