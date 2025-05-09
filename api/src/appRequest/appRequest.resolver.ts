import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql'
import { AppRequest, Application, AppRequestService, JsonData, RQContext, ApplicationService, AppRequestFilter, promptRegistry, AppRequestActions, Period, PeriodService, RequirementPromptService, ValidatedAppRequestResponse } from '../internal.js'

@Resolver(of => AppRequest)
export class AppRequestResolver {
  @Query(returns => [AppRequest])
  async appRequests (@Ctx() ctx: RQContext, @Arg('filter', { nullable: true }) filter?: AppRequestFilter) {
    return await ctx.svc(AppRequestService).find(filter)
  }

  @FieldResolver(type => [Application])
  async applications (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    return await ctx.svc(ApplicationService).findByAppRequest(appRequest)
  }

  @FieldResolver(type => JsonData, { description: 'All data that has been gathered from the user for this request. It is a Record whose properties are the prompt keys and values are the data gathered by the corresponding prompt dialog.' })
  async data (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest, @Arg('schemaVersion', { nullable: true, description: 'Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh.' }) savedAtVersion?: string) {
    if (savedAtVersion && savedAtVersion < promptRegistry.latestMigration()) throw new Error('Client is out of date. Please refresh.')
    return await ctx.svc(AppRequestService).getData(appRequest.internalId)
  }

  @FieldResolver(type => Period, { description: 'The period this appRequest is associated with.' })
  async period (@Ctx() ctx: RQContext, @Root() appRequest: AppRequest) {
    const period = await ctx.svc(PeriodService).findById(appRequest.periodId)
    if (!period) throw new Error('Somehow the period is missing for this appRequest.')
    return period
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
}
