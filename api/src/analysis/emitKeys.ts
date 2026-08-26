import path from 'node:path'
import { findManyDefinitionExports, type DefinitionExport, type FindDefinitionExportsOptions } from './definitionExports.js'

export interface EmitKeyDeclarationsOptions extends Omit<FindDefinitionExportsOptions, 'typeName'> {
  /** Marker interface per slot. Defaults to the three ReqQuest definition kinds. */
  slots?: Record<string, string>
  /**
   * Which module to augment. Defaults to '@reqquest/api'. Emit a second file with '@reqquest/ui' to
   * give the UI the same keys - it cannot depend on the API package, but a declaration of plain
   * string literals has no dependencies at all.
   */
  moduleName?: string
  /**
   * Optional named subsets, each a path prefix relative to the project. Emits an exported alias per
   * group per slot, e.g. `SimplePromptKey`, alongside the full union.
   *
   * For a project holding one application this is unnecessary - the full union already describes it.
   * It exists for a project holding several, like this repo's demos, where a consumer needs to say
   * "these are the keys of *this* instance" to get an exhaustive check against the right subset.
   *
   * Costs nothing extra: definitions already carry the file they were declared in, so the groups are
   * partitioned out of the single scan rather than rescanned.
   */
  groups?: Record<string, string>
}

// Workflow stages carry keys too but are deliberately not a slot: they are declared inline inside a
// program, may be shared between programs, and nothing references a stage key. See WorkflowStage.key.
const defaultSlots = {
  prompts: 'PromptDefinition',
  requirements: 'RequirementDefinition',
  programs: 'ProgramDefinition'
}

/**
 * Renders a `declare module '@reqquest/api'` augmentation listing every key a project registers, as
 * plain string literals.
 *
 * This is the alternative to deriving the union from the definitions' own types. Because the result
 * is literals, it does not depend on the definitions at all, which buys three things the type-level
 * derivation cannot have:
 *
 * - a definition may state an explicit `key` with a plain annotation, since nothing needs to read
 *   the literal back out of its type. No intersection, no `as const`, no restating the key.
 * - no inference cycle. Deriving the union from types means `PromptDefinition` -> `PromptKey` ->
 *   the definitions -> `PromptDefinition`, which TypeScript rejects as circular the moment a
 *   definition's type has to be inferred rather than stated.
 * - it can be consumed by a package that cannot depend on '@reqquest/api' - notably '@reqquest/ui'.
 *
 * The cost is that it has to be regenerated. Pair it with `keyDeclarationsAreCurrent` in CI so a
 * stale file fails loudly rather than silently offering keys that no longer exist.
 */
export function emitKeyDeclarations (options: EmitKeyDeclarationsOptions): string {
  const slots = options.slots ?? defaultSlots
  const moduleName = options.moduleName ?? '@reqquest/api'
  const lines: string[] = [
    '/* eslint-disable */',
    '// GENERATED - do not edit. Re-run the analyzer\'s --emit-keys after adding, removing, or',
    '// renaming a definition, or changing an explicit `key`.',
    '//',
    '// The `export {}` is load-bearing: without a top-level import or export this file would be a',
    `// global script, and \`declare module\` would REPLACE '${moduleName}' instead of augmenting it -`,
    '// every import from the package would then fail with "has no exported member".',
    'export {}',
    ''
  ]
  // one program for all three markers - this runs on every hot reload, so three type-checks of the
  // same sources is not affordable
  const found = findManyDefinitionExports({ ...options, typeNames: Object.values(slots) })
  const keysOf = (definitions: DefinitionExport[]) =>
    // effectiveKey is the key the registry actually uses: the declared one, or else the name
    [...new Set(definitions.map(d => d.effectiveKey))].sort()

  for (const [groupName, prefix] of Object.entries(options.groups ?? {})) {
    const root = path.resolve(options.project, prefix)
    for (const [slot, typeName] of Object.entries(slots)) {
      const within = found[typeName].definitions.filter(d => path.resolve(d.file).startsWith(root))
      lines.push(`export type ${groupName}${singular(slot)}Key =`, ...union(keysOf(within), '  '), '')
    }
  }

  lines.push(`declare module '${moduleName}' {`, '  interface ReqQuestKeys {')
  for (const [slot, typeName] of Object.entries(slots)) {
    lines.push(`    ${slot}:`, ...union(keysOf(found[typeName].definitions), '      '))
  }
  lines.push('  }', '}', '')
  return lines.join('\n')
}

const union = (keys: string[], indent: string) =>
  keys.length === 0 ? [`${indent}never`] : keys.map(k => `${indent}| '${k}'`)

/** `prompts` -> `Prompt`, so a group alias reads `SimplePromptKey`. */
const singular = (slot: string) => slot.charAt(0).toUpperCase() + slot.slice(1).replace(/s$/, '')

/**
 * Whether a previously emitted file still matches the project. Use it as a build gate: unlike the
 * type-level derivation, staleness here is a detectable condition rather than a silent wrong answer.
 */
export function keyDeclarationsAreCurrent (existing: string, options: EmitKeyDeclarationsOptions) {
  return existing.trim() === emitKeyDeclarations(options).trim()
}
