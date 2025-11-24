import { requirementRegistry } from '../internal.js'

export interface ProgramDefinition {
  key: string
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
   * The list of requirements for this program, carefully ordered so that
   * the users are presented them in a logical order.
   */
  requirementKeys: string[]
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
   * even if the workflow stages are reordered.
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
   * The title of the stage, displayed to the user.
   */
  title: string
  /**
   * The list of requirement keys that must be met to complete this stage.
   */
  requirementKeys: string[]
}

export class ProgramRegistry {
  private programs: Record<string, ProgramDefinition> = {}
  private programList: ProgramDefinition[] = []
  private activeList: ProgramDefinition[] = []
  public workflowStagesByKey: Record<string, WorkflowStage> = {}
  public allRequirementKeys: Record<string, Set<string>> = {}
  public workflowStageByProgramAndRequirementKey: Record<string, Record<string, WorkflowStage | undefined>> = {}

  public register (program: ProgramDefinition, active: boolean) {
    this.programs[program.key] = program
    this.programList.push(program)
    if (active) this.activeList.push(program)
    for (const requirementKey of program.requirementKeys) {
      this.allRequirementKeys[program.key] ??= new Set()
      this.allRequirementKeys[program.key].add(requirementKey)
    }
    for (const stage of program.workflowStages ?? []) {
      for (const requirementKey of stage.requirementKeys) {
        this.allRequirementKeys[program.key] ??= new Set()
        this.allRequirementKeys[program.key].add(requirementKey)
      }
    }
  }

  public get (key: string): ProgramDefinition {
    return this.programs[key]
  }

  public list (): ProgramDefinition[] {
    return this.programList
  }

  public finalize () {
    for (const program of this.programList) {
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
