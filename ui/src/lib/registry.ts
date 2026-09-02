import type { LayoutStructureNode, LayoutStructureNodeRoot, UserProfile } from '@txstate-mws/carbon-svelte'
import type { Component } from 'svelte'
import type { ProgramKey, PromptKey, RequirementKey } from './keys.js'
import { plural } from 'txstate-utils'

export interface PromptLoader {
  skeletonComponent: Component<any>
  /**
   * The number of milliseconds to wait before showing the skeleton loader. This is useful for preventing flickering when the data is fetched quickly.
   * Since some data is can be cached, the initial load needs a skeleton loader, but after caching the data comes back quicker and no skeleton loader is needed.
   */
  delay?: number
}

export type Loader = PromptLoader | boolean

export interface ProgramDefinition {
  /**
   * The key of the program this decorates. Autocompletes and rejects unknown keys once the project
   * generates a key declaration; plain `string` until then.
   */
  key: ProgramKey
  /**
   * An icon to represent this program in the navigation.
   */
  icon?: Component
}

export interface RequirementDefinition {
  /**
   * The key of the requirement this decorates. Autocompletes and rejects unknown keys once the
   * project generates a key declaration; plain `string` until then.
   */
  key: RequirementKey
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
  /**
   * The key of the prompt this renders. Autocompletes and rejects unknown keys once the project
   * generates a key declaration; plain `string` until then.
   */
  key: PromptKey
  /**
   * The component that will be used to render the form for this prompt.
   *
   * If not provided, it will be assumed that the prompt is meant to be filled in
   * by an automation. The applicant view cannot handle this, so always include
   * a formComponent for applicant prompts.
   */
  formComponent?: Component<any>
  /**
   * Control the size of the area the formComponent will be rendered in.
   * - 'small' will render the form in a small area (about 8 lines or less at 320px width).
   * - 'large' will render the form in a large area (about 32 lines or less at 800px width) (still has to be responsive down to 320px).
   * - 'full' will render the form in a modal that takes up the full screen (still has to be responsive down to 320px). This also disables autosaving in the reviewer UI.
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
  displayComponent: Component<any>
  /**
   * Control the size of the area the displayComponent will be rendered in.
   * - 'small' will render the component in a small area (about 8 lines or less at 320px width).
   * - 'large' will render the component in a large area (about 32 lines or less at 800px width) (still has to be responsive down to 320px).
   * Defaults to 'small'.
   *
   * There is no 'full' mode for displayComponent, since we always want to be able to print the
   * full information dump on a one-pager.
   *
   * If your prompt collects several question/answer pairs that should each read as their own
   * row in the prompt list, set 'large' and build the displayComponent on `PromptDisplayGrid` /
   * `PromptDisplayRow` — its rows will align with the surrounding prompt rows.
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
  /**
   * Determines if the prompt should display a skeleton loader while the data is being fetched. Defaults to false.
   * A boolean value will result in a default skeleton loader. 
   */
  loader?: Loader

  /**
   * This is the same applicantPromptPage CSS configurations that exist at the UIConfig (global applicant page prompt) level.  Used in a situation where a specific prompt
   * requires a specific layout that doesn't match default.  This will override global configuration
   */
  applicantPromptPage? : ApplicantPromptPageDefinition
}

/**
 * Applicant prompts are wrapped by the default CL Form component, so any styling applied within the svelte prompt
 * is independent (does not influence) of the layout of form elements that exist as part of the CL Form (eg. Validation notices).
 * This can result in inconsistencies in desired layouts as CL Form elements are default left aligned while prompts could expect/desire
 * center alignment.  This property allows the developer to set the global prompt page Form CSS class variable.  This can be overwritten at the
 * individual prompt level if specific prompts desire specific layouts.  This definition is used for defining those elements if required
 */
