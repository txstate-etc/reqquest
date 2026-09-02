import path from 'node:path'
import type ts from 'typescript'
import { findPromptExports } from './promptExports.js'
import { findRequirementExports } from './requirementExports.js'
import { findProgramExports } from './programExports.js'
import type { DefinitionExport } from './definitionExports.js'
import { emitKeyDeclarations, keyDeclarationsAreCurrent } from './emitKeys.js'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

/**
 * Prints the definitions found in a project.
 *
 *   node dist/analysis/cli.js <tsconfig-or-directory> [--kind prompt|requirement]
 *
 * `--paths <specifier>=<file>` maps a module for projects that cannot resolve it themselves, which
 * is how this runs against demos/ outside the container:
 *
 *   node dist/analysis/cli.js ../demos --paths '@reqquest/api=../api/src/index.ts'
 *
 * Only the two kinds are offered here. An arbitrary marker interface is still reachable
 * programmatically through `findDefinitionExports`.
 */
interface ScanOptions { project: string, compilerOptions?: ts.CompilerOptions }
interface ScanResult { found: DefinitionExport[], markerFile: string, label: string }

const kinds: Record<string, (options: ScanOptions) => ScanResult> = {
  prompt: options => {
    const { prompts, markerFile } = findPromptExports(options)
    return { found: prompts, markerFile, label: 'PromptDefinition' }
  },
  requirement: options => {
    const { requirements, markerFile } = findRequirementExports(options)
    return { found: requirements, markerFile, label: 'RequirementDefinition' }
  },
  program: options => {
    const { programs, markerFile } = findProgramExports(options)
    return { found: programs, markerFile, label: 'ProgramDefinition' }
  }
}

function main (argv: string[]) {
  const args = [...argv]
  const flag = (name: string) => {
    const i = args.indexOf(name)
    if (i === -1) return undefined
    return args.splice(i, 2)[1]
  }
  const emitTo = flag('--emit-keys')
  const moduleName = flag('--module')
  const groupsFlag = flag('--groups')
  const checkTo = flag('--check-keys')
  const kind = flag('--kind') ?? 'prompt'
  const pathsFlag = flag('--paths')
  const project = args[0]
  if (project == null || !(kind in kinds)) {
    console.error(`usage: node dist/analysis/cli.js <tsconfig-or-directory> [--kind ${Object.keys(kinds).join('|')}] [--emit-keys <file>] [--check-keys <file>] [--module <name>] [--groups Name=prefix,...] [--paths <specifier>=<file>]`)
    process.exit(2)
  }

  const compilerOptions = pathsFlag != null ? pathsFromFlag(pathsFlag) : undefined
  const emitOptions = { project, compilerOptions, moduleName, groups: groupsFromFlag(groupsFlag) }
  if (emitTo != null) {
    // Skip the write when nothing changed. This runs on every hot reload, and rewriting a file
    // inside the watched tree is how you get a restart loop - nodemon's `ignore` is the real guard,
    // this just avoids pointless churn.
    if (existsSync(emitTo) && keyDeclarationsAreCurrent(readFileSync(emitTo, 'utf8'), emitOptions)) {
      console.log(`${emitTo} unchanged`)
      return
    }
    writeFileSync(emitTo, emitKeyDeclarations(emitOptions))
    console.log(`wrote ${emitTo}`)
    return
  }
  if (checkTo != null) {
    if (!existsSync(checkTo)) {
      console.error(`${checkTo} does not exist. Run with --emit-keys to create it.`)
      process.exit(1)
    }
    if (keyDeclarationsAreCurrent(readFileSync(checkTo, 'utf8'), emitOptions)) {
      console.log(`${checkTo} is up to date.`)
      return
    }
    console.error(`${checkTo} is stale - a definition was added, removed, renamed, or re-keyed. Re-run with --emit-keys.`)
    process.exit(1)
  }
  const { found, markerFile, label } = kinds[kind as keyof typeof kinds]({ project, compilerOptions })

  console.log(`${found.length} ${label} export${found.length === 1 ? '' : 's'}`)
  console.log(`marker resolved from ${markerFile}\n`)

  let currentFile: string | undefined
  for (const definition of found as DefinitionExport[]) {
    if (definition.file !== currentFile) {
      currentFile = definition.file
      console.log(path.relative(process.cwd(), currentFile))
    }
    // the key is worth showing next to the name: they are independent today, and a difference
    // between them is exactly the kind of thing worth noticing
    const key = definition.key ?? '(not a literal)'
    console.log(`  ${definition.name}${key === definition.name ? '' : `  key=${key}`}`)
  }
}

/** named path prefixes for per-subset key aliases. */
function groupsFromFlag (flag: string | undefined) {
  if (flag == null) return undefined
  return Object.fromEntries(flag.split(',').map(pair => {
    const [name, prefix] = pair.split('=')
    if (name == null || prefix == null) throw new Error(`--groups expects Name=prefix pairs, got '${pair}'`)
    return [name, prefix]
  }))
}

function pathsFromFlag (flag: string) {
  const [specifier, target] = flag.split('=')
  if (specifier == null || target == null) throw new Error(`--paths expects <specifier>=<file>, got '${flag}'`)
  return { baseUrl: process.cwd(), paths: { [specifier]: [target] } }
}

main(process.argv.slice(2))
