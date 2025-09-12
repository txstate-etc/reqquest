import { createAppRequest, createPeriod, DatabaseMigration, AccessDatabase, updateAppRequestData, submitAppRequest, markPeriodReviewed } from '@reqquest/api'
import { DateTime } from 'luxon'

export const simpleTestMigrations: DatabaseMigration[] = [
  {
    id: '20250430210000',
    execute: async (db, installTestData) => {
      if (!installTestData) return
      await AccessDatabase.upsertAccessUser({ login: 'applicant', fullname: 'Test Applicant 1', groups: ['applicants'] })
      const applicant = await db.getrow<{ id: number, login: string }>('SELECT * FROM accessUsers WHERE login = ?', ['applicant'])
      if (!applicant) return
      const oldPeriodId = await createPeriod({ name: '2024', openDate: DateTime.fromFormat('20240101080000', 'yyyyMMddHHmmss'), closeDate: DateTime.fromFormat('20241231235959', 'yyyyMMddHHmmss') })
      const periodId = await createPeriod({ name: '2025', openDate: DateTime.fromFormat('20250101080000', 'yyyyMMddHHmmss'), closeDate: DateTime.fromFormat('20251231235959', 'yyyyMMddHHmmss') })
      const specialPeriodId = await createPeriod({ name: '2025 Special', openDate: DateTime.fromFormat('20250601080000', 'yyyyMMddHHmmss'), closeDate: DateTime.fromFormat('20250830235959', 'yyyyMMddHHmmss') })
      await markPeriodReviewed(oldPeriodId)
      await markPeriodReviewed(periodId)
      await markPeriodReviewed(specialPeriodId)
      const appRequestId = await createAppRequest(periodId, applicant.id)
      await updateAppRequestData(appRequestId, { which_state_prompt: { state: 'TX' }, have_yard_prompt: { haveYard: true, squareFootage: 100, totalPets: 2 }, have_a_cat_tower_prompt: { haveCatTower: false, willPurchaseCatTower: true }, not_allergic_to_tuna_prompt: { allergicToTuna: false }, savedAtVersion: '20240101000000' })
      // await submitAppRequest(appRequestId)
    }
  },
  {
    id: '20250722104300', // test support
    execute: async (db, installTestData) => {
      if (!installTestData) return
      await AccessDatabase.upsertAccessUser({ login: 'admin_01', fullname: 'Admin 01 full name prior to upsert', groups: ['administrators'] })
      const su01 = await db.getrow<{ id: number, login: string }>('SELECT * FROM accessUsers WHERE login = ?', ['su01'])

      // Note: cloned from access.seed implementation to support creation of su style account in demos
      type AccessRoleGrantDefinition<AdditionalControlGroups = unknown, AdditionalControls = unknown> = {
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
      const rqAccessSeed: AccessRoleGrantDefinition = {
        Su: {
          description: 'This role is a super user role to assist in validation and development of automated test tasks (seeded via testdata.ts)',
          groups: ['sudoers'],
          grants: [
            { controlGroup: 'AppRequestOwn', controls: ['create', 'cancel', 'uncancel'], allow: true },
            { controlGroup: 'AppRequestOwnReview', controls: ['withdraw', 'unwithdraw'], allow: true },
            { controlGroup: 'AppRequest', controls: ['review', 'return', 'reopen', 'close', 'offer'], allow: true },
            { controlGroup: 'AppRequestPreReview', controls: ['create', 'uncancel'], allow: true },
            { controlGroup: 'PromptAnswer', controls: ['view', 'update'], allow: true },
            { controlGroup: 'ApplicationRequirement', controls: ['view'], allow: true },
            { controlGroup: 'Application', controls: ['view'], allow: true },
            { controlGroup: 'Period', controls: ['view', 'view_configuration', 'create', 'update', 'delete'], allow: true },
            { controlGroup: 'Program', controls: ['view', 'configure', 'disable'], allow: true },
            { controlGroup: 'Prompt', controls: ['view', 'configure'], allow: true },
            { controlGroup: 'Requirement', controls: ['view', 'configure', 'disable'], allow: true },
            { controlGroup: 'Role', controls: ['view', 'create', 'update', 'delete'], allow: true }
          ]
        }
      }
      for (const [name, roleDef] of Object.entries(rqAccessSeed)) {
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
  }
]
