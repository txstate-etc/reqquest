import { AppRequest, AppRequestPhase, assertNoKeyCollisions, requirementRegistry } from '../internal.js'
import type { RequirementKey } from './keys.js'

export interface ProgramDefinition {
  /**
   * A globally unique, human and machine readable key. Use lowercase snake_case, alphanumeric and
   * underscore only.
   *
   * You may omit this when you hand your programs to `RQServer.start` as a keyed object, in which
   * case the name the program is registered under becomes its key:
   *
   * ```ts
   * const adopt_a_dog_program: ProgramDefinition = { title: '...', requirementKeys: [...] }
   * export const programs = { adopt_a_dog_program, adopt_a_cat_program }
   * ```
   *
   * Note that programs must be handed over as an **ordered object literal**, never as a module
   * (`import * as programs`). A module namespace iterates its keys alphabetically rather than in
   * declaration order, and program order is meaningful - it is persisted as
   * `applications.evaluationOrder`. `RQServer.start` rejects a namespace here for that reason.
   *
   * BEWARE that the key is persisted and is what the UI registers components against. When the key
   * comes from the name, renaming that name renames the key along with it. Set `key` explicitly
   * whenever a key needs to outlive a rename.
   */
  key?: string
  /**
   * The name of the program.
   */
  title: string
  /**
   * Display title for the program in the navigation. You probably want it to be shorter than
   * the full title. If not provided, the title will be used.
   */
  navTitle?: string
  /**
   * A brief description of the program, written for applicants. Shown in applicant-facing
   * screens where the program title alone doesn't carry enough context, such as the tooltip
   * on the applicant's program review screen.
   */
  applicantDescription?: string
  /**
   * When an applicant is disqualified from a program before submitting, all they see by
   * default is the statusReason from the first requirement that failed - something like
   * "Applicant must be under 21". They may never have seen the program's own prompts, so
   * they have no sense of what the program is or what else it would have asked of them.
   * Provide a prose summary of the applicant-side requirements here and it will be shown
   * alongside the failing reason wherever the program is listed as ineligible pre-submission
   * (currently the "Ineligible benefits" panel).
   *
   * Keep it general rather than quoting specific configuration values - configuration can
   * change each period and this description will not, so a quoted value could silently
   * contradict the actual requirement.
   */
  eligibilityDescription?: string
  /**
   * The list of requirements for this program, carefully ordered so that
   * the users are presented them in a logical order.
   */
  requirementKeys: RequirementKey[]
  /**
   * Add one or more workflow stages for this program. A workflow stage is a set of requirements and prompts
   * intended to audit the review process. The audit workflow needs to be completed regardless of whether the
   * application is found to be eligible or ineligible, since ineligible applications should still be audited
   * for correctness of process. If no workflow stages are specified, the program will not have
   * an auditing workflow.
   */
  workflowStages?: WorkflowStage[]
}

export interface WorkflowStage {
  /**
   * Give each workflow stage a unique, permanent key so that we can refer to it in the database
   * even if the workflow stages are reordered. It is stored in `applications.workflowStage`,
   * `period_workflow_stages.workflowStageKey`, and `application_requirements.workflowStage`, so it
   * has to stay stable across releases.
   *
   * Required, deliberately - unlike `PromptDefinition`, `RequirementDefinition` and
   * `ProgramDefinition`, which default their key to the name they are registered under. Stages are a
   * different shape and none of that machinery fits them.
   */
  key: string
  /**
   * By default workflow stages are blocking, meaning that the application status remains
   * PENDING until the stage is completed. Further, this means that the applicant is not notified
   * of the application status until the workflow is complete and failing a requirement in this
   * workflow stage will result in the application being disqualified.
   *
   * If this is set to true, the stage is non-blocking, meaning that the application status
   * will resolve to ELIGIBLE or INELIGIBLE regardless of this stage's completion. In fact, the
   * request can be approved and offered to the applicant without this stage being completed. This
   * is useful for stages that are purely for out-of-band auditing, such as to identify process
   * improvements or training opportunities.
   */
  nonBlocking?: boolean
  /**
   * For workflows that are set nonBlocking: true, this property identifies in what AppRequestPhase
   * these workflow requirements first become visible/editable.  Once visible these workflows remain visible
   * for the remainder of the AppRequest lifecycle. Defaults to WORKFLOW_NONBLOCKING,
   * which preserves the legacy behavior of only surfacing non-blocking workflow requirements once the
   * request reaches the WORKFLOW_NONBLOCKING phase.
   */
  nonBlockingEmergence?: AppRequestPhase.STARTED | AppRequestPhase.SUBMITTED | AppRequestPhase.ACCEPTANCE | AppRequestPhase.WORKFLOW_NONBLOCKING
  /**
   * The title of the stage, displayed to the user.
   */
  title: string
  /**
   * The list of requirement keys that must be met to complete this stage.
   */
  requirementKeys: RequirementKey[]
}

