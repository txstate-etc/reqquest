import { AccessUserService, appConfig, AppRequest, AppRequestPhase, AppRequestStatus, MailService } from '../internal.js'
import { RQContext } from './auth'

type NotificationCB = (ctx: RQContext, appRequest: AppRequest, oldAppRequestStatus: AppRequestStatus) => void | Promise<void>

export const internalNotifications: NotificationCB[] = [
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
