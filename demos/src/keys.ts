import type { KeysOfModule } from '@reqquest/api'

/**
 * Teaches ReqQuest the keys this project registers, which is what makes `promptKeys`,
 * `requirementKeys`, `promptKeysNoDisplay` and `invalidUponChange` autocomplete and reject typos.
 *
 * Each barrel is reached through a named type alias rather than being inlined into a slot below.
 * That is required: the barrels import '@reqquest/api' themselves, so inlining `typeof import(...)`
 * into the augmentation is circular and makes the whole module resolve as having no exports. The
 * aliases may live here in the same file - they just may not be inlined.
 *
 * NOTE: this repo is an unusual case. Five demo instances share one TypeScript project but are
 * served one at a time, so these unions span all of them and a key from one demo type-checks inside
 * another. Only one instance is ever registered at runtime, and the registry still rejects a
 * cross-demo reference then. A real downstream project has a single instance and needs only three
 * aliases and the block at the bottom.
 */
type ComplexPromptKey = KeysOfModule<typeof import('./complex/definitions/prompts/index.js')>
type DefaultPromptKey = KeysOfModule<typeof import('./default/definitions/prompts/index.js')>
type RcPromptKey = KeysOfModule<typeof import('./rc/definitions/prompts/index.js')>
type SimplePromptKey = KeysOfModule<typeof import('./simple/definitions/prompts/index.js')>

type ComplexRequirementKey = KeysOfModule<typeof import('./complex/definitions/requirements/index.js')>
type DefaultRequirementKey = KeysOfModule<typeof import('./default/definitions/requirements/index.js')>
type RcRequirementKey = KeysOfModule<typeof import('./rc/definitions/requirements/index.js')>
type SimpleRequirementKey = KeysOfModule<typeof import('./simple/definitions/requirements/index.js')>

// programs are gathered into one exported ordered object, so the union comes off that object's keys
type ComplexProgramKey = keyof typeof import('./complex/definitions/programs.js')['complexPrograms']
type DefaultProgramKey = keyof typeof import('./default/definitions/programs.js')['defaultPrograms']
type RcProgramKey = keyof typeof import('./rc/definitions/programs.js')['rcPrograms']
type SimpleProgramKey = keyof typeof import('./simple/definitions/programs.js')['simplePrograms']

declare module '@reqquest/api' {
  interface ReqQuestKeys {
    prompts: ComplexPromptKey | DefaultPromptKey | RcPromptKey | SimplePromptKey
    requirements: ComplexRequirementKey | DefaultRequirementKey | RcRequirementKey | SimpleRequirementKey
    programs: ComplexProgramKey | DefaultProgramKey | RcProgramKey | SimpleProgramKey
  }
}
