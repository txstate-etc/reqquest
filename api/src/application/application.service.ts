import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { Application, AppRequest, AppRequestService, AuthService, getApplications } from '../internal.js'
import { BaseService } from '@txstate-mws/graphql-server'

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
}
