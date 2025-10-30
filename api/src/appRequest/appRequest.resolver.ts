import { sortby } from 'txstate-utils'
import { Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root } from 'type-graphql'
import { AppRequest, Application, AppRequestService, JsonData, RQContext, ApplicationService, AppRequestFilter, promptRegistry, AppRequestActions, Period, PeriodService, RequirementPromptService, ValidatedAppRequestResponse, AppRequestIndexCategory, IndexValue, AppRequestIndexDestination, IndexCategory, RequirementPrompt, AccessUser, AccessUserService, AppRequestActivity, AppRequestActivityFilters, Pagination, PaginationInfoWithTotalItems } from '../internal.js'

@Resolver(of => AppRequest)
export class AppRequestResolver {
  @Query(returns => [AppRequest])
  async appRequests (@Ctx() ctx: RQContext, @Arg('filter', { nullable: true }) filter?: AppRequestFilter, @Arg('paged', { nullable: true }) paged?: Pagination) {
    return await ctx.executePaginated('appRequests', paged, new PaginationInfoWithTotalItems(), async pageInfo => {
      return await ctx.svc(AppRequestService).find(pageInfo, filter, paged)
    })
  }

  @Query(returns => [IndexCategory])
  async appRequestIndexes (@Ctx() ctx: RQContext, @Arg('categories', type => [String], { nullable: true }) categories?: string[], @Arg('for', type => AppRequestIndexDestination, { nullable: true, description: 'Returns indexes that are flagged to appear in this destination. Also sorts for this destination.' }) forDestination: AppRequestIndexDestination = AppRequestIndexDestination.LIST_FILTERS) {
    const cats = (categories?.length ? categories.map(c => promptRegistry.indexCategoryMap[c]) : promptRegistry.indexCategories).map(category => new IndexCategory(category))
    return forDestination
      ? sortby(cats.filter(cat => cat[forDestination] > 0), forDestination, true)
      : cats
  }

  @FieldResolver(type => AccessUser)
  async applicant (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    const user = await ctx.svc(AccessUserService).findByInternalId(appRequest.userInternalId)
    if (!user) throw new Error('Applicant not found.')
    return user
  }

  @FieldResolver(type => [Application])
  async applications (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return await ctx.svc(ApplicationService).findByAppRequest(appRequest)
  }

  @FieldResolver(type => RequirementPrompt, { description: 'Retrieve a specific prompt by its ID. This is useful for the UI to get the full prompt data and configuration when trying to edit an individual prompt. We don\'t want to be downloading all the config data for everything up front.' })
  async prompt (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest, @Arg('promptId', type => ID) promptId: string) {
    const prompt = await ctx.svc(RequirementPromptService).findById(promptId)
    if (!prompt) throw new Error('Prompt not found.')
    return prompt
  }

  @FieldResolver(type => JsonData, { description: 'All data that has been gathered from the user for this request. It is a Record whose properties are the prompt keys and values are the data gathered by the corresponding prompt dialog.' })
  async data (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest, @Arg('schemaVersion', { nullable: true, description: 'Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh.' }) savedAtVersion?: string) {
    if (savedAtVersion && savedAtVersion < promptRegistry.latestMigration()) throw new Error('Client is out of date. Please refresh.')
    return await ctx.svc(AppRequestService).getData(appRequest.internalId)
  }

  @FieldResolver(type => [AppRequestIndexCategory], { description: 'Indexes associated with the App Request. These are pieces of data extracted from the App Request by individual prompts in the ReqQuest project. They have several uses such as filtering App Requests and enriching list views.' })
  async indexCategories (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest, @Arg('for', type => AppRequestIndexDestination, { nullable: true, description: 'Returns indexes that are flagged to appear in this destination. Also sorts for this destination.' }) forDestination?: AppRequestIndexDestination) {
    const cats = promptRegistry.indexCategories.map(category => new AppRequestIndexCategory(category, appRequest.tags?.[category.category] ?? []))
    return forDestination
      ? sortby(cats.filter(cat => cat[forDestination] > 0), forDestination, true)
      : cats
  }

