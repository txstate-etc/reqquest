import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { optimizeImports } from 'carbon-preprocess-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [vitePreprocess(), optimizeImports()],
	compilerOptions: { enableSourcemap: true },
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			precompress: true
		}),
		output: {
			preloadStrategy: 'preload-mjs'
		},
		paths: {
			base: ''
		}
	}
};

export default config
