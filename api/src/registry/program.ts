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
}

export class ProgramRegistry {
  private programs: Record<string, ProgramDefinition> = {}
  private programList: ProgramDefinition[] = []
  private activeList: ProgramDefinition[] = []

  public register (program: ProgramDefinition, active: boolean) {
    this.programs[program.key] = program
    this.programList.push(program)
    if (active) this.activeList.push(program)
  }

  public get (key: string): ProgramDefinition {
    return this.programs[key]
  }

  public list (): ProgramDefinition[] {
    return this.programList
  }

  public finalize () {
    requirementRegistry.finalize()
  }

  public get reachable () {
    return this.activeList
  }

  public keys () {
    return Object.keys(this.programs)
  }
}
export const programRegistry = new ProgramRegistry()

/**
 * Program groups are for grouping programs together visually in various places in the UI.
 * They do not have a functional impact on the system beyond display.
 */
export interface ProgramGroupDefinition {
  key: string
  /**
   * The name of the program group.
   */
  title: string
  /**
   * Display title for the program group in the navigation. You probably want it to be shorter than
   * the full title. If not provided, the title will be used.
   */
  navTitle?: string
  /**
   * The keys of the programs that belong to this group.
   */
  programKeys: string[]
}

export class ProgramGroupRegistry {
  private programGroups: Record<string, ProgramGroupDefinition> = {}
  private byProgramKey: Record<string, ProgramGroupDefinition> = {}
  private programGroupList: ProgramGroupDefinition[] = []

  public register (programGroup: ProgramGroupDefinition) {
    this.programGroups[programGroup.key] = programGroup
    this.programGroupList.push(programGroup)
    for (const programKey of programGroup.programKeys) {
      this.byProgramKey[programKey] = programGroup
    }
  }

  public get (key: string) {
    return this.programGroups[key]
  }

  public list () {
    return this.programGroupList
  }

  public getByProgramKey (programKey: string) {
    return this.byProgramKey[programKey]
  }
}
export const programGroupRegistry = new ProgramGroupRegistry()
