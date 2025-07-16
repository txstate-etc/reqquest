import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Configuration, ConfigurationAccess as ConfigurationActions, ConfigurationFilters, ConfigurationService, JsonData, Period, PeriodActions, PeriodFilters, PeriodProgram, PeriodPrompt, PeriodPromptService, PeriodProgramRequirement, PeriodRequirementService, PeriodService, PeriodUpdate, ProgramService, RQContext, ValidatedPeriodResponse, ValidatedConfigurationResponse, AppRequest, AppRequestService } from '../internal.js'
import { ValidatedResponse } from '@txstate-mws/graphql-server'

@Resolver(of => Period)
export class PeriodResolver {
  @Query(returns => [Period])
  async periods (@Ctx() ctx: RQContext, @Arg('filter', type => PeriodFilters, { nullable: true }) filter?: PeriodFilters) {
    return await ctx.svc(PeriodService).find(filter)
  }

  @FieldResolver(type => [Configuration])
  async configurations (@Ctx() ctx: RQContext, @Root() period: Period, @Arg('filter', type => ConfigurationFilters, { nullable: true }) filter?: ConfigurationFilters) {
    return await ctx.svc(ConfigurationService).findByPeriodId(period.id, filter)
  }

  @FieldResolver(type => [PeriodProgram])
  async programs (@Ctx() ctx: RQContext, @Root() period: Period) {
    return await ctx.svc(ProgramService).findByPeriodId(period.id)
  }

  @FieldResolver(type => [PeriodProgramRequirement])
  async requirements (@Ctx() ctx: RQContext, @Root() period: Period) {
    return await ctx.svc(PeriodRequirementService).findByPeriodId(period.id)
  }

  @FieldResolver(type => [PeriodPrompt])
  async prompts (@Ctx() ctx: RQContext, @Root() period: Period) {
    return await ctx.svc(PeriodPromptService).findByPeriodId(period.id)
  }

  @Mutation(returns => ValidatedPeriodResponse)
  async createPeriod (@Ctx() ctx: RQContext, @Arg('period', type => PeriodUpdate) period: PeriodUpdate, @Arg('validateOnly', { nullable: true }) validateOnly?: boolean) {
    return await ctx.svc(PeriodService).create(period, validateOnly)
  }

  @Mutation(returns => ValidatedPeriodResponse)
  async updatePeriod (@Ctx() ctx: RQContext, @Arg('periodId', type => ID) periodId: string, @Arg('update', type => PeriodUpdate) update: PeriodUpdate, @Arg('validateOnly', { nullable: true }) validateOnly?: boolean) {
    return await ctx.svc(PeriodService).update(periodId, update, validateOnly)
  }

  @Mutation(returns => ValidatedResponse)
  async deletePeriod (@Ctx() ctx: RQContext, @Arg('periodId', type => ID) periodId: string) {
    return await ctx.svc(PeriodService).delete(periodId)
  }

  @Mutation(returns => ValidatedConfigurationResponse)
  async updateConfiguration (@Ctx() ctx: RQContext, @Arg('periodId', type => ID) periodId: string, @Arg('key') key: string, @Arg('data', type => JsonData) data: any, @Arg('validateOnly', { nullable: true }) validateOnly?: boolean) {
    return await ctx.svc(ConfigurationService).update(periodId, key, data, validateOnly)
  }

  @FieldResolver(type => PeriodActions)
  actions (@Root() period: Period) {
    return period
  }
}

@Resolver(of => PeriodActions)
export class PeriodActionsResolver {
  @FieldResolver(returns => Boolean)
  delete (@Ctx() ctx: RQContext, @Root() period: Period) {
    return ctx.svc(PeriodService).mayDelete(period)
  }

  @FieldResolver(returns => Boolean)
  update (@Ctx() ctx: RQContext, @Root() period: Period) {
    return ctx.svc(PeriodService).mayUpdate(period)
  }

  @FieldResolver(returns => Boolean)
  async createAppRequest (@Ctx() ctx: RQContext, @Root() period: Period) {
    return await ctx.svc(AppRequestService).mayCreateInPeriod(period)
  }
}

@Resolver(of => Configuration)
export class ConfigurationResolver {
  @FieldResolver(type => JsonData)
  async data (@Ctx() ctx: RQContext, @Root() configuration: Configuration) {
    return await ctx.svc(ConfigurationService).getData(configuration.periodId, configuration.key)
  }

  @FieldResolver(type => ConfigurationActions)
  actions (@Root() configuration: Configuration) {
    return configuration
  }
}

@Resolver(of => ConfigurationActions)
export class ConfigurationActionsResolver {
  @FieldResolver(returns => Boolean)
  view (@Ctx() ctx: RQContext, @Root() configuration: Configuration) {
    return ctx.svc(ConfigurationService).mayView(configuration)
  }

  @FieldResolver(returns => Boolean)
  update (@Ctx() ctx: RQContext, @Root() configuration: Configuration) {
    return ctx.svc(ConfigurationService).mayUpdate(configuration)
  }
}
