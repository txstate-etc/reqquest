import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const original = JSON.parse(readFileSync('package.json'))
const local = JSON.parse(readFileSync('package-local.json'))

original.name = local.name
for (const [k, v] of Object.entries(local.dependencies)) {
  original.dependencies[k] ??= v
}

writeFileSync('package.json', JSON.stringify(original))
