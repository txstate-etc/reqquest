import { type ValidateFunction } from 'ajv'
import { applicantRequirementTypes, AppRequestData, ConfigurationDefinition, programRegistry, promptRegistry, RequirementStatus, RequirementType, registryAjv } from '../internal.js'
import { isNotEmpty } from 'txstate-utils'

export interface RequirementDefinition<ConfigurationDataType = any> {
  /**
   * A globally unique, human and machine readable key. This will be used to match up with
   * the UI definition. Use lowercase snake_case, alphanumeric and underscore only.
   *
   * Do not use the same key for a prompt and a requirement, as the keys will be used as
   * subject names in our authorization scheme and need to not clash.
   */
  key: string

  type: RequirementType

  /**
   * Display title for the requirement. Will be shown to any user that can see the requirement.
   */
  title: string

  /**
   * Some requirements could benefit from having a title that is dependent on the Configuration. For
   * example, a requirement that is dependent on a configuration value that is a dollar amount could
   * have a title that is `Dollar amount must be less than ${config.dollarMax}`.
   *
   * The smartTitle will be used in scenarios where a specific configuration is implied, such as for
   * an individual appRequest (since an individual appRequest implies a period, and a period implies a
   * configuration value).
   *
   * In scenarios where the requirement does not have a configuration, like on the admin screen for
   * managing all the requirements in the system, the regular title will be used.
   */
  smartTitle?: (config: ConfigurationDataType) => string

  /**
   * Display title for the requirement in the navigation. You probably want it to be shorter than
   * the full title. If not provided, the title will be used.
   */
  navTitle?: string

  /**
   * A brief description of the requirement. This will be shown to administrators to help explain
   * the full meaning of the requirement.
   */
  description: string

  /**
   * The keys of the prompts that this requirement depends upon in order to make its evaluation.
   * Prompts will be revealed one at a time to the user in the order provided here.
   *
   * The requirement will be evaluated after each prompt is answered, and if it returns a non-PENDING
   * status, the rest of the prompts will be hidden from the user, unless/until they are required
   * by a future requirement.
   *
   * The prompts are hidden until needed because we are trying to avoid asking the user for unnecessary
   * information, and we don't know until we run `resolve` whether the next prompt will be necessary, so
   * we cannot add it to the navigation structure until we know we need it.
   */
  promptKeys?: string[]

  /**
   * Prompts listed as `promptKeys` will be revealed to the user in the order provided. The user
   * must answer each prompt in order to proceed to the next one. After all of those prompts are
   * answered, if the requirement is still returning a PENDING status, the requirement may depend
   * on additional prompts that are not required to be answered in order.
   *
   * You may list those prompts here. They will all be added to the navigation structure at the same
   * time, and the user may answer them in any order. The requirement will not be evaluated again
   * until all of these prompts are answered.
   *
   * The user still may not proceed until all the prompts are answered and the requirement is
   * resolving as non-PENDING. This is to prevent a confusing situation. Consider the
   * following case:
   * - Requirement 1 has prompts A and B in its `promptKeysAnyOrder`.
   * - Requirement 2 requires prompt B in its `promptKeys`.
   * - Requirement 1 resolves as MET based solely on data in prompt A. (if the system were to allow it)
   * - Prompt B is underneath Requirement 1 in the navigation, and is still available to the user,
   *   but they skip it and move on to Requirement 2.
   * - Requirement 2 is resolving as PENDING because prompt B has not been answered.
   * - Prompt B is not shown to the user, because it's already in the navigation under Requirement 1 and
   *   the same prompt appearing twice in the navigation is confusing.
   * - The user cannot proceed unless they happen to go back and answer prompt B under Requirement 1.
   */
  promptKeysAnyOrder?: string[]

  /**
   * An array of prompt keys for prompts that this requirement depends on, but that should not be
   * shown to users beneath this requirement. For instance, if you have a requirement that depends on
   * data from an external system, you may create a prompt to house that data, but you don't want
   * to expose it to applicants or reviewers.
   *
   * For another example, what if you have two mutually exclusive programs, like if our adopt a dog and
   * adopt a cat programs didn't allow you to adopt one of each? You would have a requirement/prompt
   * at the end of each program that says "Okay great you qualify, do you want this dog?" and "Okay
   * great you qualify, do you want this cat?" and the requirement for the dog would depend on
   * the prompt for the cat, but you don't want to show the cat prompt to the user when they are
   * applying for the dog. You just want the dog requirement to fail when they say "yes" to the cat
   * and vice versa.
   */
  promptKeysNoDisplay?: string[]

