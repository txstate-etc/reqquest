#!/usr/bin/env node
/**
 * Builds ui/src/lib/components.md - the single UI-authoring reference that ships to downstream
 * ReqQuest projects.
 *
 * Why generated rather than hand-written: the carbon-svelte half of the catalog is 60+ components
 * whose props change every release, and the design-system team already publishes it as machine
 * -readable markdown. Hand-copying that would rot within one bump. What is hand-written is the part
 * nobody else documents - the ReqQuest contract in docs-src/components/ - and that is concatenated
 * around the generated catalog.
 *
 * Why src/lib rather than the package root: svelte-package copies every non-.svelte/.ts/.js file in
 * src/lib into dist verbatim (see dist/typed-client/schema.graphql, which arrives the same way), and
 * package.json ships "files": ["dist"]. So this placement needs no packaging change AND it is the
 * only one that also lands in the GitHub source tarball a downstream Dockerfile untars - the two
 * channels reach different consumers (npm serves the editor and Claude Code, the tarball serves the
 * production build).
 *
 * The catalog is filtered against the INSTALLED carbon-svelte's exports, not against the doc site's
 * table of contents. The site tracks the library's main branch and drifts from what a downstream
 * project actually resolves; documenting a component that will not import is worse than omitting it.
 *
 *   node scripts/build-components-md.js            regenerate
 *   node scripts/build-components-md.js --check    fail if the committed file is stale (CI)
 *   node scripts/build-components-md.js --offline  build from .docs-cache only, no network
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const UI = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CS = join(UI, 'node_modules/@txstate-mws/carbon-svelte')
const RQ = join(UI, 'src/lib')
const SRC = join(UI, 'docs-src/components')
const CACHE = join(UI, '.docs-cache')
const OUT = join(RQ, 'components.md')
const SITE = 'https://component-library.app.qual.txst.edu'

const argv = new Set(process.argv.slice(2))
const CHECK = argv.has('--check')
const OFFLINE = argv.has('--offline')

/**
 * The SPA at the doc site answers 200 with its shell for every path it does not have a file for,
 * so a missing doc looks exactly like a present one to curl. Sniff the body instead of the status.
 */
const isSpaShell = body => /^\s*<!doctype html/i.test(body) || body.includes('modulepreload')

async function fetchDoc (path, name) {
  const cached = join(CACHE, name)
  if (OFFLINE) return existsSync(cached) ? readFileSync(cached, 'utf8') : undefined
  try {
    const res = await fetch(SITE + path)
    if (!res.ok) return undefined
    const body = await res.text()
    if (isSpaShell(body)) return undefined
    mkdirSync(CACHE, { recursive: true })
    writeFileSync(cached, body)
    return body
  } catch {
    // A doc site that is down must not break the build; fall back to whatever was cached.
    return existsSync(cached) ? readFileSync(cached, 'utf8') : undefined
  }
}

// ---------------------------------------------------------------------------
// 1. The authoritative export surface, read from the installed package
// ---------------------------------------------------------------------------

const named = text => [...text.matchAll(/export \{ default as (\w+) \}/g)].map(m => m[1])

const csVersion = /VERSION = ['"]([^'"]+)['"]/.exec(readFileSync(join(CS, 'dist/version.js'), 'utf8'))[1]
const topLevel = named(readFileSync(join(CS, 'dist/index.d.ts'), 'utf8'))
const formLevel = named(readFileSync(join(CS, 'dist/form/index.d.ts'), 'utf8'))
const exported = new Set([...topLevel, ...formLevel])
const rqExports = named(readFileSync(join(RQ, 'components/index.ts'), 'utf8'))

const version = pkg => JSON.parse(readFileSync(join(UI, 'node_modules', pkg, 'package.json'), 'utf8')).version

// ---------------------------------------------------------------------------
// 2. Reshape one fetched doc into a catalog entry
// ---------------------------------------------------------------------------

const typeDefs = new Map()

/**
 * Every field doc repeats the same "Common Field Props" block and 19 docs repeat the same type
 * definitions - together roughly 40% of the fetched bytes. Both are hoisted to a single copy, which
 * is the difference between a file an agent can hold in context and one it has to grep.
 */
