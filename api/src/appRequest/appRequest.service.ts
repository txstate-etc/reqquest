import { BaseService, MutationMessageType } from '@txstate-mws/graphql-server'
import { OneToManyLoader, PrimaryKeyLoader } from 'dataloader-factory'
import { DateTime } from 'luxon'
import { isBlank, keyby, someAsync } from 'txstate-utils'
import {
  AuthService, AppRequest, getAppRequestData, getAppRequests, AppRequestFilter, AppRequestData,
  submitAppRequest, restoreAppRequest, updateAppRequestData, AppRequestStatusDB, ValidatedAppRequestResponse,
  AppRequestStatus, appRequestMakeOffer, getAppRequestTags, ApplicationRequirementService,
  recordAppRequestActivity, closeAppRequest, getAppRequestActivity, AppRequestActivityFilters, PeriodService,
  createAppRequest, Period, appConfig, AccessUser, ReqquestUser, AccessDatabase, cancelAppRequest,
  reopenAppRequest, appRequestReturnToApplicant, acceptOffer, ApplicationService, RequirementPromptService,
  AppRequestPhase, appRequestReturnToOffer, appRequestReturnToReview, promptRegistry,
  PaginationInfoWithTotalItems, Pagination, appRequestComplete, appRequestReturnToNonBlocking
} from '../internal.js'

