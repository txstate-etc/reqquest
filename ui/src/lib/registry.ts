import type { LayoutStructureNode, LayoutStructureNodeRoot } from '@txstate-mws/carbon-svelte'
import type { SvelteComponent } from 'svelte'

export interface ProgramDefinition {
  /**
   * The key for the program. Allows us to match up API programs with
   * the appropriate definition.
   */
  key: string
  /**
   * An icon to represent this program in the navigation.
   */
  icon?: typeof SvelteComponent<any>
}

export interface RequirementDefinition {
  /**
   * The key for the requirement. Allows us to match up API requirements with
   * the appropriate definition.
   */
  key: string
  /**
   * An icon to represent this requirement in the navigation. Requirements do not appear
   * in the navigation in the applicant's view.
   */
  icon?: typeof SvelteComponent<any>
  /**
   * A component that will be used to render the form for this prompt's configuration, if applicable.
   */
  configureComponent?: typeof SvelteComponent<any>
}

export interface PromptDefinition {
  key: string
  /**
   * The component that will be used to render the form for this prompt.
   */
  formComponent: typeof SvelteComponent<any>
  /**
   * A component that displays the data collected from this prompt instead of collecting
   * it. Should be as compact as possible, as it will be displayed in a big list of prompts.
   */
  displayComponent: typeof SvelteComponent<any>
  /**
   * A component that will be used to render the form for this prompt's configuration, if applicable.
   */
  configureComponent?: typeof SvelteComponent<any>
  /**
   * An icon for the navigation.
   */
  icon?: typeof SvelteComponent<any>
}

/**
 * A type for the config object that should be exported from a CMS instance's admin/local/index.js
 * to configure how that instance should work.
 */
export interface UIConfig {
  programs: ProgramDefinition[]
  requirements: RequirementDefinition[]
  prompts: PromptDefinition[]
  appName: string
  applicantDashboardTitle?: string
  applicantDashboardNavTitle?: string
  extraNavItems?: LayoutStructureNodeRoot<LayoutStructureNode>[]
}

export class UIRegistry {
  protected promptMap: Record<string, PromptDefinition> = {}
  protected requirementMap: Record<string, RequirementDefinition> = {}
  protected programMap: Record<string, ProgramDefinition> = {}
  constructor (public config: UIConfig) {
    for (const prompt of config.prompts) this.promptMap[prompt.key] = prompt
    for (const requirement of config.requirements) this.requirementMap[requirement.key] = requirement
    for (const program of config.programs) this.programMap[program.key] = program
  }

  getPrompt (key: string) {
    return this.promptMap[key]
  }

  getRequirement (key: string) {
    return this.requirementMap[key]
  }

  getProgram (key: string) {
    return this.programMap[key]
  }
}
