import db from 'mysql2-async/db'

/**
 * Safety type for accurate seeding of definition data
 */
export type AccessRoleGrantDefinition<AdditionalControlGroups = unknown, AdditionalControls = unknown> = {
  [roleName: string]: {
    scope?: string
    description?: string
    groups: string[]
    grants: {
      controlGroup: string
      controls: string[]
      allow: boolean
    }[]
  }
}

export const rqAccessSeed: AccessRoleGrantDefinition = {
  Applicant: {
    description: 'This role is for applicants who are applying for a program. They can create and manage their own applications.',
    groups: [process.env.RQ_APPLICANT_GROUP ?? 'applicants'],
    grants: [
      {
        controlGroup: 'AppRequestOwn',
        controls: ['create', 'cancel', 'uncancel'],
        allow: true
      },
      {
        controlGroup: 'AppRequestOwnReview',
        controls: ['withdraw', 'unwithdraw'],
        allow: true
      }
    ]
  },
  Reviewer: {
    description: 'This role is for reviewers who are responsible for reviewing applications.',
    groups: [process.env.RQ_REVIEWER_GROUP ?? 'reviewers'],
    grants: [
      {
        controlGroup: 'AppRequest',
        controls: ['review', 'return', 'reopen', 'close', 'offer'],
        allow: true
      },
      {
        controlGroup: 'AppRequestPreReview',
        controls: ['create', 'uncancel'],
        allow: true
      },
      {
        controlGroup: 'PromptAnswer',
        controls: ['view', 'update'],
        allow: true
      },
      {
        controlGroup: 'ApplicationRequirement',
        controls: ['view'],
        allow: true
      },
      {
        controlGroup: 'Application',
        controls: ['view'],
        allow: true
      }
    ]
  },
  SystemAdministrator: {
    description: 'This role is for system administrators who configure the system and manage roles. They do not automatically have applicant and reviewer access.',
    groups: [process.env.RQ_ADMIN_GROUP ?? 'administrators'],
    grants: [
      { controlGroup: 'Period', controls: ['view', 'view_configuration', 'create', 'update', 'delete'], allow: true },
      { controlGroup: 'Program', controls: ['view', 'configure', 'disable'], allow: true },
      { controlGroup: 'Prompt', controls: ['view', 'configure'], allow: true },
      { controlGroup: 'Requirement', controls: ['view', 'configure', 'disable'], allow: true },
      { controlGroup: 'Role', controls: ['view', 'create', 'update', 'delete'], allow: true }
    ]
  }
}

export async function seedAccessRoles (appDef: AccessRoleGrantDefinition): Promise<void> {
  for (const [name, roleDef] of Object.entries(appDef)) {
    const roleId = await db.insert('INSERT INTO accessRoles (name, scope, description) VALUES (?, ?, ?)', [name, roleDef.scope, roleDef.description])
    const ibinds: any[] = []
    await db.insert(`INSERT INTO accessRoleGroups (roleId, groupName) VALUES ${db.in(ibinds, roleDef.groups.map(g => [roleId, g]))}`, ibinds)

    for (const grant of roleDef.grants) {
      const grantId = await db.insert('INSERT INTO accessRoleGrants (roleId, controlGroup, allow) VALUES (?, ?, ?)', [
        roleId,
        grant.controlGroup,
        grant.allow
      ])
      for (const control of grant.controls) {
        const controlId = await db.insert('INSERT INTO accessRoleGrantControls (grantId, control) VALUES (?, ?)', [
          grantId,
          control
        ])
      }
    }
  }
}
