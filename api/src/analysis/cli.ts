import path from 'node:path'
import type ts from 'typescript'
import { findPromptExports } from './promptExports.js'
import { findRequirementExports } from './requirementExports.js'
import type { DefinitionExport } from './definitionExports.js'

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
  }
}

function main (argv: string[]) {
  const args = [...argv]
  const flag = (name: string) => {
    const i = args.indexOf(name)
    if (i === -1) return undefined
    return args.splice(i, 2)[1]
  }
  const kind = flag('--kind') ?? 'prompt'
  const pathsFlag = flag('--paths')
  const project = args[0]
  if (project == null || !(kind in kinds)) {
    console.error(`usage: node dist/analysis/cli.js <tsconfig-or-directory> [--kind ${Object.keys(kinds).join('|')}] [--paths <specifier>=<file>]`)
    process.exit(2)
  }

  const compilerOptions = pathsFlag != null ? pathsFromFlag(pathsFlag) : undefined
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

function pathsFromFlag (flag: string) {
  const [specifier, target] = flag.split('=')
  if (specifier == null || target == null) throw new Error(`--paths expects <specifier>=<file>, got '${flag}'`)
  return { baseUrl: process.cwd(), paths: { [specifier]: [target] } }
}

main(process.argv.slice(2))
