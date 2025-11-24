import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { advanceWorkflow, appConfig, Application, ApplicationPhase, AppRequest, AppRequestPhase, AppRequestService, AppRequestStatusDB, appRequestTransaction, AuthService, evaluateAppRequest, getApplications, PeriodWorkflowStage, programRegistry, ProgramService, reverseWorkflow, ValidatedAppRequestResponse, WorkflowStage } from '../internal.js'
import { BaseService } from '@txstate-mws/graphql-server'
import db from 'mysql2-async/db'
import { get } from 'http'

const appByInternalIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return await getApplications({ ids })
  }
})

const byAppRequestId = new OneToManyLoader({
  fetch: async (appRequestIds: string[]) => {
    return await getApplications({ appRequestIds })
  },
  extractKey: (app: Application) => app.appRequestId,
  idLoader: appByInternalIdLoader
})

export class ApplicationServiceInternal extends BaseService<Application> {
  async findByInternalId (internalId: number, appRequestTags?: Record<string, string[]>) {
    const application = await this.loaders.get(appByInternalIdLoader).load(String(internalId))
    application!.appRequestTags = appRequestTags ?? await this.svc(AppRequestService).getTags(application!.appRequestId)
    return application
  }

  async findByAppRequest (appRequest: AppRequest) {
    const applications = await this.loaders.get(byAppRequestId).load(appRequest.id)
    for (const application of applications) application.appRequestTags = appRequest.tags
    return applications
  }
}

export class ApplicationService extends AuthService<Application> {
  raw = this.svc(ApplicationServiceInternal)

  async findByInternalId (internalId: number, appRequestTags?: Record<string, string[]>) {
    return this.removeUnauthorized(await this.raw.findByInternalId(internalId, appRequestTags))
  }

  async findByAppRequest (appRequest: AppRequest) {
    return this.removeUnauthorized(await this.raw.findByAppRequest(appRequest))
  }

  async getNextWorkflowStage (application: Application) {
    if (!this.mayAdvanceWorkflow(application)) return null
    const blocking = application.appRequestPhase !== AppRequestPhase.WORKFLOW_NONBLOCKING
    const stages = await this.svc(ProgramService).findWorkflowStagesByPeriodIdAndProgramKey(application.periodId, application.programKey, { hasEnabledRequirements: true, blocking })
    if (!application.workflowStageKey) return stages[0]
    const currentIndex = stages.findIndex(s => s.key === application.workflowStageKey)
    if (currentIndex === -1 || currentIndex + 1 >= stages.length) return null
    return stages[currentIndex + 1]
  }

  async getPreviousWorkflowStage (application: Application) {
    if (!await this.mayReverseWorkflow(application)) return null
    const blocking = application.appRequestPhase !== AppRequestPhase.WORKFLOW_NONBLOCKING
    const stages = await this.svc(ProgramService).findWorkflowStagesByPeriodIdAndProgramKey(application.periodId, application.programKey, { hasEnabledRequirements: true, blocking })
    if (!application.workflowStageKey) return null
    const currentIndex = stages.findIndex(s => s.key === application.workflowStageKey)
    if (currentIndex > 0) {
      return stages[currentIndex - 1]
    }
    return null
  }

  isOwn (application: Application) {
    return application.userInternalId === this.user?.internalId
  }

  mayView (application: Application) {
    if (this.isOwn(application)) return true
    return this.mayViewAsReviewer(application)
  }

  mayViewAsReviewer (application: Application) {
    if (this.isOwn(application) && !this.hasControl('AppRequest', 'review_own')) return false
    return this.hasControl('Application', 'view', application.authorizationKeys)
  }

  mayAdvanceWorkflow (application: Application) {
    // any reviewer can advance the workflow if the requirements have been met, we already
    // control who can answer the prompts so I don't think it's necessary to lock down
    // the advancement
    if (application.closed) return false
    if (application.phase !== ApplicationPhase.READY_FOR_WORKFLOW) return false
    if (this.isOwn(application) && !this.hasControl('AppRequest', 'review_own')) return false
    return this.hasControl('AppRequest', 'review', application.appRequestTags)
  }

