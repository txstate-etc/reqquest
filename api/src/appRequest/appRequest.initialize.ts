import { Queryable } from 'mysql2-async'
import { isBlank } from 'txstate-utils'
import { AppRequestPhase, AppRequestStatus, AppRequestStatusDB, DatabaseMigration } from '../internal.js'

export const appRequestMigrations: DatabaseMigration[] = [
  {
    id: '20250210110100',
    async execute (db: Queryable) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS app_requests (
          id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
          periodId INT UNSIGNED NOT NULL,
          userId INT UNSIGNED NOT NULL,
          reviewStarted TINYINT(1) NOT NULL DEFAULT 0,
          status VARCHAR(255) NOT NULL DEFAULT '${AppRequestStatusDB.OPEN}',
          phase VARCHAR(255) NOT NULL DEFAULT '${AppRequestPhase.STARTED}',
          computedStatus VARCHAR(255) NOT NULL DEFAULT '${AppRequestStatus.STARTED}',
          computedReadyToComplete TINYINT(1) NOT NULL DEFAULT 0,
          computedAwaitingCorrection TINYINT(1) NOT NULL DEFAULT 0,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          submittedAt DATETIME,
          closedAt DATETIME,
          data LONGTEXT,
          submittedData LONGTEXT,
          dataVersion INT UNSIGNED NOT NULL DEFAULT 0,
          FOREIGN KEY (userId) REFERENCES accessUsers (id),
          FOREIGN KEY (periodId) REFERENCES periods (id),
          INDEX (status),
          INDEX (createdAt),
          INDEX (updatedAt),
          INDEX (submittedAt),
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
        INDEX (appRequestId, createdAt),
        INDEX (userId, createdAt),
        INDEX (impersonatedBy, createdAt),
        FOREIGN KEY (appRequestId) REFERENCES app_requests (id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES accessUsers (id),
        FOREIGN KEY (impersonatedBy) REFERENCES accessUsers (id)
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
  }, {
    id: '20260209190000',
    async execute (db: Queryable) {
      const exists = await db.getval("SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'app_requests' AND COLUMN_NAME = 'reviewStarted'")
      if (!exists) await db.execute('ALTER TABLE app_requests ADD COLUMN reviewStarted TINYINT(1) NOT NULL DEFAULT 0')
    }
  }, {
    id: '20260210120000',
    async execute (db: Queryable) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS temp_authorizations (
          code CHAR(36) NOT NULL PRIMARY KEY,
          auth TEXT NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
    }
  }, {
    id: '20260715000000',
    async execute (db: Queryable) {
      const exists = await db.getval("SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'app_requests' AND COLUMN_NAME = 'computedAwaitingCorrection'")
      if (!exists) await db.execute('ALTER TABLE app_requests ADD COLUMN computedAwaitingCorrection TINYINT(1) NOT NULL DEFAULT 0 AFTER computedReadyToComplete')
    }
  }, {
    id: '20260804000000',
    async execute (db: Queryable) {
      // NOTE: Requires mysql version 5.7 which our systems support (may even be supported earlier)
      //   https://dev.mysql.com/doc/refman/5.7/en/fulltext-natural-language.html
      // However if this is an issue we can revert to searching with LIKEs.
      const exists = await db.getval("SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'app_request_activity' AND INDEX_NAME = 'ft_description'")
      if (!exists) await db.execute('ALTER TABLE app_request_activity ADD FULLTEXT INDEX ft_description (description)')
    }
  }, {
    id: '20260806000000',
    async execute (db: Queryable) {
      await db.execute(`ALTER TABLE app_requests ALTER COLUMN computedStatus SET DEFAULT '${AppRequestStatus.STARTED}'`)
    }
  }, {
    /**
     * Split the activity log's `action` into a bare verb, moving everything else into `description`.
     *
     * The old code wrote a whole sentence into `action` ('Returned entire request to review phase.',
     * 'Dog Adoption Updated', 'Advanced Dog Adoption workflow from Vet Check to Home Visit.'). Program
     * titles, workflow stage titles and rescind reasons were interpolated into it, so the set of distinct
     * values was unbounded and the `actions` filter could not be offered as a usable facet.
     *
     * The descriptions produced here are close to, but not always identical to, what the current code
     * would write for the same event - they only have to read well next to it.
     */
    id: '20261015000000',
    async execute (db: Queryable) {
      /** verbs for activity log where action found at the END, e.g. 'Dog Adoption Updated', 'Note Persistence' */
      const trailingActions: Record<string, string> = { Updated: 'Updated', Persistence: 'Persisted' }

      /**
       * Older descriptive actions with the verb buried mid-sentence or missing altogether.
       * Mapped onto the closest current verb/description.
       */
      const patchedActions: Record<string, [string, string]> = {
        'No review required, completed automatically.': ['Completed', 'Request automatically, no review required'],
        'Made Offer': ['Completed', 'Review'],
        'Pulled Back Offer': ['Returned', 'Offer pulled back']
      }

      /**
       * Rewrite one old activity row into the new shape: `action` keeps only the verb, everything else moves to
       * the front of `description`.
       *
       * Leading verbs ('Rescinded Dog Adoption: ...', 'Advanced Dog Adoption workflow from ...', 'Added Note',
       * 'Submitted request for review.') need no list - whatever word comes first is the verb. That fallback
       * also tidies up multi-word actions written by a downstream project's own recordActivity calls.
       *
       * idempotent: An action that is already a single word is left exactly as it is which makes this safe to run twice.
       */
      function splitActivityAction (action: string, description: string | null) {
        const words = action.trim().split(/\s+/)
        let verb = action
        let moved = ''
        let newDescription = description
        if (words.length > 1) {
          const trailingVerb = trailingActions[words[words.length - 1]]
          if (patchedActions[action]) [verb, moved] = patchedActions[action]
          else if (trailingVerb) [verb, moved] = [trailingVerb, words.slice(0, -1).join(' ')]
          else [verb, moved] = [words[0], words.slice(1).join(' ')]
          // strip before testing: a remainder of nothing but punctuation empties it
          moved = moved.replace(/\.+$/, '')
          if (moved) {
            moved = moved[0].toUpperCase() + moved.slice(1)
            newDescription = isBlank(description) ? moved : `${moved}: ${description!}`
          }
        }
        return { action: verb, description: newDescription }
      }
      const batchSize = 500
      let lastId = 0
      while (true) {
        const rows = await db.getall<{ id: number, action: string, description: string | null }>(
          `SELECT id, action, description FROM app_request_activity WHERE id >= ? ORDER BY id LIMIT ${batchSize}`,
          [lastId]
        )
        if (!rows.length) break
        lastId = rows[rows.length - 1].id + 1
        for (const row of rows) {
          const next = splitActivityAction(row.action, row.description)
          if (next.action === row.action && next.description === row.description) continue
          await db.update('UPDATE app_request_activity SET action = ?, description = ? WHERE id = ?', [next.action, next.description, row.id])
        }
      }
    }
  }
]
