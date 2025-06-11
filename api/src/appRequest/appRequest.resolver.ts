import { sortby } from 'txstate-utils'
import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql'
import { AppRequest, Application, AppRequestService, JsonData, RQContext, ApplicationService, AppRequestFilter, promptRegistry, AppRequestActions, Period, PeriodService, RequirementPromptService, ValidatedAppRequestResponse, AppRequestIndexCategory, IndexValue, AppRequestIndexDestination, IndexCategory, RequirementPrompt, AccessUser, AccessUserService } from '../internal.js'

@Resolver(of => AppRequest)
export class AppRequestResolver {
  @Query(returns => [AppRequest])
  async appRequests (@Ctx() ctx: RQContext, @Arg('filter', { nullable: true }) filter?: AppRequestFilter) {
    return await ctx.svc(AppRequestService).find(filter)
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

  @FieldResolver(type => AppRequestActions, { description: 'Actions the user can take on this app request.' })
  actions (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return appRequest
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Update the data for a prompt in this app request.' })
  async updatePrompt (@Ctx() ctx: RQContext, @Arg('promptId', type => ID) promptId: string, @Arg('data', type => JsonData) data: any, @Arg('validateOnly', { nullable: true }) validateOnly?: boolean) {
    const prompt = await ctx.svc(RequirementPromptService).findById(promptId)
    if (!prompt) throw new Error('Prompt not found.')
    return await ctx.svc(RequirementPromptService).update(prompt, data, validateOnly)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Submit the app request.' })
  async submitAppRequest (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).submit(appRequest)
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Make an offer on the app request.' })
  async offerAppRequest (@Ctx() ctx: RQContext, @Arg('appRequestId', type => ID) appRequestId: string) {
    const appRequest = await ctx.svc(AppRequestService).findById(appRequestId)
    if (!appRequest) throw new Error('App request not found.')
    return await ctx.svc(AppRequestService).offer(appRequest)
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

  @FieldResolver(returns => Boolean, { description: 'User may make an offer on this app request.' })
  offer (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return ctx.svc(AppRequestService).mayOffer(appRequest)
  }
}