  async mayReverseWorkflow (application: Application) {
    if (application.closed) return false
    if (![ApplicationPhase.WORKFLOW_BLOCKING, ApplicationPhase.REVIEW_COMPLETE, ApplicationPhase.COMPLETE, ApplicationPhase.WORKFLOW_NONBLOCKING].includes(application.phase)) return false
    if (this.isOwn(application) && !this.hasControl('AppRequest', 'review_own')) return false
    if (!this.hasControl('AppRequest', 'review', application.appRequestTags)) return false
    if (application.appRequestPhase === AppRequestPhase.SUBMITTED) return true

    const stages = await this.svc(ProgramService).findWorkflowStagesByPeriodIdAndProgramKey(application.periodId, application.programKey, { hasEnabledRequirements: true, blocking: false })
    if (application.phase === ApplicationPhase.WORKFLOW_NONBLOCKING && stages[0]?.key === application.workflowStageKey) {
      // can't reverse from the first non-blocking stage
      return false
    }

    return true
  }

  async advanceWorkflow (applicationId: string) {
    const [application] = await getApplications({ ids: [applicationId] })
    if (!application) throw new Error(`Application not found: ${applicationId}`)
    if (!this.mayAdvanceWorkflow(application)) throw new Error('You may not advance this application to the next stage.')
    await appRequestTransaction(application.appRequestInternalId, async db => {
      await advanceWorkflow(application.id, db)
      await evaluateAppRequest(application.appRequestInternalId, db)
    })
    this.loaders.clear()
    const resp = new ValidatedAppRequestResponse({ success: true, messages: [] })
    resp.appRequest = await this.svc(AppRequestService).findByInternalId(application.appRequestInternalId)
    const newApplication = (await this.findByInternalId(application.internalId))!
    await this.svc(AppRequestService).recordActivity(resp.appRequest!, `Advanced application workflow from ${programRegistry.getWorkflowStageByKey(application.workflowStageKey)?.title ?? 'review'} to ${programRegistry.getWorkflowStageByKey(newApplication.workflowStageKey)?.title ?? (newApplication.appRequestPhase === AppRequestPhase.SUBMITTED ? 'review complete' : 'completion')}.`)
    if (resp.appRequest?.status !== application.appRequestComputedStatus) await appConfig.hooks?.appRequestStatus?.(this.ctx, resp.appRequest!, application.appRequestComputedStatus)
    if (application.phase !== newApplication.phase) await appConfig.hooks?.applicationPhase?.(this.ctx, resp.appRequest!, newApplication.programKey, application.phase)
    return resp
  }

  /**
   * Move the application back to a previous workflow stage or back into review
   *
   * @param applicationId The application to move back
   * @param stage The stage to move back to, if not provided the application will be moved back into review
   */
  async reverseWorkflow (applicationId: string, stage?: number) {
    const [application] = await getApplications({ ids: [applicationId] })
    if (!application) throw new Error(`Application not found: ${applicationId}`)
    if (!await this.mayReverseWorkflow(application)) throw new Error('You may not reverse this application to a previous stage.')
    await appRequestTransaction(application.appRequestInternalId, async db => {
      await reverseWorkflow(application.id, db)
      await evaluateAppRequest(application.appRequestInternalId, db)
    })
    this.loaders.clear()
    const resp = new ValidatedAppRequestResponse({ success: true, messages: [] })
    resp.appRequest = await this.svc(AppRequestService).findByInternalId(application.appRequestInternalId)
    const newApplication = (await this.findByInternalId(application.internalId))!
    await this.svc(AppRequestService).recordActivity(resp.appRequest!, `Reversed application workflow from ${programRegistry.getWorkflowStageByKey(application.workflowStageKey)?.title ?? (application.appRequestPhase === AppRequestPhase.SUBMITTED ? 'review complete' : 'completion')} to ${programRegistry.getWorkflowStageByKey(newApplication.workflowStageKey)?.title ?? 'review'}.`)
    if (resp.appRequest?.status !== application.appRequestComputedStatus) await appConfig.hooks?.appRequestStatus?.(this.ctx, resp.appRequest!, application.appRequestComputedStatus)
    if (application.phase !== newApplication.phase) await appConfig.hooks?.applicationPhase?.(this.ctx, resp.appRequest!, newApplication.programKey, application.phase)
    return resp
  }
}
