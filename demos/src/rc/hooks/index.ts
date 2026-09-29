import type { AppDefinition } from '@reqquest/api'
import { periodOpenedNotification } from './periodOpenedNotification.js'

export const rcHooks: AppDefinition['hooks'] = {
  scheduled: {
    period_opened_notification: periodOpenedNotification
  }
}
