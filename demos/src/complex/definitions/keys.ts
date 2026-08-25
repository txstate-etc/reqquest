import type { KeysOfModule } from '@reqquest/api'

/**
 * The keys this demo registers, derived from the names its definitions are exported under - or from
 * an explicit `key` where one is declared as an intersection so the literal survives into the type.
 *
 * These must live in their own module. Referencing the barrels from inside the `declare module`
 * block in ../../keys.ts would be circular, since the barrels import '@reqquest/api' themselves,
 * and would make that whole module resolve as having no exports.
 */
export type ComplexPromptKey = KeysOfModule<typeof import('./prompts/index.js')>
export type ComplexRequirementKey = KeysOfModule<typeof import('./requirements/index.js')>
