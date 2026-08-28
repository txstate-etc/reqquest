import type ts from 'typescript'
import { findDefinitionExports, type DefinitionExport } from './definitionExports.js'

/**
 * A requirement definition found in a project's source.
 *
 * Deliberately the same shape as `PromptExport`. Requirements do carry more that could be reported -
 * their `type` phase, and the prompts they depend on across `promptKeys`, `promptKeysAnyOrder`, and
 * `promptKeysNoDisplay` - but nothing consumes this yet, so there is no way to know which shape a
 * consumer wants. Those are straightforward to add once something needs them.
 */
export type RequirementExport = DefinitionExport

export interface FindRequirementExportsOptions {
  /**
   * Path to a tsconfig.json, or to a directory containing one. Every file the tsconfig includes is
   * analyzed, so a requirement declared somewhere unexpected is still found.
   */
  project: string
  /**
   * Compiler options merged over the tsconfig's own. Useful when the project cannot resolve
   * `@reqquest/api` on its own - for example mapping it to the API's source with `paths`.
   */
  compilerOptions?: ts.CompilerOptions
  /**
   * The module that declares the marker interface. Defaults to '@reqquest/api'. It has to be
   * resolvable from the project, since matching is by symbol identity rather than by name.
   */
  moduleSpecifier?: string
  /** The interface that marks a requirement. Defaults to 'RequirementDefinition'. */
  typeName?: string
}

export interface FindRequirementExportsResult {
  requirements: RequirementExport[]
  /** The file the marker interface was resolved from, so callers can confirm it found the right one. */
  markerFile: string
}

/**
 * Finds every export in a TypeScript project whose type is `RequirementDefinition`.
 *
 * See `findDefinitionExports` for how matching works and what it deliberately does not find.
 */
export function findRequirementExports (options: FindRequirementExportsOptions): FindRequirementExportsResult {
  const { definitions, markerFile } = findDefinitionExports({
    ...options,
    typeName: options.typeName ?? 'RequirementDefinition'
  })
  return { requirements: definitions, markerFile }
}
