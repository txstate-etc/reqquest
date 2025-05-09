import { Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { Context } from '@txstate-mws/graphql-server'
import { requirementRegistry, Requirement, ApplicationRequirement, Prompt, promptRegistry, RequirementPrompt, RequirementPromptService, Application, ApplicationService, Configuration, ConfigurationService, RQContext, PeriodProgramRequirement, PromptService, JsonData, PeriodPromptService, PeriodPrompt } from '../internal.js'

@Resolver(of => Requirement)
export class RequirementResolver {
  @Query(returns => [Requirement])
  async requirements (@Ctx() ctx: Context) {
    return requirementRegistry.list().map(definition => new Requirement(definition))
  }

  @FieldResolver(returns => [Prompt])
  async prompts (@Ctx() ctx: Context, @Root() requirement: Requirement) {
    return requirement.definition.promptKeys?.map(key => new Prompt(promptRegistry.get(key))) ?? []
  }
}

@Resolver(of => ApplicationRequirement)
export class ApplicationRequirementResolver {
  @FieldResolver(returns => [RequirementPrompt])
  async prompts (@Ctx() ctx: Context, @Root() requirement: ApplicationRequirement) {
    return await ctx.svc(RequirementPromptService).findByApplicationRequirement(requirement)
  }

  @FieldResolver(returns => Application)
  async application (@Ctx() ctx: Context, @Root() requirement: ApplicationRequirement) {
    return await ctx.svc(ApplicationService).findByInternalId(requirement.applicationInternalId, requirement.appRequestTags)
  }

  @FieldResolver(type => JsonData, { nullable: true, description: 'The configuration data for this requirement in the app request\'s period.' })
  async configurationData (@Ctx() ctx: RQContext, @Root() applicationRequirement: ApplicationRequirement) {
    return ctx.svc(ConfigurationService).getData(applicationRequirement.periodId, applicationRequirement.key)
  }

  @FieldResolver(type => String, { description: 'The smart title for this requirement in the app request\'s period. For instance, might be "Applicant must have GPA over 3.4" instead of the regular title "Applicant must meet GPA requirement". Will fall back to the regular title for any requirement that does not provide a smart title.' })
  async smartTitle (@Ctx() ctx: RQContext, @Root() applicationRequirement: ApplicationRequirement) {
    const configuration = await ctx.svc(ConfigurationService).findByPeriodIdAndKey(applicationRequirement.periodId, applicationRequirement.key)
    return applicationRequirement.definition.smartTitle?.(configuration) ?? applicationRequirement.definition.title
  }
}

@Resolver(of => PeriodProgramRequirement)
export class PeriodRequirementResolver {
  @FieldResolver(returns => [PeriodPrompt])
  async prompts (@Ctx() ctx: Context, @Root() requirement: PeriodProgramRequirement) {
    return await ctx.svc(PeriodPromptService).findByPeriodIdAndRequirementKey(requirement.periodId, requirement.key) // TODO: filter by requirement key
  }

  @FieldResolver(type => Configuration, { description: 'The configuration for this requirement in the period.' })
  async configuration (@Ctx() ctx: RQContext, @Root() periodRequirement: PeriodProgramRequirement) {
    return ctx.svc(ConfigurationService).findByPeriodIdAndKey(periodRequirement.periodId, periodRequirement.key)
  }
}
