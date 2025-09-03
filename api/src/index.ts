import multipartPlugin from '@fastify/multipart'
import { type Context, FastifyTxStateContext, GQLServer, type GQLStartOpts } from '@txstate-mws/graphql-server'
import type { GraphQLScalarType } from 'graphql'
import { DateTime } from 'luxon'
import { NonEmptyArray } from 'type-graphql'
import {
  applicationMigrations, AccessResolver, ApplicationActions, ApplicationActionsResolver,
  AppRequestAccessResolver, ProgramGroupResolver, PeriodProgramResolver,
  AccessUserResolver, AccessRoleResolver, RoleActionsResolver, RequirementPromptActionsResolver, accessMigrations,
  DatabaseMigration, initializeDb, DateTimeScalar, rqContextMixin, ProgramDefinition,
  RequirementDefinition, PromptDefinition, AppDefinition, ProgramGroupDefinition, programRegistry,
  programGroupRegistry, promptRegistry, requirementRegistry, appConfig, promptMigrations,
  requirementMigrations, appRequestMigrations, RQContextClass, ensureConfigurationRecords,
  periodMigrations, AccessSubjectTypeResolver, AppRequestResolver, ApplicationResolver, ApplicationRequirementResolver,
  RequirementPromptResolver, PeriodResolver, PeriodActionsResolver, ConfigurationResolver,
  ConfigurationActionsResolver, SnakeCaseString, SnakeCaseStringScalar, PeriodProgramActionsResolver,
  PeriodRequirementResolver, PeriodPromptResolver, initAccess, AppRequestIndexCategoryResolver,
  AccessRoleGrantResolver, AccessGrantTagResolver, IndexCategoryResolver,
  AccessRoleGrantActionsResolver, AccessTagCategoryResolver, logMutation,
  AppRequestActivityResolver
} from './internal.js'
import { scheduler, schedulerMigration } from './util/scheduler.js'

export interface RQStartOpts extends Omit<GQLStartOpts, 'resolvers'> {
  resolvers?: NonEmptyArray<Function>
  overrideResolvers?: Map<Function, Function>
  migrations?: DatabaseMigration[]
  appConfig: AppDefinition
  /**
   * Include programs here that are part of the current application process. Any programs that
   * have been discontinued should be included in `pastPrograms`.
   */
  programs: ProgramDefinition[]
  /**
   * When you first create the project, the programs go in `programs`. When a program is discontinued,
   * you may either leave it in `programs` and disable it in the current period, or do a software release
   * to move it here. Either way, it will be available for historical purposes, but if you move it here,
   * it will not be available to be re-enabled in new periods and will not show up in the configuration
   * screens.
   */
  pastPrograms?: ProgramDefinition[]
  requirements: RequirementDefinition[]
  prompts: PromptDefinition[]
  programGroups: ProgramGroupDefinition[]
}

export class RQServer extends GQLServer {
  /**
   * typescript is complaining that I made resolvers optional, this is a liskov violation but it
   * really doesn't matter with the way we'll be using it.
   */
  // @ts-expect-error
  async start (options: RQStartOpts) {
    await this.app.register(multipartPlugin, { limits: { fileSize: 1024 * 1024 * 100, files: 5 } })

    const resolvers = [
      AccessGrantTagResolver,
      AccessResolver,
      AccessRoleResolver,
      AccessRoleGrantActionsResolver,
      AccessRoleGrantResolver,
      AccessSubjectTypeResolver,
      AccessTagCategoryResolver,
      AccessUserResolver,
      ApplicationActions,
      ApplicationActionsResolver,
      ApplicationActionsResolver,
      ApplicationResolver,
      ApplicationRequirementResolver,
      AppRequestAccessResolver,
      AppRequestActivityResolver,
      IndexCategoryResolver,
      AppRequestIndexCategoryResolver,
      AppRequestResolver,
      ConfigurationResolver,
      ConfigurationActionsResolver,
      PeriodResolver,
      PeriodActionsResolver,
      PeriodProgramActionsResolver,
      PeriodProgramResolver,
      PeriodRequirementResolver,
      PeriodPromptResolver,
      ProgramGroupResolver,
      RequirementPromptResolver,
      RequirementPromptActionsResolver,
      RoleActionsResolver,
      ...(options?.resolvers ?? [])
    ].map(resolver => options?.overrideResolvers?.get(resolver) ?? resolver) as NonEmptyArray<Function>

    const scalarsMap: { type: any, scalar: GraphQLScalarType }[] = [
      { type: SnakeCaseString, scalar: SnakeCaseStringScalar },
      { type: DateTime, scalar: DateTimeScalar }
    ]
    scalarsMap.push(...(options.scalarsMap ?? []))

    options.customContext = rqContextMixin(options.customContext ?? FastifyTxStateContext as typeof Context)
    options.scalarsMap = scalarsMap
    options.send401 ??= true

    const originalAfter = options.after
    options.after = async (...args) => {
      await Promise.all([
        originalAfter?.(...args),
        logMutation(...args)
      ])
    }

    Object.assign(appConfig, options.appConfig)
    appConfig.customContext = options.customContext as RQContextClass
    for (const prompt of options.prompts) promptRegistry.register(prompt)
    for (const requirement of options.requirements) requirementRegistry.register(requirement)
    for (const group of options.programGroups) programGroupRegistry.register(group)
    for (const program of options.programs) programRegistry.register(program, true)
    for (const program of options.pastPrograms ?? []) programRegistry.register(program, false)
    programRegistry.finalize()
    await initializeDb([...periodMigrations, ...promptMigrations, ...requirementMigrations, ...accessMigrations, ...appRequestMigrations, ...applicationMigrations, schedulerMigration, ...(options?.migrations ?? [])])
    await initAccess()
    await ensureConfigurationRecords()
    await super.start({ ...options, resolvers })
    await scheduler.start()
  }
}

export * from './internal.js'
