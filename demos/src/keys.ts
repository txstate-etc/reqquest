import type { ComplexPromptKey, ComplexRequirementKey } from './complex/definitions/keys.js'
import type { DefaultPromptKey, DefaultRequirementKey } from './default/definitions/keys.js'
import type { RcPromptKey, RcRequirementKey } from './rc/definitions/keys.js'
import type { SimplePromptKey, SimpleRequirementKey } from './simple/definitions/keys.js'

/**
 * Teaches ReqQuest the keys this project registers, which is what makes `promptKeys`,
 * `requirementKeys`, `promptKeysNoDisplay` and `invalidUponChange` autocomplete and reject typos.
 *
 * The slots reference aliases imported from elsewhere rather than naming the barrels inline. That
 * indirection is required, not stylistic - see the note on `ReqQuestKeys`.
 *
 * NOTE* this repo is an unusual case because all demo instances share one TypeScript project but are
 * served one at a time, so these unions span all of them and a key from one demo type-checks inside
 * another. Only one instance is ever registered at runtime, and the registry still rejects a
 * cross-demo reference then. A real downstream project has a single instance and would write
 * simply `prompts: PromptKey, requirements: RequirementKey`.
 */
declare module '@reqquest/api' {
  interface ReqQuestKeys {
    prompts: ComplexPromptKey | DefaultPromptKey | RcPromptKey | SimplePromptKey
    requirements: ComplexRequirementKey | DefaultRequirementKey | RcRequirementKey | SimpleRequirementKey
  }
}