export interface ApplicantPromptPageDefinition {
  /**
   * CSS class settings specific to the Form component that wraps the prompt
   */
  formClass?: string,        
  /**
   * CSS class settings specific to the corrections inline notification within the Form
   */
  invalidatedInlineNotificationClass?: string
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
 *
 * Each of the three definition lists accepts either an array or a keyed object. **Prefer the keyed
 * object.** An array can only reject a key the API does not have; it can never require the keys the
 * API *does* have, so a prompt added on the API side and forgotten here compiles cleanly and fails
 * in front of an applicant. The keyed form turns that into a build error, and also rejects
 * duplicate keys, which an array silently resolves last-wins.
 *
 * `prompts` is the only list whose coverage is *required*, because it is the only one that is load
 * bearing: a `PromptDefinition` supplies the component that renders the screen. `requirements` and
 * `programs` carry optional decoration - an icon, a configuration component - and leaving one out
 * is a supported choice, so their keyed form is partial. Both still reject unknown keys.
 *
 * This degrades on its own: `PromptKey` is `string` until a project generates a key declaration
 * (see keys.ts), and `{ [K in string]: ... }` requires nothing - so an unaugmented project keeps
 * working exactly as before.
 *
 * The type parameters exist for repos holding several applications, where the generated union spans
 * all of them and no single config could satisfy it. Generate per-application aliases with the
 * analyzer's `--groups` flag and instantiate against one, e.g.
 * `UIConfig<SimplePromptKey, SimpleRequirementKey, SimpleProgramKey>`.
 */
export interface UIConfig<PK extends string = PromptKey, RK extends string = RequirementKey, GK extends string = ProgramKey> {
  programs: ProgramDefinition[] | { [K in GK]?: Omit<ProgramDefinition, 'key'> }
  requirements: RequirementDefinition[] | { [K in RK]?: Omit<RequirementDefinition, 'key'> }
  prompts: PromptDefinition[] | { [K in PK]: Omit<PromptDefinition, 'key'> }
  /**
   * 
   * @param login 
   * @returns UserProfile | undefined
   * UserLookup is required to support impersonation search functionality. If you want to support impersonation, 
   * provide a function here that takes a login and returns the user's profile. If you don't need impersonation, you can leave this out.
   */
  userLookup?: (login: string) => Promise<UserProfile | undefined>
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
 * Applicant prompts are wrapped by the default CL Form component, so any styling applied within the svelte prompt
 * is independent (does not influence) of the layout of form elements that exist as part of the CL Form (eg. Validation notices).
 * This can result in inconsistencies in desired layouts as CL Form elements are default left aligned while prompts could expect/desire
 * center alignment.  This property allows the developer to set the global prompt page Form CSS class variable.  This can be overwritten at the
 * individual prompt level if specific prompts desire specific layouts
 */
  applicantPromptPage? : ApplicantPromptPageDefinition

  /**
   * Applicant Review submission page title and subtitle text.
   */
  applicantReview?: {
    title?: string
    subTitle?: string
  }
  /**
   * Whether to constrain the applicant review/submission page to a medium
   * screen-width container. Defaults to true.
   */
  applicantReviewMaxWidth?: boolean
  /**
   * URL to the support/help page. If provided, a support link will be shown on applicant review screen.
   */
  supportUrl?: string
  extraNavItems?: LayoutStructureNodeRoot<LayoutStructureNode>[]
  /**
   * This is where you should describe what kind of attributes app users will be able to search users by.
   * Displayed on user management page /roles/users.
   */
  roleUsersAttributeDescription?: string
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
     * This maps to the default slot available within the IntroPanel component and can be used
     * to add additional context within IntroPanel directly below the applicantDashboardIntroHeader and
     * applicantDashboardIntroDetail
     * 
     * It will receive the following props
     * - `appRequests` with all appRequests and their details
     * - `api` which is an instance of the API client
     */
    applicantDashboardIntroSlot?: Component
    /**
     * This will be placed inside the top card on the reviewer sidebar that displays applicant information.
     *
     * It will receive receive the following props:
     * - `appRequest` with lots of app request details, import the ReviewerCardRequest type from `@reqquest/ui`
     * - `applicant` with applicant details, import the ReviewerCardApplicant type from `@reqquest/ui`. Notably
     *   this includes `otherInfo`, which contains any custom user information returned by the userLookup function you provided.
     * - `api` which is an instance of the API client, import the ReqquestAPI type from `@reqquest/ui`. This allows you to make
     * additional API calls if you need information not included in the other props.
     */
    reviewerSidebarCard?: Component
    /**
     * This will be placed below the request details in the sidebar.
     *
     * It will receive receive the following props:
     * - `appRequest` with lots of app request details, import the ReviewerCardRequest type from `@reqquest/ui`
     * - `applicant` with applicant details, import the ReviewerCardApplicant type from `@reqquest/ui`. Notably
     *   this includes `otherInfo`, which contains any custom user information returned by the userLookup function you provided.
     * - `api` which is an instance of the API client, import the ReqquestAPI type from `@reqquest/ui`. This allows you to make
     * additional API calls if you need information not included in the other props.
     */
    reviewerSidebar?: Component   
  }
}

export interface UIConfigWithDefaults extends UIConfig {
  terminology: Required<Terminologies>
  plural: Required<Terminologies>
}

/**
 * Any `UIConfig`, whichever key unions it was written against. `UIRegistry` accepts this rather
 * than `UIConfig` itself: a `UIConfig<SimplePromptKey>` is not assignable to `UIConfig<PromptKey>`
 * when the unions differ, and TypeScript does not allow a generic constructor to bridge them.
 *
 * Nothing is lost by widening here. Exhaustiveness is enforced where the config literal is written
 * (`const config: UIConfig<SimplePromptKey, ...> = { ... }`), which is the only place that knows
 * which application it belongs to.
 */
