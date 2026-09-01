# ReqQuest API

This library provides the core structure and utilities for building ReqQuest projects. It includes the GraphQL API, data models, and other backend functionalities. As a ReqQuest project developer, you will primarily create definitions for Programs, Requirements, and Prompts. ReqQuest will put it all together for you and make sure applicants can answer their prompts and submit their requests, while reviewers can answer their own prompts to meet all the requirements you specified.

## Type-safe keys

An analyzer ships in this package that reads your program, requirement, and prompt definitions and
emits a `.d.ts` declaring every key you register. Once it is in place, `promptKeys`,
`requirementKeys`, `promptKeysNoDisplay`, and `invalidUponChange` autocomplete and reject typos
instead of accepting any `string`:

```
node node_modules/@reqquest/api/dist/analysis/cli.js . --emit-keys src/keys.generated.d.ts
```

It reads your definitions' TypeScript **sources**, not a compiled build, and it needs `typescript`
installed alongside it — that is an optional peer dependency of this package, so npm will not warn
you when it is missing. Augmenting is entirely optional; keys stay `string` until you do.

See [docs/downstream-setup.md](../docs/downstream-setup.md) for the full procedure, including the
second declaration that types your UI's prompt registration.
