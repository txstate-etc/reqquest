import { Arg, Ctx, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql'
import { RQContext, ApplicationMetric, ApplicationMetricEntry, ApplicationMetricService, MetricApplicationFilters, ApplicationPhase, IneligiblePhases, ApplicationStatus } from '../internal.js'

@Resolver(of => ApplicationMetric)
export class ApplicationMetricResolver {
  @Query(returns => ApplicationMetric)
  async applicationMetrics (@Ctx() ctx: RQContext, @Arg('filter', type => MetricApplicationFilters, { nullable: true }) filter?: MetricApplicationFilters) {
    return await ctx.svc(ApplicationMetricService).find(filter)
  }

  @FieldResolver(returns => Number, { description: 'The count of applications started.' })
  async started (@Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return applicationMetric.entries?.filter(entry => entry.createdAt != null && (entry.phase !== ApplicationPhase.PREQUAL && entry.ineligiblePhase !== IneligiblePhases.PREQUAL)).length ?? 0
  }

  @FieldResolver(returns => Number, { description: 'The count of applications submitted.' })
  async submitted (@Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return applicationMetric.entries?.filter(entry => entry.submittedAt != null && (entry.ineligiblePhase !== IneligiblePhases.PREQUAL && entry.ineligiblePhase !== IneligiblePhases.QUALIFICATION)).length ?? 0
  }

  @FieldResolver(returns => Number, { description: 'The count of applications closed.' })
  async closed (@Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return applicationMetric.entries?.filter(entry => entry.closedAt != null && (entry.ineligiblePhase !== IneligiblePhases.PREQUAL && entry.ineligiblePhase !== IneligiblePhases.QUALIFICATION)).length ?? 0
  }

  @FieldResolver(returns => Number, { description: 'The count of applications approved.' })
  async approved (@Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return applicationMetric.entries?.filter(entry => entry.phase === ApplicationPhase.COMPLETE && entry.status === ApplicationStatus.ELIGIBLE).length ?? 0
  }

  @FieldResolver(returns => Number, { description: 'The count of applications denied.' })
  async denied (@Root() applicationMetric: ApplicationMetric): Promise<Number> {
    return applicationMetric.entries?.filter(entry => entry.phase === ApplicationPhase.COMPLETE && entry.status === ApplicationStatus.INELIGIBLE).length ?? 0
  }
}
