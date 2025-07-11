import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const original = JSON.parse(readFileSync('package.json'))
const local = JSON.parse(readFileSync('package-local.json'))

original.name = local.name
for (const [k, v] of Object.entries(local.dependencies)) {
  original.dependencies[k] ??= v
}

writeFileSync('package.json', JSON.stringify(original))

function fixRouteImports(route) {
  const entries = readdirSync(route, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.endsWith('.ts') || entry.name.endsWith('.svelte')) {
      const content = readFileSync(new URL(entry.name, route), 'utf-8')
      const fixedContent = content.replace(/from '\$lib/g, "from '@reqquest/ui")
      writeFileSync(new URL(entry.name, route), fixedContent)
    } else if (entry.isDirectory()) {
      fixRouteImports(new URL(entry.name + '/', route))
    }
  }
}

fixRouteImports(new URL('./src/routes/', import.meta.url))
