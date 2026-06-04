import { AccessUserService, ApplicationPhase, AppRequest, AppRequestPhase, MailService } from '../internal.js'
import { RQContext } from './auth'

type NotificationCB = (ctx: RQContext, appRequest: AppRequest, programKey: string, oldPhase: ApplicationPhase) => void | Promise<void>

export const internalNotifications: NotificationCB[] = [
  async (ctx, ar, programKey, oldPhase) => {
    if (ar.phase === AppRequestPhase.COMPLETE) {
      const user = await ctx.svc(AccessUserService).findByInternalId(ar.userInternalId)
      if (user?.email) await ctx.svc(MailService).sendmulti({ users: [user?.email], templateKey: 'ReviewComplete', extra: {} })
    }
  }
]
