import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { ProgramGroup, ProgramGroupFilter, ProgramGroupService, Program, ProgramService, ProgramFilters, RQContext } from '../internal.js'

@Resolver(of => ProgramGroup)
export class ProgramGroupResolver {
  @Query(returns => [ProgramGroup])
  async programGroups (@Ctx() ctx: RQContext, @Arg('filter', { nullable: true }) filter?: ProgramGroupFilter) {
    return await ctx.svc(ProgramGroupService).find(filter)
  }

  @FieldResolver(returns => [Program])
  async programs (@Ctx() ctx: RQContext, @Root() programgroup: ProgramGroup, @Arg('filter', type => ProgramFilters, { nullable: true }) filter?: ProgramFilters) {
    return ctx.svc(ProgramService).findByKeys(programgroup.definition.programKeys)
  }
}
