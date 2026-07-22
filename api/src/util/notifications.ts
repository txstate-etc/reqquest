import { appConfig, ApplicationPhase, AppRequest, AppRequestPhase, AppRequestStatus, MailService } from '../internal.js'
import { RQContext } from './auth'

type AppRequestNotificationCB = (ctx: RQContext, appRequest: AppRequest, oldAppRequestStatus: AppRequestStatus) => void | Promise<void>
type ApplicationPhaseNotificationCB = (ctx: RQContext, appRequest: AppRequest, programKey: string, oldPhase: ApplicationPhase) => void | Promise<void>

export const appRequestNotifications: AppRequestNotificationCB[] = [
  async (ctx, ar, oldAppRequestStatus) => {
    // Review complete
    if (ar.phase === AppRequestPhase.COMPLETE) {
      await ctx.svc(MailService).sendmulti({ userIds: [ar.userInternalId], templateKey: 'review_complete', extra: appConfig.emailConfig })
    }
  },
  async (ctx, ar, oldAppRequestStatus) => {
    // Returned back to applicant
    if ([AppRequestStatus.APPROVAL, AppRequestStatus.PREAPPROVAL, AppRequestStatus.REVIEW_COMPLETE].includes(oldAppRequestStatus)) {
      await ctx.svc(MailService).sendmulti({ userIds: [ar.userInternalId], templateKey: 'applicant_return', extra: appConfig.emailConfig })
    }
  }
]

export const applicationPhaseNotifications: ApplicationPhaseNotificationCB[] = [
  async (ctx, ar, programKey, oldPhase) => {
    if (ar.phase === AppRequestPhase.COMPLETE) {
      console.log(`Application phase changed to COMPLETE for program ${programKey}, sending email to applicant`)
    }
  }
]
