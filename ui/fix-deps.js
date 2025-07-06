import { readDirSync, readFileSync, writeFileSync } from 'node:fs'

const original = JSON.parse(readFileSync('package.json'))
const local = JSON.parse(readFileSync('package-local.json'))

for (const [k, v] of Object.entries(local.dependencies)) {
  original.dependencies[k] ??= v
}

writeFileSync('package.json', JSON.stringify(original))

function fixRouteImports(route) {
  const entries = readDirSync(route, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.endsWith('.ts') || entry.name.endsWith('.svelte')) {
      const content = readFileSync(`${route}/${entry.name}`, 'utf-8')
      const fixedContent = content.replace(/from '\$lib/g, "from '@reqquest/ui")
      writeFileSync(`${route}/${entry.name}`, fixedContent)
    } else if (entry.isDirectory()) {
      fixRouteImports(`${route}/${entry.name}`)
    }
  }
}

fixRouteImports(new URL('src/routes', import.meta.url))
