import type ts from 'typescript'
import { findDefinitionExports, type DefinitionExport } from './definitionExports.js'

/**
 * A prompt definition found in a project's source.
 */
export type PromptExport = DefinitionExport

export interface FindPromptExportsOptions {
  /**
   * Path to a tsconfig.json, or to a directory containing one. Every file the tsconfig includes is
   * analyzed, so a prompt declared somewhere unexpected is still found.
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
  /** The interface that marks a prompt. Defaults to 'PromptDefinition'. */
  typeName?: string
}

export interface FindPromptExportsResult {
  prompts: PromptExport[]
  /** The file the marker interface was resolved from, so callers can confirm it found the right one. */
  markerFile: string
}

/**
 * Finds every export in a TypeScript project whose type is `PromptDefinition`.
 *
 * See `findDefinitionExports` for how matching works and what it deliberately does not find.
 */
export function findPromptExports (options: FindPromptExportsOptions): FindPromptExportsResult {
  const { definitions, markerFile } = findDefinitionExports({
    ...options,
    typeName: options.typeName ?? 'PromptDefinition'
  })
  return { prompts: definitions, markerFile }
}
