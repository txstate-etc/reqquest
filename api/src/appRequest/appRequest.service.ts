import { AuthService, AppRequest, getAppRequestData, getAppRequests, AppRequestFilter, AppRequestData, submitAppRequest, restoreAppRequest, updateAppRequestData, evaluateAppRequest, AppRequestStatusDB, ValidatedAppRequestResponse, AppRequestStatus, appRequestMakeOffer, getAppRequestTags } from '../internal.js'
import { ManyJoinedLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { BaseService } from '@txstate-mws/graphql-server'

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
    return await this.loaders.get(appReqByIdLoader).load(id)
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

  mayView (appRequest: AppRequest) {
    return this.isOwn(appRequest) || this.mayViewAsReviewer(appRequest)
  }

  mayViewAsReviewer (appRequest: AppRequest) {
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'review', appRequest.tags)
  }

  mayCreate () {
    return this.hasAnyControl('AppRequest', 'create') || this.hasAnyControl('AppRequest', 'create_own')
  }

  mayClose (appRequest: AppRequest) {
    return this.hasControl('AppRequest', 'close', appRequest.tags) || this.hasControl('AppRequest', 'close_own')
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
      return (this.isOwn(appRequest) && this.hasControl('AppRequest', 'reopen_own', appRequest.tags)) || this.hasControl('AppRequest', 'reopen', appRequest.tags)
    }
    if (appRequest.dbStatus === AppRequestStatusDB.CLOSED) {
      return this.hasControl('AppRequest', 'reopen', appRequest.tags)
    }
    return false
  }

  maySubmit (appRequest: AppRequest) {
    if (appRequest.status !== AppRequestStatus.READY_TO_SUBMIT) return false
    return (
      this.isOwn(appRequest) && this.hasControl('AppRequest', 'submit_own', appRequest.tags)
    ) || this.hasControl('AppRequest', 'submit', appRequest.tags)
  }

  mayReturn (appRequest: AppRequest) {
    if (appRequest.dbStatus !== AppRequestStatusDB.SUBMITTED) return false
    return (
      this.isOwn(appRequest) && this.hasControl('AppRequest', 'return_own', appRequest.tags)
    ) || this.hasControl('AppRequest', 'return', appRequest.tags)
  }

  mayOffer (appRequest: AppRequest) {
    if (appRequest.dbStatus !== AppRequestStatusDB.SUBMITTED) return false
    // TODO: check if there are any ACCEPTANCE requirements
    return (
      this.isOwn(appRequest) && this.hasControl('AppRequest', 'offer_own', appRequest.tags)
    ) || this.hasControl('AppRequest', 'offer', appRequest.tags)
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
