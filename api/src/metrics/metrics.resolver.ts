import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { RQContext, ApplicationMetric, ApplicationMetricService, MetricApplicationFilters } from '../internal.js'

@Resolver(of => ApplicationMetric)
export class ApplicationMetricResolver {
  @Query(returns => [ApplicationMetric])
  async applicationMetrics (@Ctx() ctx: RQContext, @Arg('filter', type => MetricApplicationFilters, { nullable: true }) filter?: MetricApplicationFilters) {
    return await ctx.svc(ApplicationMetricService).find(filter)
  }
}
