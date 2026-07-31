import { appConfig, Application, ApplicationPhase, AppRequest, AppRequestPhase, AppRequestStatus, MailService } from '../internal.js'
import { RQContext } from './auth'

type AppRequestNotificationCB = (ctx: RQContext, appRequest: AppRequest, oldAppRequestStatus: AppRequestStatus) => void | Promise<void>
type ApplicationPhaseNotificationCB = (ctx: RQContext, appRequest: AppRequest, applications: Application, oldPhase: ApplicationPhase) => void | Promise<void>

export const appRequestNotifications: AppRequestNotificationCB[] = [
  async (ctx, ar, oldAppRequestStatus) => {
    // Review complete
    if (ar.phase === AppRequestPhase.COMPLETE) {
      await ctx.svc(MailService).sendmulti({ userIds: [ar.userInternalId], templateKey: 'review_complete', extra: appConfig.emailConfig })
    }
  },
  async (ctx, ar, oldAppRequestStatus) => {
    // Returned back to applicant
    if ([AppRequestStatus.APPROVAL, AppRequestStatus.PREAPPROVAL].includes(oldAppRequestStatus)) {
      await ctx.svc(MailService).sendmulti({ userIds: [ar.userInternalId], templateKey: 'app_request_return', extra: appConfig.emailConfig })
    }
  }
]

export const applicationPhaseNotifications: ApplicationPhaseNotificationCB[] = [
  async (ctx, ar, application, oldPhase) => {
    if (application.phase === ApplicationPhase.REVIEW_COMPLETE) {
      await ctx.svc(MailService).sendmulti({ userIds: [ar.userInternalId], templateKey: 'application_complete', extra: { ...appConfig.emailConfig, programName: application.title } })
    if ([AppRequestStatus.APPROVAL, AppRequestStatus.REVIEW_IN_PROGRESS, AppRequestStatus.PREAPPROVAL, AppRequestStatus.REVIEW_COMPLETE].includes(oldAppRequestStatus)) {
      await ctx.svc(MailService).sendmulti({ userIds: [ar.userInternalId], templateKey: 'applicant_return', extra: appConfig.emailConfig })
    }
  }
]