function reshape (name, doc, pkg) {
  const lines = doc.split('\n')
  const out = []
  let skipping = false
  let typeName
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const h2 = /^## (.+)$/.exec(line)
    if (h2) {
      const heading = h2[1].trim()
      if (heading === 'Common Field Props') { skipping = true; typeName = undefined; continue }
      if (heading === 'Type Definitions') { skipping = true; typeName = null; continue }
      skipping = false
      typeName = undefined
      out.push('#### ' + heading)
      continue
    }
    if (typeName === null || typeName) {
      // Collecting the type-definition tail: each `### Name` starts a block we stash for the appendix.
      const h3 = /^### (\w+)$/.exec(line)
      if (h3) { typeName = h3[1]; if (!typeDefs.has(typeName)) typeDefs.set(typeName, []); continue }
      if (typeName) typeDefs.get(typeName).push(line)
      continue
    }
    if (skipping) continue
    if (/^# /.test(line)) { out.push('### ' + name); continue }
    out.push(line)
  }
  let text = out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
  // A few upstream docs are a blurb and nothing else. The import line is the one thing an agent
  // cannot infer (custom vs Carbon package), so never let an entry ship without it.
  if (pkg && !/^Import: /m.test(text)) {
    const importLine = 'Import: `import { ' + name + " } from '" + pkg + "'`"
    // Place it after the `> blurb` when there is one, so the entry still reads name/blurb/import.
    text = /^> /m.test(text)
      ? text.replace(/^> .*$/m, m => m + '\n\n' + importLine)
      : text.replace(/^### .+$/m, m => m + '\n\n' + importLine)
  }
  return text
}

// ---------------------------------------------------------------------------
// 3. Fall back to the component source when the site has no doc
// ---------------------------------------------------------------------------

const dedent = s => s
  .split('\n')
  .map(l => l.replace(/^\s*\*\s?/, '').trim())
  .join(' ')
  // `@type {...}` restates the TypeScript annotation we already print; drop it.
  .replace(/@type \{[^}]*\}/g, '')
  .replace(/\s+/g, ' ')
  .trim()

/**
 * Split `: SomeType = default` without being fooled by the `=` in an arrow type. Scanning for a
 * top-level `=` is the only way; a regex splits `(w: number) => string[]` down the middle.
 */
function splitDeclaration (rest) {
  let depth = 0
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i]
    // Only bracket pairs that cannot appear in an arrow type. Counting `<`/`>` would treat the
    // `>` of `=>` as a closer and drive the depth negative.
    if ('([{'.includes(c)) depth++
    else if (')]}'.includes(c)) depth--
    else if (c === '=' && depth === 0 && rest[i + 1] !== '>' && !'=!<>'.includes(rest[i - 1] ?? '')) {
      return [rest.slice(0, i).trim(), rest.slice(i + 1).trim()]
    }
  }
  return [rest.trim(), undefined]
}

/**
 * carbon-svelte ships unbundled: every dist/<Name>.svelte is the real source with its JSDoc intact.
 * That is a poorer entry than the site's - no example, no events table - but it is accurate, which a
 * silent omission is not.
 */
function fromSource (name, file) {
  if (!existsSync(file)) return undefined
  const src = readFileSync(file, 'utf8')
  const out = ['### ' + name, '']
  const blurb = /<!--\s*@component([\s\S]*?)-->/.exec(src)
  if (blurb) out.push('> ' + dedent(blurb[1]), '')
  out.push('Import: `import { ' + name + " } from '@txstate-mws/carbon-svelte'`", '')
  out.push('<!-- no upstream doc at this version; props extracted from the component source -->', '')
  const props = []
  const re = /(?:\/\*\*([\s\S]*?)\*\/\s*)?export let (\w+)(.*)$/gm
  for (const m of src.matchAll(re)) {
    const [, jsdoc, prop, rest] = m
    const [decl, dflt] = splitDeclaration(rest)
    const type = decl.startsWith(':') ? decl.slice(1).trim() : ''
    let entry = '- **`' + prop + '`**'
    if (type) entry += ' `' + type + '`'
    entry += dflt ? ' (default: `' + dflt + '`)' : ' **(required)**'
    const doc = jsdoc ? dedent(jsdoc) : ''
    if (doc) entry += ' - ' + doc
    props.push(entry)
  }
  if (props.length) out.push('#### Props', '', ...props, '')
  return out.join('\n').trim()
}

// ---------------------------------------------------------------------------
// 4. Assemble
// ---------------------------------------------------------------------------

const stats = { documented: 0, fromSource: 0, overridden: 0, siteOnly: [] }

