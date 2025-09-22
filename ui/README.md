# ReqQuest UI Library

This library provides a set of Svelte components and utilities for building ReqQuest projects. You'll especially find the `api` useful for creating graphQL queries. In the future we will provide a small component library to help you build your prompts.

# Developing

To develop the UI library, you'll want to work with the full demo, so `docker compose up --build` in the root of the repo. Similarly the test suite is combined with API tests, so run `./test.sh` in the root of the repo.

## Custom Typed GraphQL Queries

We are using `genql` to generate typed queries for our GraphQL API. To regenerate the types, run `./genclient.sh` in the root of the repo, while the demo server is running. This will regenerate the `ui/src/lib/typed-client` folder. Never make local changes to that folder, as they will be overwritten the next time someone runs the genclient script.
