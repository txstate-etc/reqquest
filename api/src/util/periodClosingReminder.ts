import { DateTime } from 'luxon'
import { appConfig, AppRequestPhase, getAppRequests, getPeriods, MailService, type RQContext } from '../internal.js'

/**
 * Built-in scheduled job: remind applicants who have STARTED but not submitted an app request
 * that the period is about to close.
 *
 * Configured entirely from `appConfig.emailConfig`:
 * - `periodClosing.daysBefore` - the first reminder goes out once closeDate is within this many days.
 * - `periodClosing.reminderDays` - a follow-up every this many days after that, while the request is
 *   still STARTED. Omit for a single reminder.
 *
 * Also serves as reference implementation for `hooks.scheduled` jobs.
 */
export async function periodClosingReminder (ctx: RQContext) {
  const { periodClosing, from } = appConfig.emailConfig
  const daysBefore = periodClosing?.daysBefore
  if (!daysBefore || daysBefore <= 0) return
  const reminderDays = periodClosing?.reminderDays ?? 0
  const now = DateTime.now()

  const periods = await getPeriods({ closesAfter: now, closesBefore: now.plus({ days: daysBefore }) })
  for (const period of periods) {
    if (!period.closeDate) continue
    const daysUntilClose = period.closeDate.diff(now, 'days').days
    const daysIntoWindow = daysBefore - daysUntilClose
    // occurrence 0 fires as soon as we enter the window; each subsequent one every reminderDays after that
    const occurrence = reminderDays > 0 ? Math.floor(daysIntoWindow / reminderDays) : 0

    const requests = await getAppRequests({ periodIds: [period.id], closed: false })
    const started = requests.filter(ar => ar.phase === AppRequestPhase.STARTED)
    if (!started.length) continue

    await ctx.svc(MailService).sendmulti({
      from,
      userIds: Array.from(new Set(started.map(ar => ar.userInternalId))),
      templateKey: 'period_closing_reminder',
      extra: {
        ...appConfig.emailConfig,
        periodName: period.name,
        closeDate: period.closeDate.toFormat('DDDD'),
        daysUntilClose: Math.max(1, Math.ceil(daysUntilClose))
      },
      dedupKey: userInternalId => `period_closing_${period.id}_${userInternalId}_${occurrence}`
    })
  }
}
