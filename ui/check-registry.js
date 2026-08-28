/**
 * Fails if the UI's definition registry (src/local/index.ts) has any type error.
 *
 * This is the build-time half of the API->UI drift guard. `UIConfig`'s keyed form requires an entry
 * per prompt key, so a prompt added on the API side and forgotten here is a type error - but only
 * if something actually type-checks. The full `npm run check` cannot serve as that gate yet: it
 * reports dozens of pre-existing errors elsewhere in the app, so turning it on would fail every
 * build for unrelated reasons. This narrows the gate to the one file that matters.
 */
import { spawnSync } from 'node:child_process'

const REGISTRY = 'src/local/index.ts'

const result = spawnSync('npx', ['svelte-check', '--tsconfig', './tsconfig.json', '--output', 'machine'], { encoding: 'utf8' })
const lines = (result.stdout ?? '').split('\n')
const errors = lines.filter(line => line.includes(' ERROR ') && line.includes(`"${REGISTRY}"`))

if (errors.length > 0) {
  console.error(`${REGISTRY} has ${errors.length} type error(s).\n`)
  for (const line of errors) console.error(line)
  console.error(`\nA missing prompt means the API defines a prompt this UI has no component for.`)
  console.error(`Add it to the prompts object in ${REGISTRY}, or regenerate the key declaration`)
  console.error(`("npm run keys:generate" in demos/) if the API's definitions changed.`)
  process.exit(1)
}
console.log(`${REGISTRY} is in step with the generated key declaration.`)
