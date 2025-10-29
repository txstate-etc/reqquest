import type { LayoutStructureNode, LayoutStructureNodeRoot } from '@txstate-mws/carbon-svelte'
import type { Component } from 'svelte'
import { plural } from 'txstate-utils'

export interface ProgramDefinition {
  /**
   * The key for the program. Allows us to match up API programs with
   * the appropriate definition.
   */
  key: string
  /**
   * An icon to represent this program in the navigation.
   */
  icon?: Component
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
  icon?: Component
  /**
   * A component that will be used to render the form for this prompt's configuration, if applicable.
   */
  configureComponent?: Component
  /**
   * Read-only version of the configuration.
   */
  configureDisplayComponent?: Component
}

export interface PromptDefinition {
  key: string
  /**
   * The component that will be used to render the form for this prompt.
   *
   * If not provided, it will be assumed that the prompt is meant to be filled in
   * by an automation. The applicant view cannot handle this, so always include
   * a formComponent for applicant prompts.
   */
  formComponent?: Component
  /**
   * Control the size of the area the formComponent will be rendered in.
   * - 'small' will render the form in a small area (about 8 lines or less at 320px width).
   * - 'large' will render the form in a large area (about 32 lines or less at 800px width) (still has to be responsive down to 320px).
   * - 'full' will render the form in a modal that takes up the full screen (still has to be responsive down to 320px).
   * Defaults to 'small'.
   */
  formMode?: 'small' | 'large' | 'full'
  /**
   * Set this to true to make the prompt visually distinct as something that is meant to
   * be filled in by an automation. If you provide a formComponent, humans with permission
   * will still have an edit pencil and be able to edit the prompt in a modal.
   *
   * - If you didn't provide a formComponent, `automation` defaults to true.
   * - When `automation` is true, `formMode` is ignored (behaves like 'full').
   * - The applicant view will ignore this setting.
   *
   * Note: if you set this and also provide a formComponent, it might be a good idea to add
   * a hidden field to the formComponent to mark the data as written by a human, so automations
   * know to stop updating the data. Automations will set data directly so anything you do
   * in the formComponent will only affect human edits / overrides.
   */
  automation?: boolean
  /**
   * A component that displays the data collected from this prompt instead of collecting
   * it. Should be as compact as possible, as it will be displayed in a big list of prompts.
   */
  displayComponent: Component
  /**
   * Control the size of the area the displayComponent will be rendered in.
   * - 'small' will render the component in a small area (about 8 lines or less at 320px width).
   * - 'large' will render the component in a large area (about 32 lines or less at 800px width) (still has to be responsive down to 320px).
   * Defaults to 'small'.
   *
   * There is no 'full' mode for displayComponent, since we always want to be able to print the
   * full information dump on a one-pager.
   */
  displayMode?: 'small' | 'large'
  /**
   * A component that will be used to render the form for this prompt's configuration, if applicable.
   *
   * Configuration forms are always rendered in a modal that takes up (up to) the full screen.
   */
  configureComponent?: Component
  /**
   * Read-only version of the configuration.
   */
  configureDisplayComponent?: Component
  /**
   * An icon for the navigation.
   */
  icon?: Component
}

export interface Terminologies {
  /**
  * The name of the container for all the applications/programes.
  *
  * Defaults to "App Request", but can be changed to something like "Request" or "Application".
  * "Application" works well if the project only has one program.
  */
  appRequest?: string
  /**
  * What to call the login for each user.
  *
  * Defaults to "Login", but can be changed to something like "Username" or "Email" or something
  * unique to the organization like "NetID".
  */
  login?: string
  /**
   * The name of the time periods that applications are placed inside.
   *
   * Defaults to "Period", but can be changed to something like "Year" or "Term" or "Application
   * Window".
   */
  period?: string
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
  /**
   * The header text for the applicant dashboard intro section.
   */
  applicantDashboardIntroHeader?: string
  applicantDashboardIntroDetail?: string
  /**
   * The number of days an application is considered "recent" on the applicant dashboard.
   * Defaults to 30 if not specified.
   */
  applicantDashboardRecentDays?: number
  /**
   * URL to the support/help page. If provided, a support link will be shown on applicant review screen.
   */
  supportUrl?: string
  extraNavItems?: LayoutStructureNodeRoot<LayoutStructureNode>[]
  /**
   * These options give you the ability to customize the terminology used in the UI.
   *
   * This is useful for changing the wording to better fit your project's
   * context.
   */
  terminology?: Terminologies & {
    /**
     * Optionally, provide plural forms for each of the above. By default we will use a pluralization
     * library.
     */
    plural?: Terminologies
  }
  /**
   * Several spots in the UI allow you to provide custom components to add extra data or functionality.
   *
   * Specify the components here.
   */
  slots?: {
    /**
     * This will be placed inside the card on the reviewer sidebar.
     *
     * It will be given the `basicRequestData` prop, which contains the basic information about the
     * request, such as the name of the applicant and the period. Any custom user information returned
     * by the userLookup function you provide will also be included at `basicRequestData.applicant.otherInfo`.
     */
    reviewerSidebarCard?: Component
    /**
     * This will be placed below the request details in the sidebar.
     *
     * It will only receive the `basicRequestData` prop, but you may use the `api` object from
     * @reqquest/ui to fetch additional data.
     */
    reviewerSidebar?: Component
  }
}

export interface UIConfigWithDefaults extends UIConfig {
  terminology: Required<Terminologies>
  plural: Required<Terminologies>
}

export class UIRegistry {
  protected promptMap: Record<string, PromptDefinition> = {}
  protected requirementMap: Record<string, RequirementDefinition> = {}
  protected programMap: Record<string, ProgramDefinition> = {}
  protected lang: Required<Terminologies>
  protected plural: Required<Terminologies>
  constructor (public config: UIConfig) {
    for (const prompt of config.prompts) this.promptMap[prompt.key] = prompt
    for (const requirement of config.requirements) this.requirementMap[requirement.key] = requirement
    for (const program of config.programs) this.programMap[program.key] = program
    this.lang = {
      appRequest: config.terminology?.appRequest ?? config.programs.length > 1 ? 'App Request' : 'Application',
      login: config.terminology?.login ?? 'Login',
      period: config.terminology?.period ?? 'Period'
    }
    this.plural = {} as any
    for (const key of Object.keys(this.lang) as (keyof Terminologies)[]) {
      this.plural[key] = config.terminology?.plural?.[key] ?? plural(this.lang[key])
    }
  }

  getWord (key: keyof Terminologies, count = 1, inclusive = false) {
    return (inclusive ? count + ' ' : '') + (count !== 1 ? this.plural[key] : this.lang[key])
  }

  getPlural (key: keyof Terminologies) {
    return this.plural[key]
  }

  getPrompt (key: string): PromptDefinition | undefined {
    return this.promptMap[key]
  }

  getRequirement (key: string): RequirementDefinition | undefined {
    return this.requirementMap[key]
  }

  getProgram (key: string): ProgramDefinition | undefined {
    return this.programMap[key]
  }
}
