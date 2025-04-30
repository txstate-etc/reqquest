import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Configuration, ConfigurationAccess, ConfigurationFilters, ConfigurationService, JsonData, Period, PeriodActions, PeriodFilters, PeriodProgram, PeriodPrompt, PeriodPromptService, PeriodRequirement, PeriodRequirementService, PeriodService, PeriodUpdate, ProgramService, PromptService, RQContext } from '../internal.js'

@Resolver(of => Period)
export class PeriodResolver {
  @Query(returns => [Period])
  async periods (@Ctx() ctx: RQContext, @Arg('filter', { nullable: true }) filter?: PeriodFilters) {
    return await ctx.svc(PeriodService).find(filter)
  }

  @FieldResolver(type => [Configuration])
  async configurations (@Ctx() ctx: RQContext, @Root() period: Period, @Arg('filter', { nullable: true }) filter?: ConfigurationFilters) {
    return await ctx.svc(ConfigurationService).findByPeriodId(period.id, filter)
  }

  @FieldResolver(type => [PeriodProgram])
  async programs (@Ctx() ctx: RQContext, @Root() period: Period) {
    return await ctx.svc(ProgramService).findByPeriodId(period.id)
  }

  @FieldResolver(type => [PeriodRequirement])
  async requirements (@Ctx() ctx: RQContext, @Root() period: Period) {
    return await ctx.svc(PeriodRequirementService).findByPeriodId(period.id)
  }

  @FieldResolver(type => [PeriodPrompt])
  async prompts (@Ctx() ctx: RQContext, @Root() period: Period) {
    return await ctx.svc(PeriodPromptService).findByPeriodId(period.id)
  }

  @Mutation(returns => Period)
  async updatePeriod (@Ctx() ctx: RQContext, @Arg('id') id: string, @Arg('update') update: PeriodUpdate, @Arg('validateOnly', { nullable: true }) validateOnly?: boolean) {
    return await ctx.svc(PeriodService).update(id, update, validateOnly)
  }

  @FieldResolver(type => PeriodActions)
  actions (@Root() period: Period) {
    return period
  }
}

@Resolver(of => PeriodActions)
export class PeriodActionsResolver {
  @FieldResolver(returns => Boolean)
  view (@Ctx() ctx: RQContext, @Root() period: Period) {
    return ctx.svc(PeriodService).mayView(period)
  }

  @FieldResolver(returns => Boolean)
  update (@Ctx() ctx: RQContext, @Root() period: Period) {
    return ctx.svc(PeriodService).mayUpdate(period)
  }
}

@Resolver(of => Configuration)
export class ConfigurationResolver {
  @FieldResolver(type => JsonData)
  async data (@Ctx() ctx: RQContext, @Root() configuration: Configuration) {
    return await ctx.svc(ConfigurationService).getData(configuration.periodId, configuration.key)
  }

  @FieldResolver(type => ConfigurationAccess)
  actions (@Root() configuration: Configuration) {
    return configuration
  }
}

@Resolver(of => ConfigurationAccess)
export class ConfigurationAccessResolver {
  @FieldResolver(returns => Boolean)
  view (@Ctx() ctx: RQContext, @Root() configuration: Configuration) {
    return ctx.svc(ConfigurationService).mayView(configuration)
  }

  @FieldResolver(returns => Boolean)
  update (@Ctx() ctx: RQContext, @Root() configuration: Configuration) {
    return ctx.svc(ConfigurationService).mayUpdate(configuration.periodId, configuration.key)
  }
}
