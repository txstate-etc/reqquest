import { Arg, Ctx, FieldResolver, ID, Mutation, Resolver, Root } from 'type-graphql'
import { ApplicationActions, Application, RQContext, ApplicationRequirementService, ApplicationRequirement, ApplicationService, ValidatedAppRequestResponse, PeriodWorkflowStage, ProgramService } from '../internal.js'

@Resolver(of => Application)
export class ApplicationResolver {
  @FieldResolver(returns => [ApplicationRequirement])
  async requirements (@Ctx() ctx: RQContext, @Root() application: Application) {
    return await ctx.svc(ApplicationRequirementService).findByApplication(application)
  }

  @FieldResolver(returns => PeriodWorkflowStage, { nullable: true, description: 'If the program has workflow, it may be divided into multiple stages of audit, each with their own requirements/prompts. This indicates which stage we are currently evaluating, or null if we are not in the workflow phase. An application with no workflow defined will never be in the workflow phase. Starts at 1.' })
  async workflowStage (@Ctx() ctx: RQContext, @Root() application: Application) {
    if (!application.workflowStageKey) return null
    return await ctx.svc(ProgramService).findWorkflowStage(application.periodId, application.programKey, application.workflowStageKey)
  }

  @FieldResolver(returns => ApplicationActions)
  actions (@Root() application: Application) {
    return application
  }

  @Mutation(returns => ValidatedAppRequestResponse, { description: 'Moves the application to the next workflow stage. If phase is READY_FOR_WORKFLOW, moves to the first or next blocking workflow stage. If on the last blocking workflow, moves to REVIEW_COMPLETE. If on the last non-blocking workflow, moves the application to COMPLETE. If all applications are COMPLETE, automatically triggers the app request close mutation.' })
  async advanceWorkflow (@Ctx() ctx: RQContext, @Arg('applicationId', type => ID) applicationId: string) {
    return await ctx.svc(ApplicationService).advanceWorkflow(applicationId)
  }
}

@Resolver(of => ApplicationActions)
export class ApplicationActionsResolver {
  @FieldResolver(returns => Boolean)
  viewAsReviewer (@Ctx() ctx: RQContext, @Root() application: Application) {
    return ctx.svc(ApplicationService).mayViewAsReviewer(application)
  }

  advanceWorkflow (@Ctx() ctx: RQContext, @Root() application: Application) {
    return ctx.svc(ApplicationService).mayAdvanceWorkflow(application)
  }
}
