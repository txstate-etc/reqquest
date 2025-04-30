import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { Application, ApplicationStatus, AuthService, getApplications } from '../internal.js'
import { UnimplementedError } from '@txstate-mws/graphql-server'

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

export class ApplicationService extends AuthService<Application> {
  async findByInternalId (internalId: number) {
    return await this.loaders.get(appByInternalIdLoader).load(String(internalId))
  }

  async findByAppRequestId (appRequestId: string) {
    return this.removeUnauthorized(await this.loaders.get(byAppRequestId).load(appRequestId))
  }

  async findByAppRequestInternalId (appRequestInternalId: number) {
    return await this.findByAppRequestId(String(appRequestInternalId))
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
    return this.hasControl('AppRequest', 'review', application.appRequestId, [])
      && this.hasControl('Program', 'view', application.programKey, [])
  }
}
