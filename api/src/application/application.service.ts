import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { advanceWorkflow, Application, ApplicationPhase, AppRequest, AppRequestService, appRequestTransaction, AuthService, evaluateAppRequest, getApplications, PeriodWorkflowStage, ValidatedAppRequestResponse, WorkflowStage } from '../internal.js'
import { BaseService } from '@txstate-mws/graphql-server'
import db from 'mysql2-async/db'

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
    if (application.phase === ApplicationPhase.READY_FOR_WORKFLOW) return false
    if (this.isOwn(application) && !this.hasControl('AppRequest', 'review_own')) return false
    return this.hasControl('AppRequest', 'review', application.appRequestTags)
  }

  async advanceWorkflow (applicationId: string) {
    const application = await getApplications({ ids: [applicationId] }, db)
    if (!application.length) throw new Error(`Application not found: ${applicationId}`)
    await appRequestTransaction(application[0].appRequestInternalId, async db => {
      await advanceWorkflow(application[0].id, db)
      await evaluateAppRequest(application[0].appRequestInternalId, db)
    })
    this.loaders.clear()
    const resp = new ValidatedAppRequestResponse({ success: true, messages: [] })
    resp.appRequest = await this.svc(AppRequestService).findByInternalId(application[0].appRequestInternalId)
    return resp
  }
}
