import { DatabaseMigration } from '../migrations'

export const announcementMigrations: DatabaseMigration[] = [
  {
    id: '20260629000000',
    async execute (db) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS announcements (
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          type VARCHAR(255),
          link VARCHAR(255),
          linkText VARCHAR(255),
          subject VARCHAR(255) NOT NULL,
          body TEXT NOT NULL,
          start DATETIME,
          end DATETIME,
          enabled TINYINT(1) NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
    }
  }
]
