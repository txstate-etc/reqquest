import pluginSvelte, { rules } from 'eslint-plugin-svelte'
import love from 'eslint-config-love'
import stylistic from '@stylistic/eslint-plugin'
import svelteParser from 'svelte-eslint-parser'
import tsParser from '@typescript-eslint/parser'

const customConfig = {
  plugins: {
    ...love.plugins,
    '@stylistic': stylistic
  },
  rules: {
    ...stylistic.configs['recommended-flat'].rules,
    ...love.rules,
    'import/first': 'off',
    'no-multiple-empty-lines': 'off',
    'no-self-assign': 'off', // self assign in svelte is to trigger reactivity
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    // '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }], // disabling this for now to see if eslint-config-love's default is good
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/init-declarations': 'off',
    '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off', // this is silly, it disallows using ! to mark something as non-null
    '@typescript-eslint/no-throw-literal': 'off', // sveltekit error() function does not return an Error :/
    '@typescript-eslint/no-unsafe-assignment': 'off', // this makes it hard to use 'any', especially in svelte where you can't assert types in template expressions
    '@typescript-eslint/no-unsafe-member-access': 'off', // this makes it hard to use 'any', especially in svelte where you can't assert types in template expressions
    '@typescript-eslint/no-unsafe-return': 'off', // this makes it hard to use 'any', especially in svelte where you can't assert types in template expressions
    '@typescript-eslint/no-unused-vars': 'off', // typescript does this better
    '@typescript-eslint/prefer-destructuring': 'off', // no reason to force destructuring
    '@typescript-eslint/prefer-nullish-coalescing': ['error', { ignoreConditionalTests: true }], // this is supposed to be the default but apparently eslint-config-love overrode it to something stupid
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/require-await': 'off', // sometimes we make async functions because upstream code expects a promise, even if we don't have any awaits inside
    '@typescript-eslint/strict-boolean-expressions': 'off', // it can be very difficult to assert types in svelte template areas
    // FORMATTING RULES
    '@stylistic/arrow-parens': ['error', 'as-needed'],
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/comma-dangle': ['error', 'never'],
    '@stylistic/indent': ['error', 2, { ignoreComments: true }],
    '@stylistic/max-statements-per-line': 'off',
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/quote-props': ['error', 'as-needed'],
    '@stylistic/space-before-function-paren': ['error', 'always']
  }
}

export default [
  ...pluginSvelte.configs['flat/recommended'],
  {
    files: ['src/**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        project: './api/tsconfig.json',
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: love.languageOptions.parser,
        parserOptions: love.languageOptions.parserOptions
      }
    },
    ...customConfig
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ...love.languageOptions,
      parserOptions: {
        ...love.languageOptions.parserOptions,
        project: './api/tsconfig.json',
      }
    },
    ...customConfig
  }
]