export type AnyUIConfig = Omit<UIConfig, 'programs' | 'requirements' | 'prompts'> & {
  programs: ProgramDefinition[] | Record<string, Omit<ProgramDefinition, 'key'> | undefined>
  requirements: RequirementDefinition[] | Record<string, Omit<RequirementDefinition, 'key'> | undefined>
  prompts: PromptDefinition[] | Record<string, Omit<PromptDefinition, 'key'>>
}

/**
 * Accepts either shape of a definition list and returns a key -> definition map. The keyed form
 * carries its key in the object key, so it is grafted back on to keep every consumer's
 * `definition.key` working.
 */
function toDefinitionMap<T extends { key: string }> (definitions: T[] | Record<string, Omit<T, 'key'> | undefined>): Record<string, T> {
  const map: Record<string, T> = {}
  if (Array.isArray(definitions)) {
    for (const definition of definitions) map[definition.key] = definition
  } else {
    // an explicit `undefined` value is a hole in a partial record, not a registration
    for (const [key, definition] of Object.entries(definitions)) {
      if (definition != null) map[key] = { ...definition, key } as T
    }
  }
  return map
}

export class UIRegistry {
  protected promptMap: Record<string, PromptDefinition> = {}
  protected requirementMap: Record<string, RequirementDefinition> = {}
  protected programMap: Record<string, ProgramDefinition> = {}
  protected userLookup?: (login: string) => Promise<UserProfile | undefined>
  protected lang: Required<Terminologies>
  protected plural: Required<Terminologies>
  /**
   * Widened to `AnyUIConfig` rather than `UIConfig`: a narrow `UIConfig<SimplePromptKey>` is not
   * assignable to `UIConfig<PromptKey>` when the unions differ. Keeping the three definition lists
   * on the type (instead of `Omit`ing them away) matters for consumers that read
   * `uiRegistry.config.prompts` - dropping them would be a breaking change.
   */
  public config: AnyUIConfig
  constructor (config: AnyUIConfig) {
    this.config = config
    this.promptMap = toDefinitionMap<PromptDefinition>(config.prompts)
    this.requirementMap = toDefinitionMap<RequirementDefinition>(config.requirements)
    this.programMap = toDefinitionMap<ProgramDefinition>(config.programs)
    this.userLookup = config.userLookup 
    this.lang = {
      appRequest: config.terminology?.appRequest ?? (Object.keys(this.programMap).length > 1 ? 'App Request' : 'Application'),
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
    return this.warnIfMissing('prompt', key, this.promptMap[key])
  }

  getRequirement (key: string): RequirementDefinition | undefined {
    return this.warnIfMissing('requirement', key, this.requirementMap[key])
  }

  getProgram (key: string): ProgramDefinition | undefined {
    return this.warnIfMissing('program', key, this.programMap[key])
  }

  /**
   * `UIConfig` keeps this UI in step with the API it was built against.
   *  Keys arrive here from the API at runtime, so these stay `string` rather than the key unions.
   */
  protected warnedMissing = new Set<string>()
  /**
   * This is the ONLY runtime signal that the UI is missing a definition, so it is deliberately NOT
   * gated on a dev-only build flag. Coverage is enforced at build time (see UIConfig's keyed form),
   * but that gate lives in this repo's tooling and does not ship to downstream projects - a project
   * that never wires its own type check has nothing but this line. Staying silent in production is
   * how a missing prompt turns into an unexplained blank spot on an applicant's form.
   * The `warnedMissing` set keeps it to one line per key, so a list of 200 prompts cannot spam.
   *
   * Severity splits by kind because the kinds are not equally load-bearing. A `PromptDefinition`
   * supplies the component that actually renders the screen, so a missing one breaks a page.
   * `RequirementDefinition` and `ProgramDefinition` carry only optional decoration - an icon, a
   * configuration component - and every consumer optional-chains them. Leaving one unregistered is
   * a supported choice, so it warns rather than errors.
   */
  protected warnIfMissing<T> (kind: string, key: string, definition: T | undefined) {
    if (definition == null && !this.warnedMissing.has(kind + ':' + key)) {
      this.warnedMissing.add(kind + ':' + key)
      const log = kind === 'prompt' ? console.error : console.warn
      log(`[reqquest] The API returned a ${kind} \`${key}\` that this UI has no definition for. Add it to your UIConfig, or regenerate your key declaration if the API has changed.`)
    }
    return definition
  }
}
