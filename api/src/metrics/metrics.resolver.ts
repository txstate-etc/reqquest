import { Arg, Ctx, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql'
import { RQContext, ApplicationMetric, ApplicationMetricEntry, ApplicationMetricService, MetricApplicationFilters, ApplicationPhase, IneligiblePhases, ApplicationStatus, ApplicationMetricTiming } from '../internal.js'

@Resolver(of => ApplicationMetric)
export class ApplicationMetricResolver {
  @Query(returns => ApplicationMetric)
  async applicationMetrics (@Ctx() ctx: RQContext, @Arg('filter', type => MetricApplicationFilters, { nullable: true }) filter?: MetricApplicationFilters) {
    return await ctx.svc(ApplicationMetricService).find(filter)
  }

  @FieldResolver(returns => Number, { description: 'The count of applications started.' })
  async started (@Ctx() ctx: RQContext, @Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return (await ctx.svc(ApplicationMetricService).getStarted(applicationMetric)).length
  }

  @FieldResolver(returns => Number, { description: 'The count of applications submitted.' })
  async submitted (@Ctx() ctx: RQContext, @Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return (await ctx.svc(ApplicationMetricService).getSubmitted(applicationMetric)).length
  }

  @FieldResolver(returns => Number, { description: 'The count of applications closed.' })
  async closed (@Ctx() ctx: RQContext, @Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return (await ctx.svc(ApplicationMetricService).getClosed(applicationMetric)).length
  }

  @FieldResolver(returns => Number, { description: 'The count of applications approved.' })
  async approved (@Ctx() ctx: RQContext, @Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return (await ctx.svc(ApplicationMetricService).getApproved(applicationMetric)).length
  }

  @FieldResolver(returns => Number, { description: 'The count of applications denied.' })
  async denied (@Ctx() ctx: RQContext, @Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return (await ctx.svc(ApplicationMetricService).getDenied(applicationMetric)).length
  }

  @FieldResolver(returns => ApplicationMetricTiming, { description: 'Timings (seconds), for applications from started to submitted.' })
  async toSubmit (@Ctx() ctx: RQContext, @Root() applicationMetric: ApplicationMetric): Promise<ApplicationMetricTiming> {
    return await ctx.svc(ApplicationMetricService).getSubmissionTimings(applicationMetric)
  }

  @FieldResolver(returns => ApplicationMetricTiming, { description: 'Timings (seconds), for applications from submitted to completed.' })
  async toDecision (@Ctx() ctx: RQContext, @Root() applicationMetric: ApplicationMetric): Promise<ApplicationMetricTiming> {
    return await ctx.svc(ApplicationMetricService).getDecisionTimings(applicationMetric)
  }
}