  @FieldResolver(type => Period, { description: 'The period this appRequest is associated with.' })
  async period (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    const period = await ctx.svc(PeriodService).findById(appRequest.periodId)
    if (!period) throw new Error('Somehow the period is missing for this appRequest.')
    return period
  }

  @FieldResolver(type => String, { nullable: true, description: 'The most pertinent status reason for this app request. The logic is complicated and depends on the AppRequest\'s status.' })
  async statusReason (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return await ctx.svc(AppRequestService).getStatusReason(appRequest)
  }

  @FieldResolver(type => [AppRequestActivity], { description: 'The activity log for this app request. This is a list of actions taken on the app request, such as submission, updating prompts, make an offer, add a note, etc. It will be sorted by the date of the activity in descending order.' })
  async activity (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest, @Arg('filters', type => AppRequestActivityFilters, { nullable: true, description: 'Filters to apply to the activity log. This can be used to filter by action type, date range, etc.' }) filters?: AppRequestActivityFilters) {
    return await ctx.svc(AppRequestService).getActivityForAppRequest(appRequest, filters)
  }

  @FieldResolver(type => AppRequestActions, { description: 'Actions the user can take on this app request.' })
  actions (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return appRequest
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Update the data for a prompt in this app request.' })
  async updatePrompt (@Ctx() ctx: RQContext, @Arg('promptId', type => ID) promptId: string, @Arg('data', type => JsonData) data: any, @Arg('validateOnly', { nullable: true }) validateOnly?: boolean, @Arg('dataVersion', type => Int, { nullable: true, description: 'The data version of the app request at the time this prompt was loaded. If provided, the API will perform an optimistic concurrency check and fail the update if someone else has updated the data in the meantime.' }) dataVersion?: number) {
    const prompt = await ctx.svc(RequirementPromptService).findById(promptId)
    if (!prompt) throw new Error('Prompt not found.')
    return await ctx.svc(RequirementPromptService).update(prompt, data, validateOnly, dataVersion)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Create a new app request.' })
  async createAppRequest (@Ctx() ctx: RQContext, @Arg('periodId', type => ID) periodId: string, @Arg('login', type => String) login: string, @Arg('validateOnly', { nullable: true }) validateOnly?: boolean) {
    return await ctx.svc(AppRequestService).create(periodId, login, validateOnly)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Submit the app request.' })
  async submitAppRequest (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).submit(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Make an offer on the app request. If all applications are ineligible, or if there are no acceptance requirements, the applications will advance to the non-blocking workflow, or absent that, be marked complete.' })
  async offerAppRequest (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).offer(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Cancel or withdraw the app request, depending on its current phase. This is only available if the app request is in a cancellable state.' })
  async cancelAppRequest (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string, @Arg('dataVersion', type => Int, { nullable: true, description: 'If the user is currently viewing some of the app request details, include the dataVersion here to make the cancellation fail when the app request has been updated by another user.' }) dataVersion?: number) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).cancelRequest(appRequest, dataVersion)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Reopen the app request. This is only available if the app request is in a state that allows reopening.' })
  async reopenAppRequest (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).reopen(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Return the app request to the applicant phase. This is only available if the app request is in a state that allows returning.' })
  async returnAppRequest (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).returnToApplicant(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'This is for the applicant to accept or reject the offer that was made based on their app request. The difference between accept and reject is determined by the status of the acceptance requirements. They will still "accept offer" after they answer that they do not want the offer. If there is non-blocking workflow on any applications, the first one in each will begin. Applications without non-blocking workflow will be advanced to the COMPLETE phase. If all applications are complete, the app request will be closed.' })
  async acceptOffer (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).acceptOffer(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Return the app request to the review phase from non-blocking workflow or completion. This does not cover reclaiming an offer - see reverseOffer for that. It also does not cover returning from review to acceptance - see returnToReview for that.' })
  async returnToReview (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).returnToReview(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Return the app request to the acceptance phase from non-blocking workflow or completion.' })
  async returnToOffer (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).returnToOffer(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Withdraw the offer and return the app request to the review phase for changes.' })
  async reverseOffer (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).reverseOffer(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Close the app request. Generally this is always available and will freeze the request/applications in their current phase/status.' })
  async closeAppRequest (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).close(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Add a note to the app request.' })
  addNote (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest, @Arg('content', type => String) content: string, @Arg('internal', { description: 'If true, the note will be marked as internal and only visible to reviewers.' }) internal: boolean) {
    return ctx.svc(AppRequestService).addNote(appRequest, content, internal)
  }
}

@Resolver(of => AppRequestIndexCategory)
export class AppRequestIndexCategoryResolver {
  @FieldResolver(type => [IndexValue])
  async values (@Ctx() ctx: RQContext, @Root() tagCategory: AppRequestIndexCategory) {
    return await Promise.all(tagCategory.tagStrings.map(async tag => new IndexValue(tag, await promptRegistry.getTagLabel(tagCategory.category, tag))))
  }
}

@Resolver(of => IndexCategory)
export class IndexCategoryResolver {
  @FieldResolver(type => [IndexValue])
  async values (@Ctx() ctx: RQContext, @Root() tagCategory: IndexCategory, @Arg('search', { nullable: true }) search?: string, @Arg('inUse', { nullable: true, description: 'If true, only return tags that are currently in use by app requests. This is useful for only presenting useful filters.' }) inUse?: boolean) {
    return (await promptRegistry.getAllTags(tagCategory.category, search, inUse)).map(tag => new IndexValue(tag.value, tag.label)) ?? []
  }
}

@Resolver(of => AppRequestActions)
export class AppRequestAccessResolver {
  @FieldResolver(returns => Boolean, { description: 'Whether the user can view this app request as a reviewer.' })
  review (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayViewAsReviewer(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may close this app request as a reviewer/admin. Separate from cancelling as the app request owner.' })
  close (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayClose(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may cancel this app request as the owner. Separate from closing as a reviewer/admin.' })
  cancel (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayCancel(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may reopen this app request, whether as the owner or as a reviewer/admin.' })
  reopen (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayReopen(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may submit this app request either as or on behalf of the owner.' })
  submit (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).maySubmit(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may return this app request to the applicant phase.' })
  return (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayReturn(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may make an offer on this app request. Sends the app request to the acceptance phase.' })
  offer (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayOffer(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may finalize the acceptance or denial of the offer. Sends the app request to non-blocking workflow (or completion).' })
  accept (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayAccept(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may withdraw the offer and return the app request to the review phase for changes.' })
  reverseOffer (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayReverseOffer(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may return the app request to the acceptance phase from non-blocking workflow or completion.' })
  returnToOffer (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayReturnToOffer(appRequest)
  }

  @FieldResolver(returns => Boolean, { description: 'User may return the app request to the review phase from non-blocking workflow or completion. This does not cover reclaiming an offer - see reverseOffer for that. It also does not cover returning from completion to acceptance - see returnToOffer for that.' })
  returnToReview (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayReturnToReview(appRequest)
  }
}

@Resolver(of => AppRequestActivity)
export class AppRequestActivityResolver {
  @FieldResolver(type => AccessUser, { description: 'The user that performed the activity.' })
  async user (@Ctx() ctx: RQContext, @Root() activity: AppRequestActivity) {
    const user = await ctx.svc(AccessUserService).findByInternalId(activity.userInternalId)
    return user!
  }

  @FieldResolver(type => AccessUser, { nullable: true, description: 'If this activity was performed by an impersonated user, this will be the user that did the impersonation.' })
  async impersonatedBy (@Ctx() ctx: RQContext, @Root() activity: AppRequestActivity) {
    if (!activity.impersonatedBy) return undefined
    const user = await ctx.svc(AccessUserService).findByInternalId(activity.impersonatedBy)
    return user!
  }

  @FieldResolver(type => AppRequest, { description: 'The app request this activity is associated with.' })
  async appRequest (@Ctx() ctx: RQContext, @Root() activity: AppRequestActivity) {
    const appRequest = await ctx.svc(AppRequestService).findByInternalId(activity.appRequestInternalId)
    return appRequest!
  }
}
