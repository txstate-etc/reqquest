import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { ApplicationRequirementService, AppRequestService, JsonData, Prompt, promptRegistry, RequirementPrompt, RequirementPromptService, RQContext, ConfigurationService, Configuration, PeriodPrompt, PeriodPromptActions, RequirementPromptActions, PeriodPromptService, ApplicationRequirement } from '../internal.js'

@Resolver(of => Prompt)
export class PromptResolver {
  @Query(returns => [Prompt])
  async prompts (@Ctx() ctx: RQContext) {
    return promptRegistry.list().map(def => new Prompt(def))
  }
}

@Resolver(of => RequirementPrompt)
export class RequirementPromptResolver {
  @FieldResolver(type => JsonData, { nullable: true, description: 'The data that has been gathered from the user in response to this prompt. The schema is controlled by the question\'s implementation.' })
  async data (@Ctx() ctx: RQContext, @Root() requirementPrompt: RequirementPrompt, @Arg('schemaVersion', { nullable: true, description: 'Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh.' }) savedAtVersion?: string) {
    if (savedAtVersion && savedAtVersion < promptRegistry.latestMigration()) throw new Error('Client is out of date. Please refresh.')
    const appRequestData = await ctx.svc(AppRequestService).getData(requirementPrompt.appRequestInternalId)
    return appRequestData[requirementPrompt.definition.key]
  }

  @FieldResolver(type => JsonData, { nullable: true, description: 'Any data that the API needs to provide to the UI to display the prompt properly. For instance, if the prompt text is in the database and able to be modified by admins, the UI can\'t hardcode the prompt text and needs it from the API. Could also be used to pull reference information from an external system, e.g. a student\'s course schedule, for display in the prompt dialog.' })
  async fetchedData (@Ctx() ctx: RQContext, @Root() requirementPrompt: RequirementPrompt, @Arg('schemaVersion', { nullable: true, description: 'Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh.' }) savedAtVersion?: string) {
    if (savedAtVersion && savedAtVersion < promptRegistry.latestMigration()) throw new Error('Client is out of date. Please refresh.')
    const appRequest = await ctx.svc(AppRequestService).findByInternalId(requirementPrompt.appRequestInternalId)
    if (!appRequest) throw new Error('AppRequest not found')
    const relatedConfig = await ctx.svc(ConfigurationService).getRelatedData(appRequest.periodId, requirementPrompt.key)
    const config = relatedConfig[requirementPrompt.key] ?? {}
    return await requirementPrompt.definition.fetch?.(appRequest, config, relatedConfig)
  }

  @FieldResolver(type => JsonData, { nullable: true, description: 'Preload data that has been generated according to the prompt definition. For example, a prompt might query the database for answers given in previous requests or query an external API to learn facts about the user.' })
  async preloadData (@Ctx() ctx: RQContext, @Root() requirementPrompt: RequirementPrompt, @Arg('schemaVersion', { nullable: true, description: 'Provide the schemaVersion at the time the UI was built. Will throw an error if the client is too old, so it knows to refresh.' }) savedAtVersion?: string) {
    if (savedAtVersion && savedAtVersion < promptRegistry.latestMigration()) throw new Error('Client is out of date. Please refresh.')
    return await ctx.svc(RequirementPromptService).getPreloadData(requirementPrompt)
  }

  @FieldResolver(type => JsonData, { nullable: true, description: 'The configuration data for this prompt in the app request\'s period.' })
  async configurationData (@Ctx() ctx: RQContext, @Root() requirementPrompt: RequirementPrompt) {
    await ctx.svc(ConfigurationService).getData(requirementPrompt.periodId, requirementPrompt.key)
  }

  @FieldResolver(type => JsonData, { description: 'All the configuration data that could be relevant for this prompt. This includes its own config, and also the config data for any requirements and programs that are related to it.' })
  async relatedConfigurationData (@Ctx() ctx: RQContext, @Root() requirementPrompt: RequirementPrompt) {
    return await ctx.svc(ConfigurationService).getRelatedData(requirementPrompt.periodId, requirementPrompt.key)
  }

  @FieldResolver(type => ApplicationRequirement, { description: 'The requirement that this prompt is associated with.' })
  async requirement (@Ctx() ctx: RQContext, @Root() requirementPrompt: RequirementPrompt) {
    return ctx.svc(ApplicationRequirementService).findById(requirementPrompt.requirementId)
  }

  @FieldResolver(type => RequirementPromptActions, { description: 'Actions that the user can take on this prompt.' })
  actions (@Ctx() ctx: RQContext, @Root() requirementPrompt: RequirementPrompt) {
    return requirementPrompt
  }
}

@Resolver(of => RequirementPromptActions)
export class RequirementPromptActionsResolver {
  @FieldResolver(returns => Boolean)
  update (@Ctx() ctx: RQContext, @Root() requirementPrompt: RequirementPrompt) {
    return ctx.svc(RequirementPromptService).mayUpdate(requirementPrompt)
  }
}

@Resolver(of => PeriodPrompt)
export class PeriodPromptResolver {
  @FieldResolver(type => Configuration, { description: 'The configuration for this prompt in the given period.' })
  async configuration (@Ctx() ctx: RQContext, @Root() periodPrompt: PeriodPrompt) {
    return ctx.svc(ConfigurationService).findByPeriodIdAndKey(periodPrompt.periodId, periodPrompt.key)
  }
}

@Resolver(of => PeriodPromptActions)
export class PeriodPromptAccessResolver {
  configure (@Ctx() ctx: RQContext, @Root() periodPrompt: PeriodPrompt) {
    return ctx.svc(PeriodPromptService).mayConfigure(periodPrompt)
  }
}
