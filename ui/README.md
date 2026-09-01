# ReqQuest UI Library

This library provides a set of Svelte components and utilities for building ReqQuest projects. You'll especially find the `api` useful for creating graphQL queries. In the future we will provide a small component library to help you build your prompts.

## Registering your prompts

Every prompt your API defines needs a Svelte component registered here, and nothing links the two
automatically. Use the keyed form of `UIConfig` so a prompt you forget to register is a build error
rather than a broken screen:

```ts
const config = {
  appName: 'My Program',
  prompts: {
    proof_of_residence_prompt: { formComponent: ResidencePrompt, displayComponent: ResidenceDisplay }
  }
} satisfies UIConfig
export const uiRegistry = new UIRegistry(config)
```

That check only has teeth once a key declaration augmenting `@reqquest/ui` is in your `src`. It is
generated on the **API** side, by the analyzer that ships with `@reqquest/api` — see
[docs/downstream-setup.md](../docs/downstream-setup.md). Without it, keys stay `string`, an
unregistered prompt renders an inline "unavailable" notice at runtime, and you find out when a user
reaches the screen.

# Developing this library

To develop the UI library, you'll want to work with the full demo, so `docker compose up --build` in the root of the repo. Similarly the test suite is combined with API tests, so run `./test.sh` in the root of the repo.

## Custom Typed GraphQL Queries

We are using `genql` to generate typed queries for our GraphQL API. To regenerate the types, run `./genclient.sh` in the root of the repo, while the demo server is running. This will regenerate the `ui/src/lib/typed-client` folder. Never make local changes to that folder, as they will be overwritten the next time someone runs the genclient script.
