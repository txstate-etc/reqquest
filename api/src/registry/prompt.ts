import type { MutationMessage } from '@txstate-mws/graphql-server'
import type { SchemaObject } from '@txstate-mws/fastify-shared'
import Ajv, { ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'
import db from 'mysql2-async/db'
import { Cache, isNotBlank, isNotEmpty, sortby } from 'txstate-utils'
import { AppRequest, getIndexesInUse, programRegistry, requirementRegistry, RQContext, TagDefinition, type AppRequestData } from '../internal.js'

export interface AppRequestMigration<DataType = Omit<AppRequestData, 'savedAtVersion'>> {
  /**
   * A unique, sequenced identifier for the migration. Will be enforced to be
   * a valid date in the format YYYYMMDDHHMMSS. This will be used to determine
   * which migrations need to be applied based on the `savedAtVersion` in the
   * app request data, and also the order in which migrations are applied.
   */
  id: string
  up: (data: DataType) => DataType | Promise<DataType>
}

export interface PromptIndexDefinition<PromptKey extends string = string, DataType = any> {
  /**
   * A unique, case-insensitive, stable key for the index. This will be used to namespace
   * individual index values.
   */
  category: string
  /**
   * A human readable name for the index that will be shown to the admin when creating a grant.
   * Does not need to be stable, but should be unique among all the AppRequest indexes/tags.
   */
  categoryLabel?: string
  /**
   * Set this to a non-zero positive integer to indicate that this index should be displayed
   * in the AppRequest list view. This number indicates the priority of the column. Lower priority
   * numbers will be the first to disappear when the screen gets too small. Probably a good
   * idea to stay between 1 and 100 for sanity.
   */
  useInAppRequestList?: number
  /**
   * Set this to a non-zero positive integer to indicate that this index should be used for
   * filtering the main AppRequest list view. This number indicates the priority of the column.
   * The two or three highest priority filters will be used as quick filters, the rest will be
   * in the filter UI popout. Probably a good idea to stay between 1 and 100 for sanity.
   */
  useInListFilters?: number
  /**
   * Set this to a non-zero positive integer to indicate that this index should be displayed
   * for App Requests in the applicant dashboard. This number indicates the priority of the
   * column. Lower priority numbers will be the first to disappear when the screen gets too
   * small. Probably a good idea to stay between 1 and 100 for sanity.
   */
  useInApplicantDashboard?: number
  /**
   * Set this to a non-zero positive integer to indicate that this index should be displayed for App Requests in the
   * reviewer dashboard. This number indicates the priority of the column. Lower priority
   * numbers will be the first to disappear when the screen gets too small. Probably a good
   * idea to stay between 1 and 100 for sanity.
   */
  useInReviewerDashboard?: number
  /**
   * Provide a function that will take the data from the AppRequest and return any index
   * values that are associated.
   */
  extract: (data: AppRequestData & Record<PromptKey, DataType>) => string[]
  /**
   * This function should return a tag label for the given value in this category. This is used to
   * display the tags on a saved grant or generated from the AppRequest.
   *
   * It may be called many times in parallel so it should be dataloaded or cached if possible.
   *
   * ReqQuest will cache these results in its database in case values disappear from the available
   * list but appeared in the past.
   */
  getLabel?: (tag: string) => Promise<string | undefined> | string | undefined
}

export interface PromptTagDefinition<PromptKey extends string = string, DataType = any> extends PromptIndexDefinition<PromptKey, DataType> {
  /**
   * A brief sentence or two describing the tag category. This will be shown to administrators to help
   * explain the full meaning of the tag category as they are assigning permissions.
   */
  description?: string
  /**
   * This controls whether the tag category is a small or large list of possible tags.
   * If notListable is false, we assume there are a finite number of tags, and the admin will be
   * able to select from a dropdown.
   *
   * If notListable is true, we assume there are too many tags to list, and the admin will be
   * able to search for them instead.
   */
  notListable?: boolean
  /**
   * This function should return a list of all possible tags in this category, so that the admin
   * can select from them. If notListable is true, this function should accept the search parameter
   * and return a list of tags that match the search. If notListable is false, this function should
   * return all tags in the category.
   */
  getTags?: (search?: string) => Promise<TagDefinition[]> | TagDefinition[]
}

export interface ConfigurationDefinition<ConfigurationInputType = any, ConfigurationDataType = any> {
  /**
   * Provide a JSON-schema object to help validate the configuration data. Reqquest will
   * use ajv to validate the input data against this schema.
   *
   * Only use this schema for safety, like ensuring a number is a number, NOT for errors a user
   * could make. Failing this check should be considered a software bug in your schema
   * or form component. Users will NOT get a friendly error message when it fails.
   *
   * This schema is evaluated before `preProcessData` runs, so be sure to describe the structure
   * appropriately. If you are accepting an uploaded file and then taking it apart to create
   * the configuration data, you will need to account for type mismatches as you parse the file.
   */
  schema?: SchemaObject
  /**
   * This function is called before the configuration data is processed. It can be used to
   * modify the data, read incoming files and translate them into data, or save files to the
   * filesystem.
   *
   * To process files, you are provided the Context object from graphql-server. This object
   * has a `files()` method that can be used to access the incoming file streams.
   *
   * You may throw an error from this function to protect the system from bad data, like a file
   * stream that goes over its stated length.
   *
   * This function runs after the JSON-schema has been validated but before the `validate` function
   * has run. This will help you in cases where you are converting a file into data (that should then
   * validate), but be aware of the potential transformations when you set the `arg` for each
   * MutationMessage returned by `validate`.
   */
  preProcessData?: (data: Partial<ConfigurationInputType>, ctx: RQContext) => Promise<ConfigurationDataType> | ConfigurationDataType
  /**
   * Return validation messages to the user to help them provide correct input while
   * configuring the Prompt. Prompt configuration is for administrators to be able to
   * adjust the behavior of the prompt, e.g. changing the text of the prompt.
   *
   * This function runs after the `preProcessData` function has run. This will help you in cases
   * where you are converting a file into data (that should then validate), but be aware of the potential
   * transformations when you set the `arg` for each MutationMessage returned.
   */
  validate?: (data: ConfigurationDataType) => Promise<MutationMessage[]> | MutationMessage[]
  /**
   * An array of migrations to perform on the configuration data to make it compatible with the latest
   * version of the software. Be careful not to revise history too much, changes here will affect all
   * past requests. Use this only to maintain compatibility / avoid crashes, NOT to adjust the
   * behavior of the prompt.
   */
  migrations?: AppRequestMigration<ConfigurationDataType & { savedAtVersion: string }>[]
  /**
   * A function that can be used to fetch data from external sources while updating the configuration
   * for a prompt or requirement.
   */
  fetch?: (periodId: string) => Promise<any> | any
  /**
   * The default configuration data for this prompt. This will be used to initialize the
   * configuration data for the prompt when it is added to a period that does not already
   * have a configuration for it.
   *
   * Typically the configuration will be copied from period to period, so this is only used
   * for the first period after the prompt is added to the system.
   *
   * It may also be used as a reset-to-default target.
   */
  default?: ConfigurationDataType
}

export interface PromptDefinition<DataType = any, InputDataType = DataType, ConfigurationDataType = any, FetchType = any, KeyLiteral extends string = string> {
  /**
   * A globally unique, human and machine readable key. This will be used to match up with
   * the UI definition and identify the prompt's answers stored in the database. Use lowercase
   * snake_case, alphanumeric and underscore only.
   *
   * Do not use the same key for a prompt and a requirement, as the keys will be used as
   * tag names in our authorization scheme and need to not clash.
   */
  key: KeyLiteral
  /**
   * Display title for the prompt. Will be shown to any user that can see the prompt.
   */
  title: string
  /**
   * Display title for the prompt in the navigation. You probably want it to be shorter than
   * the full title. If not provided, the title will be used.
   */
  navTitle?: string
  /**
   * A brief description of the prompt. This will be shown to administrators to help explain
   * the full meaning of the prompt as they are assigning permissions or editing its configuration.
   */
  description?: string
  /**
   * Optionally provide a JSON-schema object to validate the prompt's input data. Reqquest will
   * use ajv to validate the input data against this schema.
   *
   * Only use this schema for safety, like ensuring a number is a number, NOT for errors a user
   * could make. Failing this check should be considered a software bug in your prompt definition
   * or form component. Users will NOT get a friendly error message when it fails.
   *
   * This runs before your `preProcessData` function so be sure to describe the structure before
   * pre-processing.
   */
  schema?: SchemaObject
  /**
   * Return validation messages to the user to help them provide correct input.
   *
   * Note that validation errors will not prevent the prompt from being saved. We want to allow
   * the user to save any time and visit another part of the application, even if what they've
   * entered isn't perfect.
   *
   * When it comes time to use the gathered data for evaluating a requirement, that's where
   * we require that there are no validation errors present. None of the prompt's data will be
   * made available to the requirement `resolve` function until there are no errors.
   *
   * This function runs after the `preProcessData` function has run. This is a little tricky but
   * the `validate` function has to run during the app request evaluation routine, so it must operate
   * on post-processed data. Be aware of the potential transformations when you set the `arg` for each
   * MutationMessage you return.
   */
  validate?: (data: Partial<DataType>, config: ConfigurationDataType, relatedConfig: Record<string, any>) => MutationMessage[]
  /**
   * In some cases you may want to provide MutationMessages that actually prevent saving, for instance
   * when a prompt has file uploads, and you want to create a file type or file size restriction. In this
   * case you do not want to save invalid files, because they are expensive and would be difficult to
   * clean up.
   *
   * Provide this function and any errors you return will prevent the prompt data from being saved. It
   * runs before the `preProcessData` function so it should expect the pre-processed data structure.
   * `preProcessData` will not be run at all if this returns any errors.
   */
  preValidate?: (data: Partial<InputDataType>, config: ConfigurationDataType, relatedConfig: Record<string, any>) => MutationMessage[]
  /**
   * A function that can be used to preload data for the prompt. This is useful for
   * prompts that depend on data from the database or other sources. Data provided by
   * this function will only be used to preload form fields in the UI. It will never
   * be used on the backend to determine whether the prompt has been answered, whether
   * a requirement has been met, whether a another prompt is invalidated, etc.
   *
   * This function will not run if the user has already partially answered the prompt.
   */
  preload?: (appRequest: AppRequest, config: ConfigurationDataType, relatedConfig: Record<string, any>) => Promise<DataType> | DataType
  /**
   * A function that can be used to fetch data from external sources that will
   * affect the prompt UI. The data from this function will be provided to the svelte
   * component for this prompt as a prop named `fetchedData`.
   *
   * NOTE: this function will only be called when displaying the prompt to the user. If
   * any of this data is required for decision-making, you should store it alongside the
   * data collected from the user during the prompt, e.g. use FieldHidden.
   */
  fetch?: (appRequest: AppRequest, config: ConfigurationDataType, relatedConfig: Record<string, any>) => Promise<FetchType> | FetchType
  /**
   * A list of keys of other prompts that the person answering this prompt depends
   * upon in order to answer this prompt. When the answer to any of these prompts
   * changes, the answer to this prompt will be invalidated.
   *
   * For instance, assume the reviewer is asked to verify one of the submitter's
   * uploaded documents. The reviewer does so and marks the document as verified. Then
   * the submitter changes the document. The reviewer should have to verify the document
   * again.
   *
   * If the invalidation depends on the answer to the prompt, you can provide a function.
   * For instance, if we have a prompt asking for the reviewer to verify a document, and
   * they answer no, we would invalidate the prompt asking the submitter to upload the
   * document. If the reviewer answers yes, we would not invalidate.
   */
  invalidUponChange?: InvalidatedResponse[] | InvalidatorFunction
  /**
   * After answering a prompt that says another prompt is invalid, it's possible the
   * same user will change their answer back to something that would make the prompt
   * valid again. For instance, a yes/no question about whether a document is verified -
   * the reviewer could accidentally say no. If they change it back to yes, we don't want
   * the application to be stuck waiting for the applicant to come back and hit save.
   *
   * Provide a function here that when the answer changes to a yes, it returns
   * the prompt key that should be re-validated.
   *
   * Be a little careful with this. If there are two review prompts that can
   * invalidate/revalidate the same applicant prompt, one of them could mark
   * it valid while the other marks it invalid. There's no stable way to know
   * which will win. It's probably best not to have two review prompts that
   * could potentially invalidate the same applicant prompt.
   */
  validUponChange?: (data: DataType) => string[]
  /**
   * An array of migrations to perform on the request data to make it compatible with the latest
   * version of the software. Takes the full request data object instead of the data
   * from this individual prompt so that we can perform merges and splits.
   */
  migrations?: AppRequestMigration<Omit<AppRequestData, 'savedAtVersion'> & { [K in KeyLiteral]: DataType }>[]

  /**
   * Optionally provide index types that can be calculated based on the data from this prompt. The indexes
   * can be used to filter AppRequests, and optionally can be displayed in tables listing AppRequests.
   */
  indexes?: PromptIndexDefinition<KeyLiteral, DataType>[]
  /**
   * Optionally provide tag types that can be calculated based on the data from this prompt. These
   * tags will be made available for limiting the scope of roles that relate to AppRequests. Tags
   * are also indexes, you don't need to provide them in both places.
   */
  tags?: PromptTagDefinition<KeyLiteral, DataType>[]
  /**
   * Optionally provide a function that can preprocess the data from this prompt before it is
   * saved to the database. This is useful for prompts that need to do some processing on the
   * data before it is stored, e.g. converting a string to a date or saving files to disk.
   *
   * To save files to disk, we provide the Context object provided by graphql-server. This object
   * has a `files()` method that can be used to access the incoming file streams.
   *
   * You may throw an error from this function to protect the system from bad data, like a file
   * stream that goes over its stated length.
   *
   * This function runs after the JSON-schema has been validated but before the `validate` function
   * has run. This is a little tricky but the validate function has to run during the app request
   * evaluation routine, so it has to operate on post-processed data. Be aware of the potential
   * transformations when you set the `arg` for each MutationMessage returned by `validate`.
   */
  preProcessData?: (data: InputDataType, ctx: RQContext, appRequest: AppRequest, relatedConfig: Record<string, any>) => Promise<DataType> | DataType
  /**
   * Sometimes, you will want to allow application administrators to control various aspects of
   * how the prompt will be displayed or evaluated. For example, you might want administrators to
   * be able to re-word questions, create a list of questions, or create a list of values for
   * a dropdown.
   *
   * This section is meant to enable you to do that. You create a form for the administrator, and
   * we will collect the data in JSON and give it to the prompt component as a prop. You'll also
   * receive the configuration JSON in your validate, preValidate, preProcessData, etc - to help you
   * make decisions.
   */
  configuration?: ConfigurationDefinition
}

export interface InvalidatedResponse {
  promptKey: string
  reason?: string
}

export type InvalidatorFunction = (data: any, relatedConfig: Record<string, any>) => InvalidatedResponse[]

const labelLookupCache = new Cache(async (tag: { category: string, value: string }) => {
  return await (promptRegistry as any).indexLookups[tag.category]?.(tag.value) ?? tag.value
}, { freshseconds: 600 })

const indexListCache = new Cache(async (category: string) => {
  return await getIndexesInUse(category)
}, { freshseconds: 10, staleseconds: 600 })

const tagListCache = new Cache(async (key: { category: string, search?: string }, getTags: (search?: string) => TagDefinition[] | Promise<TagDefinition[]>) => {
  const tags = await getTags(key.search)
  if (tags?.length) {
    const ibinds: any[] = []
    await db.insert(`INSERT INTO tag_labels (category, tag, label) VALUES ${db.in(ibinds, tags.map(tag => [key.category, tag.value, tag.label ?? tag.value]))} ON DUPLICATE KEY UPDATE label = VALUES(label)`, ibinds)
  }
  return tags ?? []
}, { freshseconds: 300 })

export const registryAjv = new Ajv({
  allErrors: true,
  strictSchema: false,
  coerceTypes: true
})

addFormats(registryAjv)
addErrors(registryAjv)

class PromptRegistry {
  protected prompts: Record<string, PromptDefinition> = {}
  protected promptsList: PromptDefinition[] = []
  protected userPrompts: Set<string> = new Set()
  protected unsortedMigrations: AppRequestMigration[] = []
  protected sortedMigrations: AppRequestMigration[] = []
  protected indexLookups: Record<string, (tag: string) => Promise<string> | string> = {}
  protected validators: Record<string, ValidateFunction> = {}
  protected configValidators: Record<string, ValidateFunction> = {}
  protected promptInvalidators: Record<string, InvalidatorFunction> = {}
  public indexCategories: PromptIndexDefinition[] = []
  public indexCategoryMap: Record<string, PromptIndexDefinition> = {}
  public tagCategories: PromptTagDefinition[] = []
  public reachable: PromptDefinition[] = []
  public authorizationKeys: Record<string, string[]> = {}

  register (prompt: PromptDefinition) {
    this.prompts[prompt.key] = prompt
    this.promptsList.push(prompt)
    this.unsortedMigrations.push(...(prompt.migrations ?? []))
    if (isNotEmpty(prompt.schema)) this.validators[prompt.key] = registryAjv.compile(prompt.schema)
    if (isNotEmpty(prompt.configuration?.schema)) this.configValidators[prompt.key] = registryAjv.compile(prompt.configuration.schema)
    if (prompt.invalidUponChange == null) this.promptInvalidators[prompt.key] = () => []
    else if (Array.isArray(prompt.invalidUponChange)) this.promptInvalidators[prompt.key] = () => prompt.invalidUponChange as InvalidatedResponse[]
    else this.promptInvalidators[prompt.key] = prompt.invalidUponChange
  }

  get (key: string) {
    return this.prompts[key]
  }

  keys () {
    return Object.keys(this.prompts)
  }

  list () {
    return this.promptsList
  }

  finalize () {
    const reachableKeys = new Set(requirementRegistry.reachable.flatMap(req => req.allPromptKeys))
    this.reachable = this.promptsList.filter(prompt => reachableKeys.has(prompt.key))
    for (const prompt of this.reachable) {
      for (const index of [...(prompt.tags ?? []), ...(prompt.indexes ?? [])]) {
        if ('getTags' in index) {
          const tag = index as PromptTagDefinition
          this.tagCategories.push(tag)
        }
        this.indexCategories.push(index)
        this.indexCategoryMap[index.category] = index
        this.indexLookups[index.category] = async (t: string) => {
          let label = await index.getLabel?.(t)
          if ('getTags' in index && !label) {
            const tag = index as PromptTagDefinition
            label = (await tag.getTags!(t)).find(tag => tag.value === t)?.label
          }
          if (label) await db.insert('INSERT INTO tag_labels (category, tag, label) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE label = VALUES(label)', [index.category, t, label])
          label ??= await db.getval<string>('SELECT label FROM tag_labels WHERE category = ? AND tag = ?', [index.category, t])
          label ??= t
          return label
        }
      }
    }
    for (const program of programRegistry.list()) {
      for (const stage of [undefined, ...(program.workflowStages ?? [])]) {
        for (const rKey of (stage ?? program).requirementKeys) {
          const req = requirementRegistry.get(rKey)
          if (!req) continue
          requirementRegistry.authorizationKeys[rKey] ??= []
          requirementRegistry.authorizationKeys[rKey].push(req.type)
          if (stage) requirementRegistry.authorizationKeys[rKey].push(stage.key)
          requirementRegistry.authorizationKeys[rKey].push(rKey)
          requirementRegistry.authorizationKeys[rKey].push(program.key)
          for (const promptKey of requirementRegistry.get(rKey).visiblePromptKeys) {
            this.authorizationKeys[promptKey] ??= []
            this.authorizationKeys[promptKey].push(requirementRegistry.get(rKey).type)
            if (stage) this.authorizationKeys[promptKey].push(stage.key)
            this.authorizationKeys[promptKey].push(promptKey)
            this.authorizationKeys[promptKey].push(rKey)
            this.authorizationKeys[promptKey].push(program.key)
          }
        }
      }
    }
  }

  getCategoryLabel (category: string) {
    return this.indexCategoryMap[category]?.categoryLabel ?? category
  }

  async getTagLabel (category: string, tag: string) {
    return await labelLookupCache.get({ category, value: tag })
  }

  async getAllTags (category: string, search?: string, inUse?: boolean) {
    const lcSearch = search?.toLowerCase()
    const tagCategory = this.indexCategoryMap[category]
    if (!tagCategory) return []
    if ('getTags' in tagCategory && !inUse) {
      return await tagListCache.get({ category, search: lcSearch }, (tagCategory as PromptTagDefinition).getTags!)
    } else {
      const tags = await indexListCache.get(category)
      return isNotBlank(lcSearch)
        ? tags.filter(t => t.value.toLowerCase().includes(lcSearch) || t.label.toLowerCase().includes(lcSearch))
        : tags
    }
  }

  setUserPrompt (key: string) {
    this.userPrompts.add(key)
  }

  isUserPrompt (key: string) {
    return this.userPrompts.has(key)
  }

  validate (key: string, data: any) {
    const validate = this.validators[key]
    if (!validate) return true
    return validate(data)
  }

  validateConfig (key: string, data: any) {
    const validate = this.configValidators[key]
    if (!validate) return true
    const valid = validate(data)
    if (!valid) console.error(validate.errors)
    return valid
  }

  getInvalidatedPrompts (key: string, data: any, relatedConfig: Record<string, any>) {
    const prompt = this.prompts[key]
    if (!prompt) throw new Error(`Prompt ${key} not found.`)
    return this.promptInvalidators[key](data, relatedConfig) ?? []
  }

  migrations () {
    if (this.unsortedMigrations.length !== this.sortedMigrations.length) {
      this.sortedMigrations = sortby(this.unsortedMigrations, 'id')
    }
    return this.sortedMigrations
  }

  latestMigration () {
    return this.migrations().slice(-1)[0]?.id ?? '20240101000000'
  }
}

export const promptRegistry = new PromptRegistry()
