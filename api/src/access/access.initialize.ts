import { DatabaseMigration, seedAccessRoles, rqAccessSeed } from '../internal.js'

/**
 * Merges application access configuration with core (RQ) for building migrations
 */
export const accessMigrations: DatabaseMigration[] = [{
  id: '20241119000000',
  execute: async db => {
    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoles (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(128) NOT NULL,
      description TEXT NULL,
      scope VARCHAR(64) NULL,
      UNIQUE (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessGroups (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(128) NOT NULL,
      UNIQUE (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGroups (
      roleId INT UNSIGNED NOT NULL,
      groupId INT UNSIGNED NOT NULL,
      PRIMARY KEY (roleId, groupId),
      FOREIGN KEY (roleId) REFERENCES accessRoles(id) ON DELETE CASCADE,
      FOREIGN KEY (groupId) REFERENCES accessGroups(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGrants (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      roleId INT UNSIGNED NOT NULL,
      subjectType VARCHAR(64) NOT NULL,
      allow TINYINT(1) DEFAULT 0,
      FOREIGN KEY (roleId) REFERENCES accessRoles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGrantSubjects (
      grantId INT UNSIGNED NOT NULL,
      subject VARCHAR(128) NOT NULL,
      PRIMARY KEY (grantId, subject),
      FOREIGN KEY (grantId) REFERENCES accessRoleGrants(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGrantControls (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      grantId INT UNSIGNED NOT NULL,
      control VARCHAR(64) NOT NULL,
      UNIQUE (grantId, control),
      FOREIGN KEY (grantId) REFERENCES accessRoleGrants(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGrantControlTags (
      controlId INT UNSIGNED NOT NULL,
      category VARCHAR(128) NOT NULL DEFAULT '',
      tag VARCHAR(128) NOT NULL,
      PRIMARY KEY (controlId, category, tag),
      FOREIGN KEY (controlId) REFERENCES accessRoleGrantControls(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    /** Seed Data */
    await seedAccessRoles(rqAccessSeed)

    /**
     * NOTE: The following tables are used as a local cache mechanism for user details as
     * sourced from the implementation's userLookup.byLogins function.
     */
    await db.execute(`CREATE TABLE IF NOT EXISTS accessUsers (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      login VARCHAR(128) NOT NULL,
      fullname VARCHAR(255) NOT NULL,
      otherInfo TEXT,
      lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE (login)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessUserIdentifiers (
      userId INT UNSIGNED NOT NULL,
      label VARCHAR(128) NOT NULL,
      id VARCHAR(128) NOT NULL,
      PRIMARY KEY (userId, label, id),
      UNIQUE (id, label),
      FOREIGN KEY (userId) REFERENCES accessUsers(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessUserGroups (
      userId INT UNSIGNED NOT NULL,
      groupId INT UNSIGNED NOT NULL,
      PRIMARY KEY (userId, groupId),
      FOREIGN KEY (userId) REFERENCES accessUsers(id) ON DELETE CASCADE,
      FOREIGN KEY (groupId) REFERENCES accessGroups(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
  }
}]
