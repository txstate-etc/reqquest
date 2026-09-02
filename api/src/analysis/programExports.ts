import type ts from 'typescript'
import { findDefinitionExports, type DefinitionExport } from './definitionExports.js'

/**
 * A program definition found in a project's source.
 *
 * Programs are typically declared as unexported consts gathered into one exported ordered object,
 * so these are usually found as members of that object rather than as exports in their own right.
 */
export type ProgramExport = DefinitionExport

export interface FindProgramExportsOptions {
  /** Path to a tsconfig.json, or to a directory containing one. */
  project: string
  /**
   * Compiler options merged over the tsconfig's own. Useful when the project cannot resolve
   * `@reqquest/api` on its own - for example mapping it to the API's source with `paths`.
   */
  compilerOptions?: ts.CompilerOptions
  /** The module that declares the marker interface. Defaults to '@reqquest/api'. */
  moduleSpecifier?: string
  /** The interface that marks a program. Defaults to 'ProgramDefinition'. */
  typeName?: string
}

export interface FindProgramExportsResult {
  programs: ProgramExport[]
  /** The file the marker interface was resolved from, so callers can confirm it found the right one. */
  markerFile: string
}

/**
 * Finds every program definition in a TypeScript project.
 *
 * See `findDefinitionExports` for how matching works and what it deliberately does not find.
 */
export function findProgramExports (options: FindProgramExportsOptions): FindProgramExportsResult {
  const { definitions, markerFile } = findDefinitionExports({
    ...options,
    typeName: options.typeName ?? 'ProgramDefinition'
  })
  return { programs: definitions, markerFile }
}
