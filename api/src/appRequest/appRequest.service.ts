import { AuthService, AppRequest, getAppRequestData, getAppRequests, AppRequestFilter, AppRequestData, submitAppRequest, restoreAppRequest, updateAppRequestData, AppRequestStatusDB, ValidatedAppRequestResponse, AppRequestStatus, appRequestMakeOffer, getAppRequestTags, closedStatuses } from '../internal.js'
import { PrimaryKeyLoader } from 'dataloader-factory'
import { BaseService } from '@txstate-mws/graphql-server'
import { DateTime } from 'luxon'

const appReqByIdLoader = new PrimaryKeyLoader({
  fetch: async (ids: string[]) => {
    return await getAppRequests({ ids })
  }
})

const appReqDataLoader = new PrimaryKeyLoader({
  fetch: async (ids: number[]) => {
    return await getAppRequestData(ids)
  }
})

const appReqTagsLoader = new PrimaryKeyLoader({
  fetch: async (appRequestIds: string[]) => {
    const tagLookup = await getAppRequestTags(appRequestIds)
    return appRequestIds.map(id => ({ id, tags: tagLookup[id] }))
  }
})

export class AppRequestServiceInternal extends BaseService<AppRequest> {
  async find (filter?: AppRequestFilter) {
    const appRequests = await getAppRequests(filter)
    const reqLoader = this.loaders.get(appReqByIdLoader)
    const tagLoader = this.loaders.get(appReqTagsLoader)
    for (const appRequest of appRequests) {
      reqLoader.prime(appRequest.id, appRequest)
      tagLoader.prime(appRequest.id, { id: appRequest.id, tags: appRequest.tags! })
    }
    return appRequests
  }

  async findById (id: string) {
    const appRequest = await this.loaders.get(appReqByIdLoader).load(id)
    if (appRequest) {
      this.loaders.get(appReqTagsLoader).prime(id, { id, tags: appRequest.tags! })
    }
    return appRequest
  }

  async findByInternalId (internalId: number) {
    return await this.findById(String(internalId))
  }

  async getData (appRequestInternalId: number) {
    const row = await this.loaders.get(appReqDataLoader).load(appRequestInternalId)
    if (!row) throw new Error('AppRequest not found')
    return row.data as AppRequestData ?? {}
  }

  async updateData (appRequest: AppRequest, data: AppRequestData) {
    await updateAppRequestData(appRequest.internalId, data)
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
    return this.removeUnauthorized(await this.raw.find(filter))
  }

  async findById (id: string) {
    return this.removeUnauthorized(await this.raw.findById(id))
  }

  async findByInternalId (internalId: number) {
    return await this.findById(String(internalId))
  }

  async getTags (appRequestId: string) {
    const { tags } = (await this.loaders.get(appReqTagsLoader).load(appRequestId))!
    return tags
  }

  async getData (appRequestInternalId: number) {
    // TODO: authorize release of the data or strike out prompt data for unauthorized prompts
    return await this.raw.getData(appRequestInternalId)
  }

  isOwn (appRequest: AppRequest) {
    return appRequest.userInternalId === this.user?.internalId
  }

  isInOpenPeriod (appRequest: AppRequest) {
    if (appRequest.periodOpensAt > DateTime.now()) return false // app request got created somehow in a future period - maybe the dates got changed?
    if (appRequest.periodArchivesAt == null) return true // no archive date means the period is still open
    return appRequest.periodArchivesAt > DateTime.now()
  }

  isClosed (appRequest: AppRequest) {
    return closedStatuses.has(appRequest.dbStatus)
  }

  mayView (appRequest: AppRequest) {
    return this.isOwn(appRequest) || this.mayViewAsReviewer(appRequest)
  }

  mayViewAsReviewer (appRequest: AppRequest) {
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'review', appRequest.tags)
  }

  mayCreate () {
    return this.hasAnyControl('AppRequestPreReview', 'create') || this.hasAnyControl('AppRequestOwn', 'create')
  }

  mayClose (appRequest: AppRequest) {
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'close', appRequest.tags)
  }

  mayCancel (appRequest: AppRequest) {
    if (!this.isOwn(appRequest)) return false
    if (appRequest.dbStatus === AppRequestStatusDB.STARTED) return this.hasControl('AppRequestOwn', 'cancel')
    if (appRequest.dbStatus === AppRequestStatusDB.SUBMITTED) return this.hasControl('AppRequestOwnReview', 'withdraw', appRequest.tags)
    return false
  }

  mayReopen (appRequest: AppRequest) {
    if (!this.isClosed(appRequest)) return false
    if (this.isInOpenPeriod(appRequest)) {
      if (this.isOwn(appRequest)) {
        if (appRequest.dbStatus === AppRequestStatusDB.CANCELLED && !this.hasControl('AppRequestOwn', 'uncancel')) return true
        if (appRequest.dbStatus === AppRequestStatusDB.WITHDRAWN && !this.hasControl('AppRequestOwnReview', 'unwithdraw', appRequest.tags)) return true
        if (!this.hasControl('AppRequest', 'review_own')) return false
      }
      if (appRequest.dbStatus === AppRequestStatusDB.CLOSED && this.hasControl('AppRequest', 'reopen', appRequest.tags)) return true
    }
    return this.hasControl('AppRequest', 'reopen_any', appRequest.tags)
  }

  maySubmit (appRequest: AppRequest) {
    if (!this.isInOpenPeriod(appRequest)) return false
    if (appRequest.status !== AppRequestStatus.READY_TO_SUBMIT) return false
    return this.isOwn(appRequest) || this.hasControl('AppRequest', 'submit', appRequest.tags)
  }

  mayReturn (appRequest: AppRequest) {
    if (appRequest.dbStatus !== AppRequestStatusDB.SUBMITTED) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'return', appRequest.tags)
  }

  mayOffer (appRequest: AppRequest) {
    if (appRequest.dbStatus !== AppRequestStatusDB.SUBMITTED) return false
    if (!this.isAcceptancePeriod(appRequest.periodId)) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'offer', appRequest.tags)
  }

  async submit (appRequest: AppRequest) {
    if (!this.maySubmit(appRequest)) throw new Error('You may not submit this app request.')
    const response = new ValidatedAppRequestResponse()
    if (response.hasErrors()) return response
    await submitAppRequest(appRequest.internalId)
    this.loaders.clear()
    response.appRequest = (await this.findById(appRequest.id))!
    return response
  }

  async offer (appRequest: AppRequest) {
    if (!this.mayOffer(appRequest)) throw new Error('You may not make an offer on this app request.')
    const response = new ValidatedAppRequestResponse()
    if (response.hasErrors()) return response
    await appRequestMakeOffer(appRequest.internalId)
    this.loaders.clear()
    response.appRequest = (await this.findById(appRequest.id))!
    return response
  }
}
