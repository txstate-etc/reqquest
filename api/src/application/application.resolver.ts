import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql'
import { ApplicationActions, Application, RQContext, ApplicationRequirementService, ApplicationRequirement, ApplicationService } from '../internal.js'

@Resolver(of => Application)
export class ApplicationResolver {
  @FieldResolver(returns => [ApplicationRequirement])
  async requirements (@Ctx() ctx: RQContext, @Root() application: Application) {
    return await ctx.svc(ApplicationRequirementService).findByApplication(application)
  }

  @FieldResolver(returns => ApplicationActions)
  actions (@Root() application: Application) {
    return application
  }
}

@Resolver(of => ApplicationActions)
export class ApplicationActionsResolver {
  @FieldResolver(returns => Boolean)
  viewAsReviewer (@Ctx() ctx: RQContext, @Root() application: Application) {
    return ctx.svc(ApplicationService).mayViewAsReviewer(application)
  }
}
