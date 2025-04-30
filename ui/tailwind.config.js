import carbonSvelteTailwind from '@txstate-mws/carbon-svelte/tailwind'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}','./node_modules/@txstate-mws/carbon-svelte/**/*.{html,js,svelte,ts}'],
  plugins: [carbonSvelteTailwind]
}
