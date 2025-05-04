import db from 'mysql2-async/db'

/**
 * Safety type for accurate seeding of definition data
 */
export type AccessRoleGrantDefinition<AdditionalSubjectTypes = unknown, AdditionalControls = unknown> = {
  [roleName: string]: {
    scope?: string
    groups: string[]
    grants: {
      subjectType: string
      subjects?: string[]
      controls: string[]
      allow: boolean
    }[]
  }
}

export const rqAccessSeed: AccessRoleGrantDefinition = {
  Applicant: {
    groups: [process.env.RQ_APPLICANT_GROUP ?? 'applicants'],
    grants: [
      {
        subjectType: 'AppRequest',
        controls: ['create_own', 'cancel', 'cancel_review', 'reopen_own', 'submit_own', 'return_own'],
        allow: true
      }
    ]
  },
  Reviewer: {
    groups: [process.env.RQ_REVIEWER_GROUP ?? 'reviewers'],
    grants: [
      {
        subjectType: 'AppRequest',
        controls: ['review', 'return', 'reopen', 'close'],
        allow: true
      },
      {
        subjectType: 'Prompt',
        controls: ['view', 'update'],
        allow: true
      },
      {
        subjectType: 'Requirement',
        controls: ['view'],
        allow: true
      },
      {
        subjectType: 'Program',
        controls: ['view'],
        allow: true
      }
    ]
  },
  SystemAdministrator: {
    groups: [process.env.RQ_ADMIN_GROUP ?? 'administrators'],
    grants: [
      { subjectType: 'AppRequest', controls: ['review'], allow: true },
      { subjectType: 'Period', controls: ['view', 'create', 'update', 'delete'], allow: true },
      { subjectType: 'Program', controls: ['view_configuration', 'configure', 'disable'], allow: true },
      { subjectType: 'Prompt', controls: ['view_configuration', 'configure'], allow: true },
      { subjectType: 'Requirement', controls: ['view_configuration', 'configure', 'disable'], allow: true },
      { subjectType: 'Role', controls: ['view', 'create', 'update', 'delete'], allow: true }
    ]
  }
}

export async function seedAccessRoles (appDef: AccessRoleGrantDefinition): Promise<void> {
  for (const [name, roleDef] of Object.entries(appDef)) {
    const roleId = await db.insert('INSERT INTO accessRoles (name, scope) VALUES (?, ?)', [name, roleDef.scope])
    for (const group of roleDef.groups) {
      const groupId = await db.insert('INSERT INTO accessGroups (name) VALUES (?)', [group])
      await db.insert('INSERT INTO accessRoleGroups (roleId, groupId) VALUES (?, ?)', [roleId, groupId])
    }
    for (const grant of roleDef.grants) {
      const grantId = await db.insert('INSERT INTO accessRoleGrants (roleId, subjectType, allow) VALUES (?, ?, ?)', [
        roleId,
        grant.subjectType,
        grant.allow
      ])
      if (grant.subjects?.length) {
        const binds: any[] = []
        await db.insert(`
          INSERT INTO accessRoleGrantSubjects (grantId, subject)
          VALUES ${db.in(binds, grant.subjects.map(s => [grantId, s]))}
        `, binds)
      }
      for (const control of grant.controls) {
        const controlId = await db.insert('INSERT INTO accessRoleGrantControls (grantId, control) VALUES (?, ?)', [
          grantId,
          control
        ])
        // TODO: add tags
      }
    }
  }
}
