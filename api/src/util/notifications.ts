import { AccessUserService, AppRequest, AppRequestPhase, AppRequestStatus, MailService } from '../internal.js'
import { RQContext } from './auth'

type NotificationCB = (ctx: RQContext, appRequest: AppRequest, oldAppRequestStatus: AppRequestStatus) => void | Promise<void>

export const internalNotifications: NotificationCB[] = [
  async (ctx, ar, oldAppRequestStatus) => {
    // Review complete
    if (ar.phase === AppRequestPhase.COMPLETE) {
      const user = await ctx.svc(AccessUserService).findByInternalId(ar.userInternalId)
      if (user?.email) await ctx.svc(MailService).sendmulti({ users: [user?.email], templateKey: 'ReviewComplete', extra: {} })
    }
  },
  async (ctx, ar, oldAppRequestStatus) => {
    // Returned back to applicant
    if (oldAppRequestStatus === AppRequestStatus.APPROVAL && ar.phase === AppRequestPhase.STARTED) {
      const user = await ctx.svc(AccessUserService).findByInternalId(ar.userInternalId)
      if (user?.email) await ctx.svc(MailService).sendmulti({ users: [user?.email], templateKey: 'ApplicantReturn', extra: {} })
    }
  }
]
