import { findManyDefinitionExports, type FindDefinitionExportsOptions } from './definitionExports.js'

export interface EmitKeyDeclarationsOptions extends Omit<FindDefinitionExportsOptions, 'typeName'> {
  /** Marker interface per slot. Defaults to the three ReqQuest definition kinds. */
  slots?: Record<string, string>
}

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
  const lines: string[] = [
    '/* eslint-disable */',
    '// GENERATED - do not edit. Re-run the analyzer\'s --emit-keys after adding, removing, or',
    '// renaming a definition, or changing an explicit `key`.',
    '//',
    '// The `export {}` is load-bearing: without a top-level import or export this file would be a',
    '// global script, and `declare module` would REPLACE \'@reqquest/api\' instead of augmenting it -',
    '// every import from the package would then fail with "has no exported member".',
    'export {}',
    '',
    "declare module '@reqquest/api' {",
    '  interface ReqQuestKeys {'
  ]
  // one program for all three markers - this runs on every hot reload, so three type-checks of the
  // same sources is not affordable
  const found = findManyDefinitionExports({ ...options, typeNames: Object.values(slots) })
  for (const [slot, typeName] of Object.entries(slots)) {
    // effectiveKey is the key the registry actually uses: the declared one, or else the name
    const keys = [...new Set(found[typeName].definitions.map(d => d.effectiveKey))].sort()
    lines.push(`    ${slot}:`)
    lines.push(...(keys.length === 0 ? ['      never'] : keys.map(k => `      | '${k}'`)))
  }
  lines.push('  }', '}', '')
  return lines.join('\n')
}

/**
 * Whether a previously emitted file still matches the project. Use it as a build gate: unlike the
 * type-level derivation, staleness here is a detectable condition rather than a silent wrong answer.
 */
export function keyDeclarationsAreCurrent (existing: string, options: EmitKeyDeclarationsOptions) {
  return existing.trim() === emitKeyDeclarations(options).trim()
}