function override (name) {
  const f = join(SRC, 'overrides', name + '.md')
  if (!existsSync(f)) return undefined
  stats.overridden++
  return readFileSync(f, 'utf8').trim()
}

async function entry (name, sourceFile) {
  const ov = override(name)
  if (ov) return ov
  const doc = await fetchDoc('/llms/' + (site.get(name)?.slug ?? name) + '.md', name + '.md')
  if (doc) { stats.documented++; return reshape(name, doc, '@txstate-mws/carbon-svelte') }
  const src = fromSource(name, sourceFile)
  if (src) { stats.fromSource++; return src }
  stats.fromSource++
  return '### ' + name + '\n\nExported by `@txstate-mws/carbon-svelte` ' + csVersion +
    '. No upstream documentation and no readable source at this version - read\n' +
    '`node_modules/@txstate-mws/carbon-svelte/dist/' + name + '.svelte` directly.'
}

const index = await fetchDoc('/llms.txt', 'llms.txt')
if (!index) {
  console.error('Could not read llms.txt (network down and nothing cached at ' + CACHE + ').')
  process.exit(1)
}

/** llms.txt groups components under `## Custom Components` / `## Carbon Components` / `## Form Fields`. */
const site = new Map()
let group
for (const line of index.split('\n')) {
  const h = /^## (.+)$/.exec(line)
  if (h) { group = h[1].trim(); continue }
  const item = /^- \[([^\]]+)\]\(llms\/([\w-]+)\.md\):\s*(.*)$/.exec(line)
  // The site files a few docs under a hyphenated slug (Layout-Base.md for LayoutBase); key the map
  // by the export name so the reconciliation below compares like with like.
  if (item && group) site.set(item[2].replace(/-/g, ''), { group, slug: item[2], label: item[1], blurb: item[3] })
}

const GROUPS = ['Custom Components', 'Form Fields']
const sections = new Map(GROUPS.map(g => [g, []]))

// Site order first (it is curated), then anything the site does not know about, alphabetically.
const ordered = [...site.keys()].filter(n => exported.has(n))
  .concat([...exported].filter(n => !site.has(n)).sort())

for (const name of ordered) {
  const meta = site.get(name)
  if (meta?.group === 'Carbon Components') continue // documented below, imported from carbon-components-svelte
  const group = meta?.group === 'Form Fields' || /^(Field|Form)/.test(name) ? 'Form Fields' : 'Custom Components'
  const file = formLevel.includes(name)
    ? join(CS, 'dist/form', name + '.svelte')
    : join(CS, 'dist', name + '.svelte')
  sections.get(group).push(await entry(name, file))
}

for (const [name, meta] of site) {
  if (meta.group !== 'Carbon Components' && !exported.has(name)) stats.siteOnly.push(name)
}

// Carbon components are documented for reference but imported from carbon-components-svelte, so they
// are not filtered against our export list.
const carbon = []
for (const [name, meta] of site) {
  if (meta.group !== 'Carbon Components') continue
  const ov = override(name)
  if (ov) { carbon.push(ov); continue }
  const doc = await fetchDoc('/llms/' + meta.slug + '.md', name + '.md')
  carbon.push(doc ? reshape(name, doc) : '### ' + name + '\n\n' + meta.blurb)
}

// ReqQuest's own components, straight from source - they have never been on the doc site.
const reqquest = rqExports.map(name => {
  const ov = override(name)
  if (ov) return ov
  const src = fromSource(name, join(RQ, 'components', name + '.svelte'))
  return (src ?? '### ' + name).replace(
    "Import: `import { " + name + " } from '@txstate-mws/carbon-svelte'`",
    "Import: `import { " + name + " } from '@reqquest/ui'`"
  ).replace('<!-- no upstream doc at this version; props extracted from the component source -->\n\n', '')
})

const read = f => existsSync(join(SRC, f)) ? readFileSync(join(SRC, f), 'utf8').trim() : ''

