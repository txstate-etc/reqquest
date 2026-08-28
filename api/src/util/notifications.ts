import { appConfig, Application, ApplicationPhase, ApplicationRescindedStatus, AppRequest, AppRequestPhase, AppRequestStatus, MailService } from '../internal.js'
import type { RQContext } from './auth.js'

type AppRequestNotificationCB = (ctx: RQContext, appRequest: AppRequest, oldAppRequestStatus: AppRequestStatus) => void | Promise<void>
type ApplicationPhaseNotificationCB = (ctx: RQContext, appRequest: AppRequest, application: Application, oldPhase: ApplicationPhase) => void | Promise<void>
type ApplicationRescindNotificationCB = (ctx: RQContext, appRequest: AppRequest, application: Application, reason: string) => void | Promise<void>

export const appRequestNotifications: AppRequestNotificationCB[] = [
  async (ctx, ar, oldAppRequestStatus) => {
    const { from } = appConfig.emailConfig
    // Review complete
    if (ar.phase === AppRequestPhase.COMPLETE) {
      await ctx.svc(MailService).sendmulti({ from, userIds: [ar.userInternalId], templateKey: 'review_complete', extra: appConfig.emailConfig })
    }
  },
  async (ctx, ar, oldAppRequestStatus) => {
    const { from } = appConfig.emailConfig
    // Returned back to applicant - the reviewer handed control back, so the request is in
    // STARTED again. Without the phase check this would also fire on forward progress out
    // of APPROVAL/PREAPPROVAL (e.g. completeReview).
    if (ar.phase === AppRequestPhase.STARTED && [AppRequestStatus.APPROVAL, AppRequestStatus.PREAPPROVAL].includes(oldAppRequestStatus)) {
      await ctx.svc(MailService).sendmulti({ from, userIds: [ar.userInternalId], templateKey: 'app_request_return', extra: appConfig.emailConfig })
    }
  }
]

export const applicationPhaseNotifications: ApplicationPhaseNotificationCB[] = [
  async (ctx, ar, application, oldPhase) => {
    const { from } = appConfig.emailConfig
    // Individual application review complete
    if (application.phase === ApplicationPhase.REVIEW_COMPLETE) {
      await ctx.svc(MailService).sendmulti({ from, userIds: [ar.userInternalId], templateKey: 'application_complete', extra: { ...appConfig.emailConfig, programName: application.title } })
    }
  }
]

export const applicationRescindNotifications: ApplicationRescindNotificationCB[] = [
  async (ctx, ar, application, reason) => {
    const { from } = appConfig.emailConfig
    // An approved/accepted application was pulled back from the applicant.
    if (application.rescindedStatus === ApplicationRescindedStatus.RESCINDED) {
      await ctx.svc(MailService).sendmulti({ from, userIds: [ar.userInternalId], templateKey: 'application_rescinded', extra: { ...appConfig.emailConfig, programName: application.title, reason } })
    }
  },
  async (ctx, ar, application, reason) => {
    const { from } = appConfig.emailConfig
    // A previously rescinded application was put back the way it was.
    if (application.rescindedStatus === ApplicationRescindedStatus.RESTORED) {
      await ctx.svc(MailService).sendmulti({ from, userIds: [ar.userInternalId], templateKey: 'application_restored', extra: { ...appConfig.emailConfig, programName: application.title, reason } })
    }
  }
]