const phaseNames = {
  [AppRequestPhase.ACCEPTANCE]: 'offer acceptance',
  [AppRequestPhase.WORKFLOW_NONBLOCKING]: 'final workflow tasks',
  [AppRequestPhase.COMPLETE]: 'completion'
}

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
  fetch: async (appRequestInternalIds: number[], filters?: AppRequestActivityFilters & { pageInfo: PaginationInfoWithTotalItems, paged?: Pagination }) => {
    return await getAppRequestActivity({ ...filters, appRequestInternalIds }, filters?.pageInfo, filters?.paged)
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

  async findByIds (ids: string[]) {
    const appRequests = await this.loaders.loadMany(appReqByIdLoader, ids)
    for (const appRequest of appRequests) this.loaders.get(appReqTagsLoader).prime(appRequest.id, { id: appRequest.id, tags: appRequest.tags! })
    return appRequests
  }

  async findByInternalIds (internalIds: number[]) {
    return await this.findByIds(internalIds.map(id => String(id)))
  }

  async getData (appRequestInternalId: number) {
    const row = await this.loaders.get(appReqDataLoader).load(appRequestInternalId)
    if (!row) throw new Error('AppRequest not found')
    return row.data as AppRequestData ?? {}
  }

  async getActivityForAppRequest (appRequestInternalId: number, pageInfo: PaginationInfoWithTotalItems, filters?: AppRequestActivityFilters, paged?: Pagination) {
    return await this.loaders.get(activityByAppReqLoader, { ...filters, pageInfo, paged }).load(appRequestInternalId)
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

  async find (pageInfo: PaginationInfoWithTotalItems, filter?: AppRequestFilter, paged?: Pagination) {
    filter = this.preprocessFilter(filter)
    const appRequests = this.removeUnauthorized(await this.raw.find(filter))
    pageInfo.totalItems = appRequests.length
    // NOTE The categories for appRequests requests page would be populated here
    // pageInfo.categories = []
    if (paged?.page || paged?.perPage) {
      pageInfo.currentPage = paged.page ?? 1
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      pageInfo.perPage = paged?.perPage || 100 // 0 should also be overridden, so || is better than nullish coalescing ??
      pageInfo.hasNextPage = (pageInfo.totalItems ?? 0) > pageInfo.currentPage * pageInfo.perPage
      // mysql: `OFFSET ${(pageInfo.currentPage - 1) * pageInfo.perPage} LIMIT ${pageInfo.perPage}`
      const start = (pageInfo.currentPage - 1) * pageInfo.perPage
      const end = start + pageInfo.perPage
      return appRequests.slice(start, end)
    } else {
      pageInfo.currentPage = 1
      pageInfo.perPage = undefined
      pageInfo.hasNextPage = false
      return appRequests
    }
  }

  async findById (id: string) {
    return this.removeUnauthorized(await this.raw.findById(id))
  }

  async findByInternalId (internalId: number) {
    return await this.findById(String(internalId))
  }

  async findByIds (ids: string[]) {
    return this.removeUnauthorized(await this.raw.findByIds(ids))
  }

  async findByInternalIds (internalIds: number[]) {
    return await this.findByIds(internalIds.map(id => String(id)))
  }

  async getTags (appRequestId: string) {
    const { tags } = (await this.loaders.get(appReqTagsLoader).load(appRequestId))!
    return tags
  }

  async getData (appRequestInternalId: number) {
    const appRequest = await this.findByInternalId(appRequestInternalId)
    if (!appRequest) return {} as AppRequestData
    const reqPromptSvc = this.svc(RequirementPromptService)
    const [data, prompts] = await Promise.all([
      this.raw.getData(appRequestInternalId),
      // this will filter out unauthorized prompts so we can clean up the data object
      reqPromptSvc.findByAppRequest(appRequest)
    ])
    const cleanData: AppRequestData = { savedAtVersion: data.savedAtVersion }
    for (const p of prompts) {
      cleanData[p.key] = reqPromptSvc.mayViewUnredacted(p) ? data[p.key] : promptRegistry.get(p.key)?.exposeToApplicant?.(data[p.key])
    }
    return cleanData
  }

  async getStatusReason (appRequest: AppRequest) {
    if (appRequest.phase === AppRequestPhase.STARTED) {
      // TODO: implement different logic for different phases
    }
    // fallback to the first requirement with a status reason
    const requirements = await this.svc(ApplicationRequirementService).findByAppRequest(appRequest)
    return requirements.find(req => req.statusReason)?.statusReason
  }

  async recordActivity (appRequestId: number | string, action: string, info?: { data?: any, description?: string }) {
    await recordAppRequestActivity(appRequestId, this.user!.internalId, action, { ...info, impersonatedBy: this.impersonationUser?.internalId })
  }

  async getActivityForAppRequest (appRequest: AppRequest, pageInfo: PaginationInfoWithTotalItems, filters?: AppRequestActivityFilters, paged?: Pagination) {
    if (!this.mayViewAsReviewer(appRequest)) return []
    return await this.svc(AppRequestServiceInternal).getActivityForAppRequest(appRequest.internalId, pageInfo, filters, paged)
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
    return appRequest.dbStatus !== AppRequestStatusDB.OPEN
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
    if (!appConfig.multipleRequestsPerPeriod) {
      const requests = 'internalId' in user
        ? await this.svc(AppRequestServiceInternal).find({ periodIds: [period.id], userInternalIds: [user.internalId] })
        : await this.svc(AppRequestServiceInternal).find({ periodIds: [period.id], logins: [user.login] })
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
    if (this.isClosed(appRequest)) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'close', appRequest.tags)
  }

  mayCancel (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (!this.isOwn(appRequest)) return false
    if (appRequest.phase === AppRequestPhase.STARTED) return this.hasControl('AppRequestOwn', 'cancel')
    if (appRequest.phase === AppRequestPhase.SUBMITTED) return this.hasControl('AppRequestOwnReview', 'withdraw', appRequest.tags)
    return false
  }

  mayReopen (appRequest: AppRequest) {
    if (!this.isClosed(appRequest)) return false
    if (this.isInOpenPeriod(appRequest)) {
      if (this.isOwn(appRequest)) {
        if (appRequest.dbStatus === AppRequestStatusDB.CANCELLED && this.hasControl('AppRequestOwn', 'uncancel')) return true
        if (appRequest.dbStatus === AppRequestStatusDB.WITHDRAWN && this.hasControl('AppRequestOwnReview', 'unwithdraw', appRequest.tags)) return true
        if (!this.hasControl('AppRequest', 'review_own')) return false
      }
      if (this.hasControl('AppRequest', 'reopen', appRequest.tags)) return true
    }
    return this.hasControl('AppRequest', 'reopen_any', appRequest.tags)
  }

  maySubmit (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (!this.isInOpenPeriod(appRequest)) return false
    if (appRequest.status !== AppRequestStatus.READY_TO_SUBMIT) return false
    return this.isOwn(appRequest) || this.hasControl('AppRequest', 'submit', appRequest.tags)
  }

  mayReturnToApplicant (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (appRequest.phase !== AppRequestPhase.SUBMITTED) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'return', appRequest.tags)
  }

  mayCompleteReview (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (appRequest.phase !== AppRequestPhase.SUBMITTED) return false
    if (appRequest.status !== AppRequestStatus.REVIEW_COMPLETE) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'offer', appRequest.tags)
  }

  mayReturnToOffer (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (!this.isAcceptancePeriod(appRequest.periodId)) return false
    if (![AppRequestPhase.WORKFLOW_NONBLOCKING, AppRequestPhase.COMPLETE].includes(appRequest.phase)) return false
    if (appRequest.phase === AppRequestPhase.COMPLETE && this.isNonBlockingWorkflowPeriod(appRequest.periodId)) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'return', appRequest.tags)
  }

  mayReturnToReview (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (this.isAcceptancePeriod(appRequest.periodId)) return false
    if (![AppRequestPhase.COMPLETE, AppRequestPhase.WORKFLOW_NONBLOCKING, AppRequestPhase.ACCEPTANCE].includes(appRequest.phase)) return false
    // cannot skip over acceptance phase if there is one
    if ([AppRequestPhase.WORKFLOW_NONBLOCKING, AppRequestPhase.COMPLETE].includes(appRequest.phase) && this.isAcceptancePeriod(appRequest.periodId)) return false
    // cannot skip over non-blocking workflow if there is some
    if (appRequest.phase === AppRequestPhase.COMPLETE && this.isNonBlockingWorkflowPeriod(appRequest.periodId)) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'review', appRequest.tags)
  }

  mayCompleteRequest (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (appRequest.phase === AppRequestPhase.COMPLETE) return false
    // appRequest.readyToComplete is computed for us by evaluateAppRequest and includes non-blocking workflow check and applications are all ready to complete
    if (!appRequest.readyToComplete) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'review', appRequest.tags)
  }

  mayReturnToNonBlocking (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (appRequest.phase !== AppRequestPhase.COMPLETE) return false
    if (!this.isNonBlockingWorkflowPeriod(appRequest.periodId)) return false
    if (this.isOwn(appRequest) && !this.hasControl('AppRequest', 'review_own', appRequest.tags)) return false
    return this.hasControl('AppRequest', 'review', appRequest.tags)
  }

  mayAcceptOffer (appRequest: AppRequest) {
    if (this.isClosed(appRequest)) return false
    if (!this.isInOpenPeriod(appRequest)) return false
    if (appRequest.status !== AppRequestStatus.READY_TO_ACCEPT) return false
    return this.isOwn(appRequest) || this.hasControl('AppRequest', 'submit', appRequest.tags)
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
    try {
      await appConfig.hooks?.appRequestStatus?.(this.ctx, response.appRequest!, undefined)
    } catch (err) {
      console.error(err)
    }
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
    try {
      await appConfig.hooks?.appRequestStatus?.(this.ctx, response.appRequest!, undefined)
    } catch (err) {
      console.error(err)
    }
    return response
  }

  async phaseChange (appRequest: AppRequest, check: (response: ValidatedAppRequestResponse) => Promise<void>, action: (response: ValidatedAppRequestResponse) => Promise<void>, activity: string) {
    const response = new ValidatedAppRequestResponse()
    await check(response)
    if (response.hasErrors()) return response
    const beforeApps = await this.svc(ApplicationService).findByAppRequest(appRequest)
    const beforeAppsByProgramKey = keyby(beforeApps, app => app.programKey)
    await action(response)
    if (response.hasErrors()) return response
    await this.recordActivity(appRequest.internalId, activity)
    this.loaders.clear()
    response.appRequest = (await this.findById(appRequest.id))!
    try {
      await appConfig.hooks?.appRequestStatus?.(this.ctx, response.appRequest!, appRequest.status)
      const applications = await this.svc(ApplicationService).findByAppRequest(response.appRequest!)
      for (const app of applications) {
        const oldPhase = beforeAppsByProgramKey[app.programKey]?.phase
        if (app.phase !== oldPhase) await appConfig.hooks?.applicationPhase?.(this.ctx, response.appRequest!, app.programKey, oldPhase)
      }
    } catch (err) {
      console.error(err)
    }
    return response
  }

  async submit (appRequest: AppRequest) {
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.maySubmit(appRequest)) throw new Error('You may not submit this app request.')
      },
      async () => {
        await submitAppRequest(appRequest.internalId)
      },
      'Submitted request for review.'
    )
  }

  async completeReview (appRequest: AppRequest) {
    const nextPhase = this.isAcceptancePeriod(appRequest.periodId)
      ? AppRequestPhase.ACCEPTANCE
      : this.isNonBlockingWorkflowPeriod(appRequest.periodId)
        ? AppRequestPhase.WORKFLOW_NONBLOCKING
        : AppRequestPhase.COMPLETE
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayCompleteReview(appRequest)) throw new Error('You may not complete review of this app request.')
      },
      async () => {
        await appRequestMakeOffer(appRequest.internalId, nextPhase)
      },
      `Completed Review, advanced to ${phaseNames[nextPhase]}.`
    )
  }

  async returnToReview (appRequest: AppRequest) {
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayReturnToReview(appRequest)) throw new Error('You may not return this app request to the review phase.')
      },
      async () => {
        await appRequestReturnToReview(appRequest.internalId)
      },
      'Returned entire request to review phase.'
    )
  }

  async returnToOffer (appRequest: AppRequest) {
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayReturnToOffer(appRequest)) throw new Error('You may not reverse this offer.')
      },
      async () => {
        await appRequestReturnToOffer(appRequest.internalId)
      },
      'Returned request to applicant\'s offer acceptance phase.'
    )
  }

  async returnToApplicant (appRequest: AppRequest, dataVersion?: number) {
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayReturnToApplicant(appRequest)) throw new Error('You may not return this app request.')
      },
      async () => {
        await appRequestReturnToApplicant(appRequest.internalId, dataVersion)
      },
      'Returned to applicant'
    )
  }

  async acceptOffer (appRequest: AppRequest, dataVersion?: number) {
    const nextPhase = this.isNonBlockingWorkflowPeriod(appRequest.periodId)
      ? AppRequestPhase.WORKFLOW_NONBLOCKING
      : AppRequestPhase.COMPLETE

    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayAcceptOffer(appRequest)) throw new Error('You may not accept an offer on this app request.')
      },
      async () => {
        await acceptOffer(appRequest.internalId, nextPhase, dataVersion)
      },
      'Accepted'
    )
  }

  async completeRequest (appRequest: AppRequest) {
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayCompleteRequest(appRequest)) throw new Error('You may not complete this app request.')
      },
      async () => {
        await appRequestComplete(appRequest.internalId)
      },
      'Completed Request.'
    )
  }

  async returnToNonBlocking (appRequest: AppRequest) {
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayReturnToNonBlocking(appRequest)) throw new Error('You may not return this app request to non-blocking workflow.')
      },
      async () => {
        await appRequestReturnToNonBlocking(appRequest.internalId)
      },
      'Returned to non-blocking workflow phase.'
    )
  }

  async close (appRequest: AppRequest) {
    if (!this.mayClose(appRequest)) throw new Error('You may not close this app request.')
    const response = new ValidatedAppRequestResponse()
    if (response.hasErrors()) return response
    await closeAppRequest(appRequest.internalId)
    await this.recordActivity(appRequest.internalId, 'Closed')
    this.loaders.clear()
    response.appRequest = (await this.findById(appRequest.id))!
    try {
      await appConfig.hooks?.closeAppRequest?.(this.ctx, response.appRequest!)
    } catch (err) {
      console.error(err)
    }
    return response
  }

  async cancelRequest (appRequest: AppRequest, dataVersion?: number) {
    const withdrawn = appRequest.phase !== AppRequestPhase.STARTED
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayCancel(appRequest)) throw new Error('You may not cancel this app request.')
      },
      async () => {
        await cancelAppRequest(appRequest.internalId, dataVersion)
      },
      withdrawn ? 'Withdrew' : 'Cancelled'
    )
  }

  async reopen (appRequest: AppRequest) {
    return await this.phaseChange(appRequest,
      async () => {
        if (!this.mayReopen(appRequest)) throw new Error('You may not reopen this app request.')
      },
      async () => {
        await reopenAppRequest(appRequest.internalId)
      },
      'Reopened'
    )
  }
}
