/**
 * Downstream projects augment this interface to teach the UI which keys their API registers. Once
 * augmented, `UIConfig` rejects a component registered under an unknown key, and requires one for
 * every prompt the API defines.
 *
 * This is a separate interface from the one in '@reqquest/api' by necessity: `@reqquest/ui` cannot
 * depend on the API package without pulling fastify, mysql2 and type-graphql into a browser build.
 * The generated declaration is plain string literals with no dependencies, so the same analyzer can
 * emit one file augmenting each package:
 *
 * ```
 * node node_modules/@reqquest/api/dist/analysis/cli.js <api-project> \
 *   --emit-keys src/keys.generated.d.ts --module '@reqquest/ui'
 * ```
 *
 * ```ts
 * // src/keys.generated.d.ts - GENERATED, commit it
 * export {}
 * declare module '@reqquest/ui' {
 *   interface ReqQuestKeys {
 *     prompts: 'state_residence_prompt' | 'ssn_value_prompt'
 *     requirements: 'state_residence_req'
 *     programs: 'adopt_a_pet_program'
 *   }
 * }
 * ```
 *
 * The `export {}` is load-bearing - without a top-level import or export the file is a global script
 * and `declare module` REPLACES '@reqquest/ui' rather than augmenting it - and the file has to fall
 * inside your tsconfig `include`, or it augments nothing and keys silently stay `string`.
 *
 * Regenerate when definitions change and gate it with `--check-keys`; a stale declaration offers keys
 * the API no longer has.
 *
 * Leaving a slot unaugmented degrades its key type to `string`, so augmenting is entirely optional.
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
