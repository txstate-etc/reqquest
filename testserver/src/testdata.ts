import { createAppRequest, createPeriod, DatabaseMigration, AccessDatabase, updateAppRequestData, submitAppRequest, markPeriodReviewed } from '@reqquest/api'
import { DateTime } from 'luxon'

export const testMigrations: DatabaseMigration[] = [
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
    id: '20250722104300', // playwright test init support
    execute: async (db, installTestData) => {
      if (!installTestData) return
      await AccessDatabase.upsertAccessUser({ login: 'su01', fullname: 'Super User 1 Admin', groups: ['administrators'] })
      const su01 = await db.getrow<{ id: number, login: string }>('SELECT * FROM accessUsers WHERE login = ?', ['su01'])
      await AccessDatabase.upsertAccessUser({ login: 'su02', fullname: 'Super User 2 Admin', groups: ['administrators'] })
      const su02 = await db.getrow<{ id: number, login: string }>('SELECT * FROM accessUsers WHERE login = ?', ['su02'])
      if (!su02) return

      // await submitAppRequest(appRequestId)
    }
  }
]
