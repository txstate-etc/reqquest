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

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGroups (
      roleId INT UNSIGNED NOT NULL,
      groupName VARCHAR(128) NOT NULL,
      dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (roleId, groupName),
      INDEX (groupName),
      FOREIGN KEY (roleId) REFERENCES accessRoles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGrants (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      roleId INT UNSIGNED NOT NULL,
      controlGroup VARCHAR(64) NOT NULL,
      allow TINYINT(1) DEFAULT 0,
      FOREIGN KEY (roleId) REFERENCES accessRoles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGrantTags (
      grantId INT UNSIGNED NOT NULL,
      category VARCHAR(128) NOT NULL,
      tag VARCHAR(128) NOT NULL,
      PRIMARY KEY (grantId, category, tag),
      FOREIGN KEY (grantId) REFERENCES accessRoleGrants(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    await db.execute(`CREATE TABLE IF NOT EXISTS accessRoleGrantControls (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      grantId INT UNSIGNED NOT NULL,
      control VARCHAR(64) NOT NULL,
      UNIQUE (grantId, control),
      FOREIGN KEY (grantId) REFERENCES accessRoleGrants(id) ON DELETE CASCADE
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
      otherInfo JSON,
      lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      stillValid TINYINT(1) DEFAULT 1,
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
      groupName VARCHAR(128) NOT NULL,
      PRIMARY KEY (userId, groupName),
      FOREIGN KEY (userId) REFERENCES accessUsers(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

    /**
     * Index user otherInfo properties for searching/filtering. Looks similar to app_request_tags.
     * Separate from accessUserIdentifiers table, which requires a one to one unique id and label
     * mapping to userId, however, both sets of data reside within the otherInfo field; so there
     * may be field collisions within the otherInfo property. To avoid this will namespace fields
     * within otherInfo property. otherInfo substructures looks like:
     *   - identifiers sub-property for accessUserIdentifiers labels
     *   - groupings sub-property for accessUserGroupings labels
     *   - meta sub-property for non-indexed associated data
     */
    await db.execute(`CREATE TABLE IF NOT EXISTS accessUserGroupings (
      userId INT UNSIGNED NOT NULL,
      label VARCHAR(128) NOT NULL, -- ex: Staff
      id VARCHAR(128) NOT NULL, -- ex: institutionalRole
      PRIMARY KEY (userId, label, id),
      FOREIGN KEY (userId) REFERENCES accessUsers(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
  }
}]
