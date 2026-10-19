import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

/**
 * Finds an installed package's directory by walking node_modules upward from `from`, the way Node
 * resolves a bare import. Used instead of require.resolve because several of these packages declare
 * "exports" that do not expose package.json.
 */
export function packageDir (name, from) {
  let dir = from
  while (true) {
    const candidate = join(dir, 'node_modules', name)
    if (existsSync(join(candidate, 'package.json'))) return candidate
    const parent = dirname(dir)
    if (parent === dir) throw new Error(`Cannot find package '${name}' from ${from}. Is @reqquest/ui installed?`)
    dir = parent
  }
}

export function readJson (path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

/** Absolute path of a package's executable, from its package.json "bin". */
export function packageBin (name, from, binName = name.split('/').pop()) {
  const dir = packageDir(name, from)
  const { bin } = readJson(join(dir, 'package.json'))
  return join(dir, typeof bin === 'string' ? bin : bin[binName])
}
