/**
 * Downstream projects augment this interface to teach ReqQuest which keys they register. Once
 * augmented, every place a key is referenced - `promptKeys`, `requirementKeys`,
 * `promptKeysNoDisplay`, `invalidUponChange` - autocompletes and rejects typos at compile time.
 *
 * One file is all it takes. Name a type alias per barrel with `KeysOfModule`, then reference those
 * aliases from the slots:
 *
 * ```ts
 * // keys.ts - import it once from your entry point
 * import type { KeysOfModule } from '@reqquest/api'
 *
 * type PromptKey = KeysOfModule<typeof import('./definitions/prompts/index.js')>
 * type RequirementKey = KeysOfModule<typeof import('./definitions/requirements/index.js')>
 * type ProgramKey = KeysOfModule<typeof import('./definitions/programs.js')>
 *
 * declare module '@reqquest/api' {
 *   interface ReqQuestKeys {
 *     prompts: PromptKey
 *     requirements: RequirementKey
 *     programs: ProgramKey
 *   }
 * }
 * ```
 *
 * IMPORTANT: reach the barrel through a **named type alias**. Writing
 * `typeof import('./definitions/prompts/index.js')` inline inside the block below instead is
 * circular - those barrels import '@reqquest/api' themselves, so augmenting it with a type that
 * depends on them makes the entire module resolve as having no exports, and every import from
 * '@reqquest/api' across the project fails at once with "has no exported member". The alias may live
 * in this same file; it just may not be inlined into the slot.
 *
 * Leaving a slot unaugmented degrades its key type to `string`, which is how ReqQuest behaved
 * before this existed, so augmenting is entirely optional.
 */
export interface ReqQuestKeys {}

/**
 * Resolves the key a definition registers under, mirroring what the registry does at runtime: the
 * name it is registered under, unless it carries a `key` whose type is a string literal.
 *
 * Note that an explicit `key` only survives into the type when the definition is declared so that
 * the literal is preserved, which means an intersection:
 *
 * ```ts
 * export const legacy_req: RequirementDefinition & { key: 'legacy.req-v1' } = { key: 'legacy.req-v1', ... }
 * ```
 *
 * A plain annotation (`const x: RequirementDefinition = { key: 'other' }`) widens `key` to
 * `string | undefined` and the literal is lost, so the export name is used here while the runtime
 * uses the declared key. Run the analyzer's `--audit` mode to find any definition where those two
 * disagree.
 */
export type KeyOf<T, Name> = T extends { key: infer K extends string }
  // a `key` that is not a literal tells us nothing, so fall back to the name rather than letting a
  // single `string` swallow the whole union and silently disable autocomplete everywhere
  ? ([string] extends [K] ? Name & string : K)
  : Name & string

/**
 * The union of keys a definition barrel registers.
 *
 * ```ts
 * export type PromptKey = KeysOfModule<typeof import('./prompts/index.js')>
 * ```
 */
export type KeysOfModule<M> = Extract<{ [N in keyof M]: KeyOf<M[N], N> }[keyof M], string>

type Slot<S extends keyof any> = ReqQuestKeys extends Record<S, infer T> ? T : never
type SlotUnion<S extends keyof any> = [Slot<S>] extends [never] ? string : Extract<Slot<S>, string>

/** Every prompt key in this application, or `string` when the `prompts` slot is not augmented. */
export type PromptKey = SlotUnion<'prompts'>
/** Every requirement key in this application, or `string` when the `requirements` slot is not augmented. */
export type RequirementKey = SlotUnion<'requirements'>
/** Every program key in this application, or `string` when the `programs` slot is not augmented. */
export type ProgramKey = SlotUnion<'programs'>
