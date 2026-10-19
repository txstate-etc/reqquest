#!/usr/bin/env node
/**
 * Copies the ReqQuest app shell into ui/app/ so it ships in the npm package alongside dist/.
 *
 * dist/ is only src/lib - the components and registry a downstream project imports. The application
 * those components live in (routes, src/internal, app.html, the nginx runtime) used to reach
 * downstream projects only as a GitHub source tarball their Dockerfile untarred. Shipping it here
 * lets `reqquest-ui sync` (cli/sync.js) assemble the app from node_modules instead, at exactly the
 * version npm locked.
 *
 * None of this is in package.json "exports": the shell is installed, not imported, and stays free to
 * change between releases.
 *
 * Runs from "prepack", so `npm pack` and `npm publish` both produce it. ui/app/ is gitignored.
 */
import { cpSync, rmSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ui = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const app = join(ui, 'app')
const shell = ['routes', 'internal']

// The shell is relocated to <project>/.reqquest/src, where src/lib and src/local do not exist, so it
// may only reach them through '@reqquest/ui' and '$local'. Catch a relative import before it ships.
const IMPORT_RE = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"]*)\1/g
// '$lib' resolves here but downstream it is the project's own src/lib, so it is an escape too
const LIB_RE = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\$lib(?:\/[^'"]*)?)\1/g
const escapes = []
for (const top of shell) {
  for (const entry of readdirSync(join(ui, 'src', top), { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.(svelte|ts|js)$/.test(entry.name)) continue
    const file = join(entry.parentPath, entry.name)
    const source = readFileSync(file, 'utf8')
    for (const [, , spec] of source.matchAll(IMPORT_RE)) {
      const target = relative(join(ui, 'src'), resolve(dirname(file), spec))
      if (!shell.some(dir => target.startsWith(dir + '/')) && target !== 'app.css') escapes.push(`${relative(ui, file)}: '${spec}'`)
    }
    for (const [, , spec] of source.matchAll(LIB_RE)) escapes.push(`${relative(ui, file)}: '${spec}'`)
  }
}
if (escapes.length) {
  console.error(`The app shell imports outside itself by relative path; use '@reqquest/ui' or '$local':\n  ${escapes.join('\n  ')}`)
  process.exit(1)
}

rmSync(app, { recursive: true, force: true })
mkdirSync(join(app, 'src'), { recursive: true })
mkdirSync(join(app, 'runtime'), { recursive: true })

for (const entry of [...shell, 'app.html', 'app.css', 'app.d.ts']) {
  cpSync(join(ui, 'src', entry), join(app, 'src', entry), { recursive: true })
}
cpSync(join(ui, 'static'), join(app, 'static'), { recursive: true })
cpSync(join(ui, 'nginx.conf'), join(app, 'runtime', 'nginx.conf'))
cpSync(join(ui, 'apply-env.sh'), join(app, 'runtime', 'apply-env.sh'))
cpSync(join(ui, '.env'), join(app, 'env.template'))

console.log(`app shell copied to ${app}`)
