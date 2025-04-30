# Environment variables
Here is the TLDR:
 * your environment variables MUST begin with `PUBLIC_`
 * they MUST be listed in the `.env` file, mirrored with a dollar sign
   * e.g. `PUBLIC_YOURVAR=$PUBLIC_YOURVAR`
 * `npm install` after adding a new one so VSCode gets the types
 * Access them in javascript with `import { PUBLIC_YOURVAR } from '$env/static/public'`.

Explanation follows.

Environment variables are tricky for a client-side UI. Since it's running in the browser instead of Node, `process.env.PUBLIC_YOURVAR` won't work.

Svelte-kit gives us a tool for this: `$env/static/public`. Svelte-kit demands the environment variable must begin with `PUBLIC_` to help avoid exposing anything accidental.

For typescript (and for our strategy) you have to declare the environment variables in the `.env` file. This way, `svelte-kit sync` will set up the types for the `$env/static/public` export. `svelte-kit sync` runs before `npm install` so that will fix the types in VSCode.

During `npm run build` in the Dockerfile, the variables are going to be baked into the built files with their value set to what it was in the `.env` file, so e.g. `$PUBLIC_YOURVAR`. To fix the situation, we have `apply-env.sh` running on container startup. This script finds and replaces `$PUBLIC_YOURVAR` in the build files before nginx starts up. To be precise, it finds all variables starting with `PUBLIC_` in Docker's environment.

# Toasts
This template makes use of the `toasts` store from `@txstate-mws/svelte-components`. The `api` singleton will automatically toast errors during communication with the API. `src/routes/+layout.svelte` should place the toasts into the UI. The `@txstate-mws/carbon-svelte` component library provides a `Toasts` component that makes it easy.

# Authentication
This template is set up to send users to our Unified Auth service. The docker-compose comes with a development auth service that accepts any username. Use qual and prod unified-auth services in qual and prod.
