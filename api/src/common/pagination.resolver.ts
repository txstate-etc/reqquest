import { Ctx, FieldResolver, Query, Resolver } from 'type-graphql'
import { PaginationInfoWithTotalItems, PaginationResponse, RQContext } from '../internal.js'

@Resolver(of => PaginationResponse)
export class PaginationResolver {
  @Query(returns => PaginationResponse)
  pageInfo () {
    return new PaginationResponse()
  }

  @FieldResolver(returns => PaginationInfoWithTotalItems, { nullable: true })
  async accessUsers (@Ctx() ctx: RQContext) {
    return await ctx.getPaginationInfo('accessUsers')
  }

  @FieldResolver(returns => PaginationInfoWithTotalItems, { nullable: true })
  async appRequests (@Ctx() ctx: RQContext) {
    return await ctx.getPaginationInfo('appRequests')
  }
}
