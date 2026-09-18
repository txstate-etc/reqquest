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
  },
  {
    id: '20260916000000',
    async execute (db) {
      // Date-range announcements used to be stored disabled and displayed anyway, because the
      // active filter OR'd the date range against `enabled`. Now that being enabled is required,
      // they must actually be enabled or they would all go dark. The editor never offered a way
      // to turn a date-range announcement off, so every existing one was effectively on.
      await db.update("UPDATE announcements SET enabled = 1 WHERE type = 'date'")
    }
  },
  {
    id: '20260916010000',
    async execute (db) {
      // The Announcement control group's create/update/delete controls collapsed into a single
      // `manage` control. Insert-then-delete rather than UPDATE: accessRoleGrantControls has a
      // UNIQUE KEY (grantId, control), so a grant holding all three would collide on the way over.
      // Deny grants (allow = 0) carry across too, which denies the whole group - the safe direction.
      await db.insert(`
        INSERT IGNORE INTO accessRoleGrantControls (grantId, control)
        SELECT DISTINCT c.grantId, 'manage'
          FROM accessRoleGrantControls c
          JOIN accessRoleGrants g ON g.id = c.grantId
         WHERE g.controlGroup = 'Announcement' AND c.control IN ('create', 'update', 'delete')
      `)
      await db.delete(`
        DELETE c FROM accessRoleGrantControls c
          JOIN accessRoleGrants g ON g.id = c.grantId
         WHERE g.controlGroup = 'Announcement' AND c.control IN ('create', 'update', 'delete')
      `)
    }
  }
]
