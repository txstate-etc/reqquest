/**
 * Downstream projects augment this interface to teach ReqQuest which keys they register. Once
 * augmented, every place a key is referenced - `promptKeys`, `requirementKeys`,
 * `promptKeysNoDisplay`, `invalidUponChange` - autocompletes and rejects typos at compile time.
 *
 * The augmentation is generated rather than hand-written. Point the analyzer at your project and it
 * emits a declaration listing every key you register:
 *
 * ```
 * node node_modules/@reqquest/api/dist/analysis/cli.js . --emit-keys src/keys.generated.d.ts
 * ```
 *
 * ```ts
 * // src/keys.generated.d.ts - GENERATED, commit it
 * export {}
 * declare module '@reqquest/api' {
 *   interface ReqQuestKeys {
 *     prompts: 'state_residence_prompt' | 'ssn_value_prompt'
 *     requirements: 'state_residence_req'
 *     programs: 'adopt_a_pet_program'
 *   }
 * }
 * ```
 *
 * Two things about that file are easy to get wrong:
 *
 * - **The `export {}` is load-bearing.** Without a top-level import or export the file is a global
 *   script, and `declare module` then REPLACES '@reqquest/api' instead of augmenting it - every
 *   import from the package fails at once with "has no exported member".
 * - **It has to be inside your tsconfig `include`.** A declaration the program never loads augments
 *   nothing, and the failure is silent: keys simply stay `string`.
 *
 * Because the keys are plain literals, nothing needs to read a key back out of a definition's type.
 * That is what lets an explicit `key` be written once, with an ordinary annotation:
 *
 * ```ts
 * export const legacy_prompt: PromptDefinition = { key: 'legacy.prompt-v1', title: '...' }
 * ```
 *
 * The tradeoff is that the file has to be regenerated when definitions change, and a stale one
 * offers keys that no longer exist. Gate it in CI with `--check-keys`, which exits non-zero when the
 * committed file no longer matches the project.
 *
 * Wire `--emit-keys` into your dev watcher too, before the build step, or adding a prompt and
 * referencing it in the same save fails to compile on a key that is perfectly valid. Exclude the
 * generated file from the watcher while you are at it - writing it back into a watched tree
 * retriggers the watcher, which regenerates, which retriggers it.
 *
 * Leaving a slot unaugmented degrades its key type to `string`, which is how ReqQuest behaved before
 * this existed, so augmenting is entirely optional.
 */
export interface ReqQuestKeys {}

type Slot<S extends keyof any> = ReqQuestKeys extends Record<S, infer T> ? T : never
type SlotUnion<S extends keyof any> = [Slot<S>] extends [never] ? string : Extract<Slot<S>, string>

/** Every prompt key in this application, or `string` when the `prompts` slot is not augmented. */
export type PromptKey = SlotUnion<'prompts'>
/** Every requirement key in this application, or `string` when the `requirements` slot is not augmented. */
export type RequirementKey = SlotUnion<'requirements'>
/** Every program key in this application, or `string` when the `programs` slot is not augmented. */
export type ProgramKey = SlotUnion<'programs'>