/**
 * A program definition after registration, when its key - either the one it declared or the name it
 * was registered under - has been resolved and stamped onto it.
 */
export interface ProgramDefinitionProcessed extends ProgramDefinition {
  key: string
}

export class ProgramRegistry {
  private programs: Record<string, ProgramDefinitionProcessed> = {}
  private programList: ProgramDefinitionProcessed[] = []
  private activeList: ProgramDefinitionProcessed[] = []
  public workflowStagesByKey: Record<string, WorkflowStage> = {}
  public allRequirementKeys: Record<string, Set<string>> = {}
  public workflowStageByProgramAndRequirementKey: Record<string, Record<string, WorkflowStage | undefined>> = {}

  /**
   * `registeredName` is the name the definition was handed over under - its property name in the
   * ordered object passed to `RQServer.start`. It becomes the program's key unless the definition
   * carries an explicit one.
   */
  public register (program: ProgramDefinition, active: boolean, registeredName?: string) {
    const key = program.key ?? registeredName
    if (key == null) throw new Error('Registered a program with no key. Either set `key` on the definition, or pass your programs to RQServer.start as an ordered object literal (e.g. `programs: myPrograms`) so the name each is declared under can be used.')
    const processed = program as ProgramDefinitionProcessed
    processed.key = key
    this.programs[key] = processed
    this.programList.push(processed)
    if (active) this.activeList.push(processed)
    for (const requirementKey of program.requirementKeys) {
      this.allRequirementKeys[key] ??= new Set()
      this.allRequirementKeys[key].add(requirementKey)
    }
    for (const stage of program.workflowStages ?? []) {
      for (const requirementKey of stage.requirementKeys) {
        this.allRequirementKeys[key] ??= new Set()
        this.allRequirementKeys[key].add(requirementKey)
      }
    }
  }

  public get (key: string): ProgramDefinitionProcessed {
    return this.programs[key]
  }

  public list (): ProgramDefinitionProcessed[] {
    return this.programList
  }

  public finalize () {
    assertNoKeyCollisions()
    for (const program of this.programList) {
      program.navTitle ??= program.title
      for (const stage of program.workflowStages ?? []) {
        this.workflowStagesByKey[stage.key] = stage
        for (const requirementKey of stage.requirementKeys) {
          this.workflowStageByProgramAndRequirementKey[program.key] ??= {}
          this.workflowStageByProgramAndRequirementKey[program.key][requirementKey] = stage
        }
      }
    }
    requirementRegistry.finalize()
  }

  public get reachable () {
    return this.activeList
  }

  public keys () {
    return Object.keys(this.programs)
  }

  public getWorkflowStageByKey (key: string | undefined) {
    return key ? this.workflowStagesByKey[key] : undefined
  }

  public getWorkflowStageByProgramAndRequirementKey (programKey: string, requirementKey: string) {
    return this.workflowStageByProgramAndRequirementKey[programKey]?.[requirementKey]
  }
}
export const programRegistry = new ProgramRegistry()
