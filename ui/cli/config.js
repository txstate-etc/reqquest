/**
 * The SvelteKit and Vite configuration for a downstream ReqQuest UI.
 *
 * `reqquest-ui sync` writes .reqquest/svelte.config.js and .reqquest/vite.config.js as two-line stubs
 * that import these functions by absolute path. Keeping the real configuration here, inside the
 * package, means every plugin below resolves from @reqquest/ui's own dependencies - the downstream
 * project never declares vite, the adapter, tailwind or the preprocessors, so their versions are
 * whatever this release of @reqquest/ui was built and tested with.
 *
 * Mirrors ui/svelte.config.js and ui/vite.config.ts; change them together.
 */
import { join } from 'node:path'
import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import carbonSvelteTailwind from '@txstate-mws/carbon-svelte/tailwind'
import autoprefixer from 'autoprefixer'
import { optimizeImports } from 'carbon-preprocess-svelte'
import tailwindcss from 'tailwindcss'
import { packageDir } from './util.js'

/**
 * @param {{ projectRoot: string, appRoot: string, basePath?: string }} opts
 *   projectRoot - the downstream project (holds src/local, src/routes, package.json)
 *   appRoot - the generated .reqquest/ directory SvelteKit runs in
 * @returns {import('@sveltejs/kit').Config}
 */
export function svelteConfig ({ projectRoot, appRoot, basePath = '' }) {
  return {
    preprocess: [vitePreprocess(), optimizeImports()],
    kit: {
      adapter: adapter({
        pages: join(projectRoot, 'build'),
        assets: join(projectRoot, 'build'),
        fallback: 'index.html',
        precompress: true
      }),
      output: {
        preloadStrategy: 'preload-mjs'
      },
      paths: {
        base: basePath
      },
      files: {
        // $lib keeps meaning the project's own src/lib, as it would in any SvelteKit app
        lib: join(projectRoot, 'src/lib')
      },
      alias: {
        $internal: 'src/internal',
        // the downstream registry is not copied: it is aliased in place so the editor, HMR and
        // svelte-check all work on the files the developer actually edits
        $local: join(projectRoot, 'src/local')
      },
      typescript: {
        // SvelteKit's generated tsconfig only includes the app root, which src/local and src/lib sit outside of
        config (tsconfig) {
          for (const dir of ['src/local', 'src/lib']) {
            const abs = join(projectRoot, dir)
            tsconfig.include.push(`${abs}/**/*.ts`, `${abs}/**/*.js`, `${abs}/**/*.svelte`)
          }
        }
      }
    }
  }
}

/**
 * @param {{ projectRoot: string, appRoot: string }} opts
 * @returns {import('vite').UserConfig}
 */
export function viteConfig ({ projectRoot, appRoot }) {
  const globs = '**/*.{html,js,svelte,ts}'
  return {
    plugins: [sveltekit()],
    build: {
      sourcemap: true
    },
    optimizeDeps: {
      exclude: ['carbon-icons-svelte']
    },
    server: {
      fs: {
        allow: [projectRoot, packageDir('@txstate-mws/carbon-svelte', appRoot)]
      }
    },
    // inline so that no postcss.config.js / tailwind.config.js is needed in either the project or
    // .reqquest/, and so the plugins resolve from this package rather than the project
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            content: [
              join(appRoot, 'src', globs),
              join(projectRoot, 'src/local', globs),
              join(projectRoot, 'src/lib', globs),
              join(packageDir('@txstate-mws/carbon-svelte', appRoot), globs)
            ],
            plugins: [carbonSvelteTailwind]
          }),
          autoprefixer()
        ]
      }
    }
  }
}
