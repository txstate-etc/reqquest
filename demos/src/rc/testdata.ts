import { createAppRequest, createPeriod, DatabaseMigration, AccessDatabase, updateAppRequestData, submitAppRequest, markPeriodReviewed } from '@reqquest/api'
import { DateTime } from 'luxon'

export const rcTestMigrations: DatabaseMigration[] = [
  {
    id: '30251001090000',
    execute: async (db, installTestData) => {
      if (!installTestData) return
      const periodId = await createPeriod({ name: 'Period 1', code: 'Period 1', openDate: DateTime.fromFormat('20260101080000', 'yyyyMMddHHmmss') })
      await markPeriodReviewed(periodId)
    }
  }
]
