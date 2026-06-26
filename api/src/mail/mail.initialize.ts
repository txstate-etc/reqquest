import { DatabaseMigration } from '../migrations'
import { seedMailTemplates } from './mail.seed.js'

export const mailMigrations: DatabaseMigration[] = [
  {
    id: '20250114094100',
    async execute (db) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS mail_templates (
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          templateKey VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          audience VARCHAR(255) NOT NULL,
          variables LONGTEXT,
          subject VARCHAR(255) NOT NULL,
          body TEXT NOT NULL,
          created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          enabled TINYINT(1) NOT NULL DEFAULT 0,
          UNIQUE (templateKey)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS mail_outbox (
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          templateKey VARCHAR(255) NOT NULL,
          emailTo VARCHAR(255) NOT NULL,
          replyTo VARCHAR(255),
          variables LONGTEXT,
          triggeredAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          sentAt DATETIME,
          status VARCHAR(255) NOT NULL,
          attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
          lastErrorAt DATETIME,
          lastErrorMessage VARCHAR(255),
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
      await seedMailTemplates()
    }
  }
]
