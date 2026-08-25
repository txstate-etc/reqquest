import path from 'node:path'
import type ts from 'typescript'
import { findPromptExports } from './promptExports.js'
import { findRequirementExports } from './requirementExports.js'
import { auditDefinitionKeys, type DefinitionExport } from './definitionExports.js'

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
  const auditIndex = args.indexOf('--audit')
  const audit = auditIndex !== -1
  if (audit) args.splice(auditIndex, 1)
  const kind = flag('--kind') ?? 'prompt'
  const pathsFlag = flag('--paths')
  const project = args[0]
  if (project == null || !(kind in kinds)) {
    console.error(`usage: node dist/analysis/cli.js <tsconfig-or-directory> [--kind ${Object.keys(kinds).join('|')}] [--audit] [--paths <specifier>=<file>]`)
    process.exit(2)
  }

  const compilerOptions = pathsFlag != null ? pathsFromFlag(pathsFlag) : undefined
  if (audit) {
    runAudit({ project, compilerOptions })
    return
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

/**
 * Reports definitions that register under one key while the type system advertises another
 */
function runAudit (options: ScanOptions) {
  let total = 0
  for (const typeName of ['PromptDefinition', 'RequirementDefinition']) {
    const mismatches = auditDefinitionKeys({ ...options, typeName })
    total += mismatches.length
    for (const d of mismatches) {
      console.error(`${path.relative(process.cwd(), d.file)}:${d.line}  ${typeName} \`${d.name}\``)
      console.error(`    registers as    ${d.effectiveKey}`)
      console.error(`    types infer     ${d.inferredKey}`)
    }
  }
  if (total === 0) {
    console.log('No key mismatches. Every definition registers under the key its type advertises.')
    return
  }
  console.error(`\n${total} definition${total === 1 ? '' : 's'} whose runtime key differs from the key autocomplete will offer.`)
  console.error('Either drop the redundant `key`, or keep the literal in the type with an intersection:')
  console.error("  export const x: PromptDefinition & { key: 'the_key' } = { key: 'the_key', ... }")
  process.exit(1)
}

function pathsFromFlag (flag: string) {
  const [specifier, target] = flag.split('=')
  if (specifier == null || target == null) throw new Error(`--paths expects <specifier>=<file>, got '${flag}'`)
  return { baseUrl: process.cwd(), paths: { [specifier]: [target] } }
}

main(process.argv.slice(2))