  /**
   * Provide a function that can evaluate the requirement based on answers to prompts.
   *
   * This function should not be async, as the justification for a rejection should
   * be part of the permanent record. Any pertinent data retrieved from external systems
   * should be stored by a prompt in the appRequest data.
   *
   * Optionally provide the reason why the resolve function is returning whatever status
   * it is returning. This will be shown to the applicant. It's unlikely a reason is needed
   * for the MET status, but it will be shown if provided. Note that the application will
   * only ever show a single reason, the last one provided by a failing or pending requirement.
   *
   * These values will be cached until the appRequest is updated in some way.
   *
   * You'll receive the appRequestData, the configuration data, and a lookup object that
   * contains the configuration data for all requirements and prompts in the system, in
   * case you need to rely on the configuration from one of the required prompts.
   *
   * NOTE: The appRequest data passed to this function will only include data from prompts
   * that are required by this requirement and requirements that appear before this one
   * in execution order. This is to prevent situations where answering a prompt late in the
   * application process could change the determination made earlier in the process. You'll
   * have to carefully design and order your requirements to ensure that the data you need
   * is available to you.
   */
  resolve: (appRequestData: AppRequestData, config: ConfigurationDataType, configLookup: Record<string, any>) => { status: RequirementStatus, reason?: string }
  /**
   * Often, you will want to allow application administrators to control various aspects of
   * how requirements will be evaluated. For example, you might want administrators to
   * set an income threshold to determine eligibility. The threshold may change from period
   * to period and we don't want to hard-code that into the `resolve` function.
   *
   * This part of the definition is meant to allow you to do that. You create a form for the
   * administrator, and we will collect the data in JSON and give it to the resolve function as
   * a parameter. You'll also receive the configuration JSON in your smartTitle function in case
   * it helps.
   */
  configuration?: ConfigurationDefinition
}

export interface RequirementDefinitionProcessed extends RequirementDefinition {
  allPromptKeys: string[]
  visiblePromptKeys: string[]
  promptKeySet: Set<string>
  anyOrderPromptKeySet: Set<string>
  noDisplayPromptKeySet: Set<string>
}

class RequirementRegistry {
  protected requirements: Record<string, RequirementDefinitionProcessed> = {}
  protected requirementsList: RequirementDefinitionProcessed[] = []
  protected configValidators: Record<string, ValidateFunction> = {}
  public authorizationKeys: Record<string, string[]> = {}
  public reachable: RequirementDefinitionProcessed[] = []

  register (definition: RequirementDefinition) {
    const allPromptKeys = [...(definition.promptKeys ?? []), ...(definition.promptKeysAnyOrder ?? []), ...(definition.promptKeysNoDisplay ?? [])]
    const visiblePromptKeys = [...(definition.promptKeys ?? []), ...(definition.promptKeysAnyOrder ?? [])]
    const definitionProcessed: RequirementDefinitionProcessed = {
      ...definition,
      allPromptKeys,
      visiblePromptKeys,
      promptKeySet: new Set(allPromptKeys),
      anyOrderPromptKeySet: new Set(definition.promptKeysAnyOrder ?? []),
      noDisplayPromptKeySet: new Set(definition.promptKeysNoDisplay ?? [])
    }
    this.requirements[definition.key] = definitionProcessed
    this.requirementsList.push(definitionProcessed)
    if (applicantRequirementTypes.has(definition.type)) {
      for (const key of allPromptKeys) promptRegistry.setUserPrompt(key)
    }
    if (isNotEmpty(definition.configuration?.schema)) this.configValidators[definition.key] = registryAjv.compile(definition.configuration.schema)
  }

  keys () {
    return Object.keys(this.requirements)
  }

  get (key: string) {
    return this.requirements[key]
  }

  list () {
    return this.requirementsList
  }

  finalize () {
    const reachableKeys = new Set(programRegistry.reachable.flatMap(program => program.requirementKeys))
    this.reachable = this.requirementsList.filter(requirement => reachableKeys.has(requirement.key))
    promptRegistry.finalize()
  }

  validateConfig (key: string, data: any) {
    const validate = this.configValidators[key]
    if (!validate) return true
    const valid = validate(data)
    if (!valid) console.error(validate.errors)
    return valid
  }
}

export const requirementRegistry = new RequirementRegistry()
