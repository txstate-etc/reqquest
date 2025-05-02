import { AuthService, AppRequest, getAppRequestData, getAppRequests, AppRequestFilter, AppRequestData, submitAppRequest, restoreAppRequest, updateAppRequestData, evaluateAppRequest, AppRequestStatusDB } from '../internal.js'
import { PrimaryKeyLoader } from 'dataloader-factory'
import { BaseService } from '@txstate-mws/graphql-server'

const appReqByInternalIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return await getAppRequests({ ids })
  }
})

const appReqDataLoader = new PrimaryKeyLoader({
  fetch: async (ids: number[]) => {
    return await getAppRequestData(ids)
  }
})

export class AppRequestServiceInternal extends BaseService<AppRequest> {
  async getData (appRequestInternalId: number) {
    const row = await this.loaders.get(appReqDataLoader).load(appRequestInternalId)
    if (!row) throw new Error('AppRequest not found')
    return row.data as AppRequestData
  }

  async updateData (appRequest: AppRequest, data: AppRequestData) {
    await updateAppRequestData(appRequest.internalId, data)
  }

  async submit (appRequest: AppRequest) {
    await submitAppRequest(appRequest.internalId)
  }

  async restore (appRequest: AppRequest) {
    await restoreAppRequest(appRequest.internalId)
  }
}

export class AppRequestService extends AuthService<AppRequest> {
  protected raw = this.svc(AppRequestServiceInternal)

  preprocessFilter (filter?: AppRequestFilter) {
    filter ??= {}
    if (filter.own) filter.userInternalIds = [this.user?.internalId ?? -1]
    return filter
  }

  async find (filter?: AppRequestFilter) {
    filter = this.preprocessFilter(filter)
    return this.removeUnauthorized(await getAppRequests(filter))
  }

  async findByInternalId (internalId: number) {
    return await this.loaders.get(appReqByInternalIdLoader).load(String(internalId))
  }

  async getData (appRequestInternalId: number) {
    // TODO: authorize release of the data or strike out prompt data for unauthorized prompts
    return await this.raw.getData(appRequestInternalId)
  }

  isOwn (appRequest: AppRequest) {
    return appRequest.userInternalId === this.user?.internalId
  }

  mayView (appRequest: AppRequest) {
    return this.isOwn(appRequest) || this.mayViewAsReviewer(appRequest)
  }

  mayViewAsReviewer (appRequest: AppRequest) {
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own')) return false
    return this.hasControl('AppRequest', 'review', appRequest.id, appRequest.tags)
  }

  mayCreate () {
    return this.hasControl('AppRequest', 'create') || this.hasControl('AppRequest', 'create_own')
  }

  mayClose (appRequest: AppRequest) {
    return this.hasControl('AppRequest', 'close', appRequest.id, []) || this.hasControl('AppRequest', 'close_own')
  }

  mayCancel (appRequest: AppRequest) {
    if (!this.isOwn(appRequest)) return false
    if (appRequest.dbStatus === AppRequestStatusDB.SUBMITTED) return this.hasControl('AppRequest', 'cancel_review')
    if (appRequest.dbStatus === AppRequestStatusDB.STARTED) return this.hasControl('AppRequest', 'cancel')
    return false
  }

  mayReopen (appRequest: AppRequest) {
    // TODO: check if the appRequest is in a valid period
    if ([AppRequestStatusDB.CANCELLED, AppRequestStatusDB.WITHDRAWN].includes(appRequest.dbStatus)) {
      return (this.isOwn(appRequest) && this.hasControl('AppRequest', 'reopen_own', appRequest.id, appRequest.tags)) || this.hasControl('AppRequest', 'reopen', appRequest.id, appRequest.tags)
    }
    if (appRequest.dbStatus === AppRequestStatusDB.CLOSED) {
      return this.hasControl('AppRequest', 'reopen', appRequest.id, appRequest.tags)
    }
    return false
  }

  maySubmit (appRequest: AppRequest) {
    if (!appRequest.submitEligible || appRequest.dbStatus !== AppRequestStatusDB.STARTED) return false
    return (
      this.isOwn(appRequest) && this.hasControl('AppRequest', 'submit_own', appRequest.id, appRequest.tags)
    ) || this.hasControl('AppRequest', 'submit', appRequest.id, appRequest.tags)
  }

  mayReturn (appRequest: AppRequest) {
    if (appRequest.dbStatus !== AppRequestStatusDB.SUBMITTED) return false
    return (
      this.isOwn(appRequest) && this.hasControl('AppRequest', 'return_own', appRequest.id, appRequest.tags)
    ) || this.hasControl('AppRequest', 'return', appRequest.id, appRequest.tags)
  }
}
