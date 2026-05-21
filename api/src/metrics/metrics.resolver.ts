import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { RQContext, ApplicationMetric, ApplicationMetricService, MetricRequestFilters } from '../internal.js'

@Resolver(of => ApplicationMetric)
export class ApplicationMetricResolver {
  @Query(returns => [ApplicationMetric])
  async applicationMetrics (@Ctx() ctx: RQContext, @Arg('filter', type => MetricRequestFilters, { nullable: true }) filter?: MetricRequestFilters) {
    return await ctx.svc(ApplicationMetricService).find()
  }
}