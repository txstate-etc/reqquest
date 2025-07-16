import { BaseService, MutationMessageType } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { DateTime } from 'luxon'
import { isBlank, someAsync } from 'txstate-utils'
import { AuthService, AppRequest, getAppRequestData, getAppRequests, AppRequestFilter, AppRequestData, submitAppRequest, restoreAppRequest, updateAppRequestData, AppRequestStatusDB, ValidatedAppRequestResponse, AppRequestStatus, appRequestMakeOffer, getAppRequestTags, closedStatuses, ApplicationRequirementService, recordAppRequestActivity, addAppRequestNote, closeAppRequest, getAppRequestActivity, AppRequestActivityFilters, PeriodService, createAppRequest, Period, appConfig, AccessUser, ReqquestUser, AccessDatabase } from '../internal.js'

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

const activityByAppReqLoader = new OneToManyLoader({
  fetch: async (appRequestInternalIds: number[], filters?: AppRequestActivityFilters) => {
    return await getAppRequestActivity({ ...filters, appRequestInternalIds })
  },
  extractKey: row => row.appRequestInternalId
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

  async getActivityForAppRequest (appRequestInternalId: number, filters?: AppRequestActivityFilters) {
    return await this.loaders.get(activityByAppReqLoader, filters).load(appRequestInternalId)
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

  async getStatusReason (appRequest: AppRequest) {
    if (appRequest.dbStatus === AppRequestStatusDB.STARTED) {
      // TODO: implement different logic for different statuses
    }
    // fallback to the first requirement with a status reason
    const requirements = await this.svc(ApplicationRequirementService).findByAppRequest(appRequest)
    return requirements.find(req => req.statusReason)?.statusReason
  }

  async recordActivity (appRequest: AppRequest, action: string, info?: { data?: any, description?: string }) {
    await recordAppRequestActivity(appRequest.internalId, this.user!.internalId, action, { ...info, impersonatedBy: this.impersonationUser?.internalId })
  }

  async getActivityForAppRequest (appRequest: AppRequest, filters?: AppRequestActivityFilters) {
    if (!this.mayViewAsReviewer(appRequest)) return []
    return await this.svc(AppRequestServiceInternal).getActivityForAppRequest(appRequest.internalId, filters)
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

  mayViewReviewerInterface () {
    return this.hasAnyControl('AppRequest', 'review')
  }

  mayViewApplicantDashboard () {
    return this.hasControl('AppRequestOwn', 'create')
  }

  mayAddNote (appRequest: AppRequest) {
    return this.mayViewAsReviewer(appRequest)
  }

  mayCreate () {
    return this.hasAnyControl('AppRequestOwn', 'create')
  }

  mayCreateOther () {
    return this.hasControl('AppRequestPreReview', 'create')
  }

  async mayCreateInPeriodForUser (period: Period, user: AccessUser | ReqquestUser) {
    return await this.reasonMayNotCreateInPeriodForUser(period, user) == null
  }

  async reasonMayNotCreateInPeriodForUser (period: Period, user: AccessUser | ReqquestUser) {
    if (!this.svc(PeriodService).acceptingAppRequests(period)) return { message: `The period ${period.name} is not currently accepting requests.`, arg: 'periodId' }
    if (!this.mayCreate() && user.login === this.login) return { message: 'You may not create a request.' }
    if (!this.mayCreateOther() && user.login !== this.login) return { message: 'You may not create requests for other people.' }
    if (!appConfig.multipleRequestsPerPeriod && 'internalId' in user) {
      const requests = await this.svc(AppRequestServiceInternal).find({ periodIds: [period.id], userInternalIds: [user.internalId] })
      if (requests.length > 0) return { message: `A request already exists in ${period.name}.`, arg: 'login' }
    }
    return undefined
  }

  async mayCreateOwnInPeriod (period: Period) {
    if (!this.user) return false
    return await this.mayCreateInPeriodForUser(period, this.user)
  }

  mayCreateOtherInPeriod (period: Period) {
    return this.mayCreateOther() && this.svc(PeriodService).acceptingAppRequests(period)
  }

  async mayCreateInPeriod (period: Period) {
    return await this.mayCreateOwnInPeriod(period) || this.mayCreateOtherInPeriod(period)
  }

  async canCreateAny () {
    const periods = await this.svc(PeriodService).findOpen()
    return await someAsync(periods, async period => await this.mayCreateInPeriod(period))
  }

  async canCreateOwn () {
    if (!this.user) return false
    const periods = await this.svc(PeriodService).findOpen()
    return await someAsync(periods, async period => await this.mayCreateInPeriodForUser(period, this.user!))
  }

  async canCreateOther () {
    const periods = await this.svc(PeriodService).findOpen()
    return await someAsync(periods, async period => await this.mayCreateOtherInPeriod(period))
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

  async create (periodId: string, login: string, validateOnly?: boolean) {
    if (!this.user) throw new Error('You must be logged in to create an app request.')
    if (login !== this.login) return await this.createOther(periodId, login, validateOnly)
    const period = await this.svc(PeriodService).findById(periodId)
    if (!period) throw new Error('Period not found')
    const response = new ValidatedAppRequestResponse({ success: true })
    const reason = await this.reasonMayNotCreateInPeriodForUser(period, this.user)
    if (reason) {
      if (reason.arg) response.addMessage(reason.message, reason.arg, MutationMessageType.error)
      else throw new Error(reason.message)
    }
    if (validateOnly || response.hasErrors()) return response
    const internalId = await createAppRequest(period.internalId, this.user!.internalId)
    this.loaders.clear()
    response.appRequest = await this.findByInternalId(internalId)
    return response
  }

  /**
   * I'm splitting this out because it's easier to think about it this way.
   *
   * When an administrator creates an app request for another user, they could be creating it
   * for someone who has never logged into our system, so we have to look them up externally.
   * Then we don't want to actually create the user record until the creation is finally being
   * committed (i.e. not validateOnly).
   */
  async createOther (periodId: string, login: string, validateOnly?: boolean) {
    const period = await this.svc(PeriodService).findById(periodId)
    const rqUser = await this.lookupUser(login)
    if (!period) throw new Error('Period not found')
    const response = new ValidatedAppRequestResponse({ success: true })
    if (!rqUser) response.addMessage('User not found.', 'login')
    else {
      const reason = await this.reasonMayNotCreateInPeriodForUser(period, rqUser)
      if (reason) {
        if (reason.arg) response.addMessage(reason.message, reason.arg, MutationMessageType.error)
        else throw new Error(reason.message)
      }
    }
    if (validateOnly || response.hasErrors()) return response
    // now that we're sure we want to create the app request, we can upsert the user
    const user = await AccessDatabase.upsertAccessUser(rqUser!)
    const internalId = await createAppRequest(period.internalId, user.internalId)
    this.loaders.clear()
    response.appRequest = await this.findByInternalId(internalId)
    return response
  }

  async submit (appRequest: AppRequest) {
    if (!this.maySubmit(appRequest)) throw new Error('You may not submit this app request.')
    const response = new ValidatedAppRequestResponse()
    if (response.hasErrors()) return response
    await submitAppRequest(appRequest.internalId)
    await this.recordActivity(appRequest, 'Submitted')
    this.loaders.clear()
    response.appRequest = (await this.findById(appRequest.id))!
    return response
  }

  async offer (appRequest: AppRequest) {
    if (!this.mayOffer(appRequest)) throw new Error('You may not make an offer on this app request.')
    const response = new ValidatedAppRequestResponse()
    if (response.hasErrors()) return response
    await appRequestMakeOffer(appRequest.internalId)
    await this.recordActivity(appRequest, 'Made Offer')
    this.loaders.clear()
    response.appRequest = (await this.findById(appRequest.id))!
    return response
  }

  async close (appRequest: AppRequest) {
    if (!this.mayClose(appRequest)) throw new Error('You may not close this app request.')
    const response = new ValidatedAppRequestResponse()
    if (response.hasErrors()) return response
    await closeAppRequest(appRequest.internalId)
    await this.recordActivity(appRequest, 'Closed')
    this.loaders.clear()
    response.appRequest = (await this.findById(appRequest.id))!
    return response
  }

  async addNote (appRequest: AppRequest, note: string, internal: boolean) {
    if (!this.mayAddNote(appRequest)) throw new Error('You may not add a note to this app request.')
    const response = new ValidatedAppRequestResponse()
    if (isBlank(note)) response.addMessage('Message is required.', 'note', MutationMessageType.error)
    if (response.hasErrors()) return response
    await addAppRequestNote(appRequest.internalId, this.user!.internalId, note, internal)
    await this.recordActivity(appRequest, 'Added Note', { description: note })
    this.loaders.clear()
    response.appRequest = (await this.findById(appRequest.id))!
    return response
  }
}
