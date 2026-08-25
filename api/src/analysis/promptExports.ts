import ts from 'typescript'
import path from 'node:path'

/**
 * A prompt definition found in a project's source.
 */
export interface PromptExport {
  /**
   * The name the definition is exported as. This is the identifier on the `export const`, which is
   * also the name it carries out through an `export *` barrel.
   */
  name: string
  /**
   * The `key` the definition declares, when it is written as a plain string literal.
   *
   * Read from the object literal's own `key` property, so a `key` belonging to something nested -
   * a `workflowStages` entry, a `promptKeysNoDisplay` entry - is never mistaken for this one. It is
   * undefined when the key is computed, or when the definition has no object literal initializer.
   */
  key?: string
  /** Absolute path of the file declaring it. */
  file: string
  /** 1-based line of the declaration, for reporting. */
  line: number
}

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
  /** The interface that marks a definition. Defaults to 'PromptDefinition'. */
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
 * Identification is by type, not by naming convention or file location: the marker interface is
 * resolved to a single symbol and each candidate's type is compared against it. That means a
 * generic instantiation (`PromptDefinition<MyData>`), an intersection
 * (`PromptDefinition & { key: 'x' }`), and a type alias for either are all recognised, while a
 * same-named interface from somewhere else is not.
 */
export function findPromptExports (options: FindPromptExportsOptions): FindPromptExportsResult {
  const { program, checker, rootFileNames, configPath } = createProgramFor(options)
  const typeName = options.typeName ?? 'PromptDefinition'
  const moduleSpecifier = options.moduleSpecifier ?? '@reqquest/api'

  const marker = resolveMarker(program, checker, rootFileNames, configPath, moduleSpecifier, typeName)

  // Only the project's own files. Walking declarations rather than module exports means a prompt
  // re-exported through several barrels is reported once, at the place it is declared.
  const projectFiles = new Set(rootFileNames.map(f => path.resolve(f)))
  const prompts: PromptExport[] = []
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue
    if (!projectFiles.has(path.resolve(sourceFile.fileName))) continue
    for (const statement of sourceFile.statements) {
      if (!ts.isVariableStatement(statement)) continue
      if (!statement.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) continue
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue
        if (!isMarkedType(checker.getTypeAtLocation(declaration.name), marker.symbol)) continue
        prompts.push({
          name: declaration.name.text,
          key: declaredKey(declaration),
          file: sourceFile.fileName,
          line: sourceFile.getLineAndCharacterOfPosition(declaration.getStart(sourceFile)).line + 1
        })
      }
    }
  }
  return { prompts, markerFile: marker.file }
}

function createProgramFor (options: FindPromptExportsOptions) {
  const configPath = ts.sys.directoryExists(options.project)
    ? path.join(options.project, 'tsconfig.json')
    : options.project
  if (!ts.sys.fileExists(configPath)) throw new Error(`No tsconfig found at ${configPath}.`)

  const read = ts.readConfigFile(configPath, ts.sys.readFile)
  if (read.error) throw new Error(`Could not read ${configPath}: ${formatDiagnostic(read.error)}`)

  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, path.dirname(configPath))
  if (parsed.errors.length > 0) throw new Error(`Could not parse ${configPath}: ${parsed.errors.map(formatDiagnostic).join('; ')}`)

  const compilerOptions: ts.CompilerOptions = { ...parsed.options, ...options.compilerOptions, noEmit: true }
  const program = ts.createProgram(parsed.fileNames, compilerOptions)
  return { program, checker: program.getTypeChecker(), rootFileNames: parsed.fileNames, configPath }
}

/**
 * Resolves the marker interface to one symbol.
 *
 * Deliberately does not fall back to matching by name. If `@reqquest/api` cannot be resolved the
 * interface would degrade to an error type, every comparison would quietly fail, and the result
 * would be an empty list that looks like a legitimate answer - so this fails loudly instead.
 */
function resolveMarker (program: ts.Program, checker: ts.TypeChecker, rootFileNames: string[], configPath: string, moduleSpecifier: string, typeName: string) {
  const containingFile = rootFileNames[0] ?? configPath
  const resolved = ts.resolveModuleName(moduleSpecifier, containingFile, program.getCompilerOptions(), ts.sys).resolvedModule?.resolvedFileName
  if (resolved == null) {
    throw new Error(`Could not resolve '${moduleSpecifier}' from ${containingFile}. Matching is by symbol identity, so the module declaring ${typeName} has to be resolvable - install the project's dependencies, or pass compilerOptions.paths to point at its source.`)
  }
  const sourceFile = program.getSourceFile(resolved)
  if (sourceFile == null) {
    throw new Error(`'${moduleSpecifier}' resolved to ${resolved}, but that file is not part of the project, so ${typeName} cannot be identified.`)
  }
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  if (moduleSymbol == null) throw new Error(`${resolved} is not a module.`)

  const exported = checker.getExportsOfModule(moduleSymbol).find(s => s.getName() === typeName)
  if (exported == null) throw new Error(`'${moduleSpecifier}' (${resolved}) does not export ${typeName}.`)

  const symbol = unalias(checker, exported)
  if (!symbol.declarations?.some(ts.isInterfaceDeclaration)) {
    throw new Error(`${typeName} exported from '${moduleSpecifier}' is not an interface.`)
  }
  return { symbol, file: resolved }
}

const unalias = (checker: ts.TypeChecker, symbol: ts.Symbol) =>
  (symbol.flags & ts.SymbolFlags.Alias) !== 0 ? checker.getAliasedSymbol(symbol) : symbol

/**
 * Whether a type is the marker interface, one of its generic instantiations, or an intersection
 * containing either.
 */
function isMarkedType (type: ts.Type, marker: ts.Symbol): boolean {
  if (type.aliasSymbol === marker || type.symbol === marker) return true
  const target = (type as ts.TypeReference).target
  if (target != null && target !== type && target.symbol === marker) return true
  // an intersection is a prompt if any constituent is; a union only if every one is, since a value
  // typed `PromptDefinition | something else` is not reliably a prompt
  if (type.isIntersection()) return type.types.some(t => isMarkedType(t, marker))
  if (type.isUnion()) return type.types.every(t => isMarkedType(t, marker))
  return false
}

/** Reads the `key` property off the declaration's own object literal, by AST rather than by text. */
function declaredKey (declaration: ts.VariableDeclaration): string | undefined {
  const initializer = declaration.initializer
  if (initializer == null || !ts.isObjectLiteralExpression(initializer)) return undefined
  for (const property of initializer.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    const name = property.name
    const isKey = (ts.isIdentifier(name) || ts.isStringLiteral(name)) && name.text === 'key'
    if (!isKey) continue
    if (ts.isStringLiteralLike(property.initializer)) return property.initializer.text
    return undefined
  }
  return undefined
}

const formatDiagnostic = (d: ts.Diagnostic) => ts.flattenDiagnosticMessageText(d.messageText, ' ')
