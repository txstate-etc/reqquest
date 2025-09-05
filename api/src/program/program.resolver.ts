import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { Program, PeriodProgramActions, ProgramService, RQContext, Period, PeriodProgram, PeriodService, ProgramFilters, PeriodProgramRequirement, PeriodRequirementService } from '../internal.js'

@Resolver(of => PeriodProgram)
export class PeriodProgramResolver {
  @Query(returns => [Program])
  async programs (@Ctx() ctx: RQContext, @Arg('filter', type => ProgramFilters, { nullable: true }) filter?: ProgramFilters) {
    return ctx.svc(ProgramService).find()
  }

  @FieldResolver(returns => Period)
  async period (@Ctx() ctx: RQContext, @Root() program: PeriodProgram) {
    return ctx.svc(PeriodService).findById(program.periodId)
  }

  @FieldResolver(returns => [PeriodProgramRequirement])
  async requirements (@Ctx() ctx: RQContext, @Root() program: PeriodProgram) {
    return ctx.svc(PeriodRequirementService).findByPeriodIdAndProgramKey(program.periodId, program.key)
  }

  @FieldResolver(returns => PeriodProgramActions)
  async actions (@Ctx() ctx: RQContext, @Root() program: PeriodProgram) {
    return program
  }
}

@Resolver(of => PeriodProgramActions)
export class PeriodProgramActionsResolver {
  @FieldResolver(returns => Boolean)
  async configure (@Ctx() ctx: RQContext, @Root() program: PeriodProgram) {
    return ctx.svc(ProgramService).mayConfigure(program)
  }
}