const header = `<!-- GENERATED by ui/scripts/build-components-md.js - do not edit directly.
     Hand-written sections live in ui/docs-src/components/; run \`npm run docs:components\` to rebuild. -->

# ReqQuest UI: components and authoring guide

Everything needed to write UI in a ReqQuest project, in one file. Read the section you need; you are
not meant to read it end to end.

Versions this describes (the versions a downstream project resolves through \`@reqquest/ui\`):

| package | version |
|---|---|
| \`@reqquest/ui\` | ${JSON.parse(readFileSync(join(UI, 'package.json'), 'utf8')).version} |
| \`@txstate-mws/carbon-svelte\` | ${csVersion} |
| \`@txstate-mws/svelte-forms\` | ${version('@txstate-mws/svelte-forms')} |
| \`carbon-components-svelte\` | ${version('carbon-components-svelte')} |
| \`carbon-icons-svelte\` | ${version('carbon-icons-svelte')} |
| \`svelte\` | 5.x, **no runes** |

## Contents

1. [Rules that apply to every file](#rules-that-apply-to-every-file)
2. [What "building UI" means in a ReqQuest project](#what-building-ui-means-in-a-reqquest-project)
3. [Registering a prompt](#registering-a-prompt)
4. [Recipes](#recipes)
5. [Field idioms](#field-idioms)
6. [ReqQuest components](#reqquest-components)
7. [carbon-svelte: custom components](#carbon-svelte-custom-components)
8. [carbon-svelte: form fields](#carbon-svelte-form-fields)
9. [Carbon components](#carbon-components)
10. [Type definitions](#type-definitions)
11. [Appendix: version drift, deep imports, sources](#appendix-version-drift-deep-imports-sources)
`

const commonFieldProps = `Every \`Field*\` component takes these, in addition to its own props:

- **\`path\`** \`string\` **(required)** - the form data path this field binds to.
- **\`conditional\`** \`boolean\` (default: \`true\`) - when false, svelte-forms drops this field's value
  from the submitted data. This is how a branch that is no longer shown stops contributing stale
  answers; see [Rules that apply to every file](#rules-that-apply-to-every-file).
- **\`defaultValue\`** varies (default: \`undefined\`) - initial value.
- **\`id\`** \`string\` (default: \`randomid()\`) - element id, auto-generated.

Most fields forward anything else to the underlying Carbon component via \`$$restProps\`.`

const typeSection = [...typeDefs.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, body]) => '### ' + name + '\n' + body.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd())
  .join('\n\n')

const body = [
  header,
  read('00-preamble.md'),
  '## ReqQuest components\n\nExported from `@reqquest/ui`. Prefer these over hand-rolled markup inside a prompt component.',
  reqquest.join('\n\n'),
  '## carbon-svelte: custom components\n\nImported from `@txstate-mws/carbon-svelte`.',
  sections.get('Custom Components').join('\n\n'),
  '## carbon-svelte: form fields\n\nImported from `@txstate-mws/carbon-svelte`. Fields are useless outside a `Form` or `PanelFormDialog`\n(or, in a prompt component, the form the framework wraps around you).\n\n### Common field props\n\n' + commonFieldProps,
  sections.get('Form Fields').join('\n\n'),
  '## Carbon components\n\nDocumented here for convenience but imported from `carbon-components-svelte`, not from\n`@txstate-mws/carbon-svelte`. Reach for these only when nothing above fits.',
  carbon.join('\n\n'),
  '## Type definitions\n\nShapes referenced by the props above.\n\n' + typeSection,
  read('90-appendix.md').replace('%%SITE_ONLY%%', stats.siteOnly.length
    ? stats.siteOnly.map(n => '- `' + n + '`').join('\n')
    : '- _(none - the doc site and this version agree)_')
].filter(Boolean).join('\n\n') + '\n'

if (CHECK) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''
  if (current !== body) {
    console.error('components.md is stale. Run `npm run docs:components` and commit the result.')
    process.exit(1)
  }
  console.log('components.md is current.')
} else {
  // Only write on change: the dev stack watches src/lib, and a no-op rewrite would restart it.
  if (!existsSync(OUT) || readFileSync(OUT, 'utf8') !== body) writeFileSync(OUT, body)
  console.log(`components.md: ${(body.length / 1024).toFixed(0)}KB, ${body.split('\n').length} lines`)
}

console.log(`  carbon-svelte ${csVersion}: ${exported.size} exports -> ` +
  `${stats.documented} documented upstream, ${stats.fromSource} from source, ${stats.overridden} overridden`)
console.log(`  reqquest components: ${rqExports.length}`)
console.log(`  carbon components: ${carbon.length}`)
console.log(`  type definitions: ${typeDefs.size}`)
if (stats.siteOnly.length) console.log(`  documented upstream but not exported at ${csVersion}: ${stats.siteOnly.join(', ')}`)
