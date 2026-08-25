import path from 'node:path'
import { findPromptExports } from './promptExports.js'

/**
 * Prints the prompt definitions found in a project.
 *
 *   node dist/analysis/cli.js <tsconfig-or-directory> [--type RequirementDefinition]
 *
 * `--paths <specifier>=<file>` maps a module for projects that cannot resolve it themselves, which
 * is how this runs against demos/ outside the container:
 *
 *   node dist/analysis/cli.js ../demos --paths '@reqquest/api=../api/src/index.ts'
 */
function main (argv: string[]) {
  const args = [...argv]
  const flag = (name: string) => {
    const i = args.indexOf(name)
    if (i === -1) return undefined
    return args.splice(i, 2)[1]
  }
  const typeName = flag('--type')
  const pathsFlag = flag('--paths')
  const project = args[0]
  if (project == null) {
    console.error('usage: node dist/analysis/cli.js <tsconfig-or-directory> [--type <TypeName>] [--paths <specifier>=<file>]')
    process.exit(2)
  }

  const compilerOptions = pathsFlag != null ? pathsFromFlag(pathsFlag) : undefined
  const { prompts, markerFile } = findPromptExports({ project, typeName, compilerOptions })

  console.log(`${prompts.length} ${typeName ?? 'PromptDefinition'} export${prompts.length === 1 ? '' : 's'}`)
  console.log(`marker resolved from ${markerFile}\n`)

  let currentFile: string | undefined
  for (const prompt of prompts) {
    if (prompt.file !== currentFile) {
      currentFile = prompt.file
      console.log(path.relative(process.cwd(), currentFile))
    }
    // the key is worth showing next to the name: they are independent today, and a difference
    // between them is exactly the kind of thing worth noticing
    const key = prompt.key ?? '(not a literal)'
    console.log(`  ${prompt.name}${key === prompt.name ? '' : `  key=${key}`}`)
  }
}

function pathsFromFlag (flag: string) {
  const [specifier, target] = flag.split('=')
  if (specifier == null || target == null) throw new Error(`--paths expects <specifier>=<file>, got '${flag}'`)
  return { baseUrl: process.cwd(), paths: { [specifier]: [target] } }
}

main(process.argv.slice(2))
