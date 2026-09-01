# Type-safe keys across your API and UI

Your programs, requirements, and prompts are defined in TypeScript on the API side, and each prompt
is rendered by a Svelte component you register with `UIRegistry` on the UI side. Nothing links those
two halves automatically — the API can define `proof_of_residence_prompt` while your UI has no
component for it, and by default you find out when an applicant reaches that screen.

The analyzer that ships with `@reqquest/api` closes that gap. It reads your definitions and emits a
`.d.ts` declaring every key you register, which turns both halves into compile-time checks.

This guide assumes your API definitions and your UI live in **one repository**. If they are split
across two repos, read [Separate repos for API and UI](#separate-repos-for-api-and-ui) at the end
first — the shape is different and less of it is automatic.

## Two files, one analyzer

The most common mistake is assuming there is one generated file. There are two, from the same
analyzer, run twice against the same project:

```
your-app/
├── api/
│   ├── src/
│   │   ├── definitions/…              your programs, requirements, prompts
│   │   └── keys.generated.d.ts        augments '@reqquest/api'  → types your definitions
│   └── tsconfig.json
└── ui/
    ├── src/local/
    │   ├── index.ts                   your UIConfig / UIRegistry
    │   └── keys.generated.d.ts        augments '@reqquest/ui'   → types your registration
    └── tsconfig.json
```

Both are generated from your API sources, because that is the only place the keys actually exist.
The UI file is not derived from the UI; it is a copy of the same key list addressed to a different
package. Commit both.

## 1. Prerequisites

**`typescript` must be installed wherever you run the analyzer.** It is an *optional* peer
dependency of `@reqquest/api`, so npm will not warn you when it is missing, but the analyzer imports
it at runtime. The failure is a bare `Cannot find module 'typescript'`.

Two places this bites: a Docker builder image that installs only production dependencies, and any
stage installed with `npm ci --omit=dev`. Key generation and checking have to happen in a stage that
still has dev dependencies.

**The analyzer needs your definitions' TypeScript *sources*.** It builds a real `ts.createProgram`
over them; a compiled `dist` or a published package is not enough. Whatever you pass as the project
argument must be a directory containing a `tsconfig.json` (or a path to one) whose `include` covers
your definition files.

## 2. Emit the API-side declaration

```
node node_modules/@reqquest/api/dist/analysis/cli.js . \
  --emit-keys src/keys.generated.d.ts
```

Run this from your API project. With no `--module` flag the file augments `@reqquest/api`, which is
what types the keys inside your own definitions: `promptKeys`, `requirementKeys`,
`promptKeysNoDisplay`, and `invalidUponChange` stop being `string` and start autocompleting and
rejecting typos.

This half pays off before you write any UI code, and it is worth doing even if you never get to
step 3.

## 3. Emit the UI-side declaration

```
node node_modules/@reqquest/api/dist/analysis/cli.js . \
  --emit-keys ../ui/src/local/keys.generated.d.ts --module '@reqquest/ui'
```

Same analyzer, same project argument — only the output path and the augmented module change.
`@reqquest/ui` declares its own copy of the marker interface rather than importing one from
`@reqquest/api`, because a browser bundle cannot depend on a package that pulls in fastify and
mysql2. The emitted keys are plain string literals with no imports, so one scan feeds both packages.

## 4. Include each file, and keep formatters off both

**Each file must fall inside its own tsconfig `include`.** A declaration the program never loads
augments nothing, and the failure is silent: keys simply stay `string`, with no error to tell you
the setup did not take.

In practice this is usually already true. A SvelteKit project's generated `include` carries
`../src/**/*.ts`, which matches a `.d.ts`, so a file under the UI's `src/` needs no tsconfig change;
an API project with `"include": ["src/**/*"]` covers its own file the same way. The hazard is real
but narrow — it bites when you put the file somewhere other than `src/`.

**Exempt both files from prettier and `eslint --fix`.** The staleness check regenerates the
declaration and compares it to the file on disk as text, tolerating only leading and trailing
whitespace. One reformatting pass makes the file permanently stale, and no amount of regenerating
fixes it while the formatter keeps running. This is what the generated `/* eslint-disable */` on
line 1 is for; add the paths to `.prettierignore` as well.

**Do not delete the `export {}`.** The generated header explains why: without a top-level import or
export the file is a global script, and `declare module` then *replaces* the package instead of
augmenting it — every import from `@reqquest/api` fails at once with "has no exported member." You
never write this file by hand, but a hand-edit or an aggressive tool can strip that line.

## 5. Register prompts with the keyed form

```ts
const config = {
  appName: 'My Program',
  programs: { my_program: { icon: SomeIcon } },
  requirements: { proof_of_residence_req: { configureComponent: ResidenceConfig } },
  prompts: {
    proof_of_residence_prompt: { formComponent: ResidencePrompt, displayComponent: ResidenceDisplay }
  }
} satisfies UIConfig
export const uiRegistry = new UIRegistry(config)
```

The older array form (`prompts: [{ key: 'proof_of_residence_prompt', ... }]`) still works and is
still type-checked for typos, so existing projects need no migration. It cannot check **coverage**,
though: an array can reject a key the API does not have, but it can never require the keys the API
*does* have. Only the keyed form makes a forgotten prompt a compile error. It also rejects duplicate
keys, which an array silently resolves last-wins.

Coverage is required for `prompts` only. `requirements` and `programs` carry optional decoration —
an icon, a configuration component — and every consumer tolerates their absence, so those are
partial.

## 6. Wrap both invocations in npm scripts

```json
"keys:generate": "npm run keys:generate:api && npm run keys:generate:ui",
"keys:generate:api": "node node_modules/@reqquest/api/dist/analysis/cli.js . --emit-keys src/keys.generated.d.ts",
"keys:generate:ui": "node node_modules/@reqquest/api/dist/analysis/cli.js . --emit-keys ../ui/src/local/keys.generated.d.ts --module '@reqquest/ui'",
"keys:check": "node node_modules/@reqquest/api/dist/analysis/cli.js . --check-keys src/keys.generated.d.ts && node node_modules/@reqquest/api/dist/analysis/cli.js . --check-keys ../ui/src/local/keys.generated.d.ts --module '@reqquest/ui'"
```

Regenerate whenever a definition is added, removed, renamed, or re-keyed. `--check-keys` takes the
same arguments as `--emit-keys` and exits non-zero on a stale file.

"The same arguments" is stricter than it sounds, and it is why these belong in scripts rather than
typed out at each call site. `--check-keys` regenerates the whole declaration and compares it to the
committed file as text, so *any* difference in flags — a missing `--module`, a different `--groups`
ordering — produces different output and reports stale forever, no matter how recently you
regenerated. Never type the analyzer by hand in CI; call the script, and the two stay in step
structurally.

The raw `node_modules` path is not an oversight: `@reqquest/api` declares no `bin` entry, and its
`exports` map's `./analysis` subpath resolves to the library index rather than the CLI. Wrap it once
here and you never have to look at it again.

## 7. Gate both halves in your build

Two separate gates. Neither is optional if you want drift to fail at build time rather than in front
of an applicant.

**The API image — check the declarations are current:**

```dockerfile
# ...a `deps` stage that has already run `npm ci` (with dev dependencies) and
# copied your API sources to WORKDIR /usr/app/api.

FROM deps AS keycheck
# The UI's declaration lives outside the API's tree, so bring it in to check it.
# This path must land where keys:check looks for it - ../ui/src/local from the API workdir.
COPY ui/src/local/keys.generated.d.ts /usr/app/ui/src/local/keys.generated.d.ts
RUN npm run keys:check

FROM keycheck AS build
RUN npm run build
```

Three things about that snippet fail *open* if you get them wrong, which is to say they produce a
green build that checks nothing:

- **`FROM keycheck AS build` is load-bearing.** BuildKit only builds stages in the target's
  dependency chain. A `keycheck` stage that nothing derives from is silently skipped — it looks like
  a gate in the file and never executes. Chaining the next stage onto it is what puts it in the
  path of every build.
- **The build context must be the repo root**, not your API directory, so this image can `COPY` the
  UI's declaration in order to check it. That means every other `COPY` path in the file gains an
  `api/` prefix.
- **`.dockerignore` must not exclude the generated files.** A pattern like `*.generated.*`, or a
  `.dockerignore` derived from `.gitignore`, drops the declaration from the context — and a missing
  augmentation is not an error, it degrades every key to `string` and the build passes.

**The UI image — check the registration is complete:**

```dockerfile
RUN npx svelte-kit sync && npm run check
RUN npm run build
```

Nothing to install or import; SvelteKit already scaffolds the script for you:

```json
"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
```

This is the step that has to be deliberate. `vite build` strips types without checking them, so
without a type check nothing else in your pipeline notices a prompt you forgot to register. If your
app has pre-existing type errors you cannot fix yet, narrow the gate to the file holding your
`UIConfig` rather than dropping it — a partial gate still catches the drift this guide is about.

## 8. Prove the gate is live

Every failure mode above fails open. A file outside `include`, an unreferenced Docker stage, a
`.dockerignore` pattern, the array `UIConfig` form, a missing `--module` — none of them produce an
error, so "I set it up and got no errors" is indistinguishable from "I set it up wrong."

Break it once, deliberately, and watch it fail:

1. Delete one entry from the `prompts` object in your `UIConfig`.
2. Build the UI image. It should fail, naming the missing key.
3. Put it back.
4. Rename a definition on the API side without regenerating, and build the API image. `keys:check`
   should fail as stale.

Four minutes, and it converts every silent condition above into one you have actually observed.

## Regenerating while you work

Wire `--emit-keys` into your dev watcher *before* the build step. Without it, adding a prompt and
referencing it in the same save fails to compile on a key that is perfectly valid.

Exclude the generated files from the watched paths while you are at it. Writing a file back into a
watched tree retriggers the watcher, which regenerates, which retriggers it.

## Flags

| flag | what it does |
|---|---|
| `--emit-keys <file>` | Write the declaration. Skips the write when nothing changed. |
| `--check-keys <file>` | Exit non-zero if the file is missing or stale. Same flags as the emit. |
| `--module <name>` | Which package to augment. Omit for `@reqquest/api`; pass `'@reqquest/ui'` for the UI copy. |
| `--groups Name=prefix,…` | Also emit per-subset aliases. **Most projects do not need this.** |
| `--paths <specifier>=<file>` | Override module resolution. **You almost certainly do not need this.** |

The last two exist for this repo's own demos, which are the only executable example available to
copy from — so they are easy to pick up by accident:

- **`--groups`** partitions the emitted aliases by source path prefix, producing extra types like
  `SimplePromptKey`. It is only useful when one project directory holds several independent
  applications and no single `UIConfig` could satisfy the full union. A single-app project has no
  use for it.
- **`--paths`** exists solely so the analyzer can resolve `@reqquest/api` when `node_modules` is not
  installed. If `@reqquest/api` is in your `node_modules`, ordinary resolution finds it and this
  flag does nothing for you. Do not copy it out of this repo's `demos/package.json`.

## Troubleshooting

**Keys are `string` and nothing is checked, but there is no error.** The declaration is outside your
tsconfig `include`, so the program never loads it. Check where you emitted it relative to `include`.

**`--check-keys` reports stale immediately after regenerating.** Either the check and the emit were
invoked with different flags, or a formatter reformatted the file. Compare the two commands
character by character, and confirm the file is in `.prettierignore`.

**`Cannot find module 'typescript'`.** The analyzer's optional peer dependency is missing where you
ran it — most often a Docker stage installed with `--omit=dev`.

**Every import from `@reqquest/api` fails with "has no exported member."** The `export {}` at the
top of the generated file was removed, so `declare module` replaced the package instead of
augmenting it. Regenerate the file.

**The Docker build passes but drift still ships.** The gate is not in the build's dependency chain
(nothing derives `FROM keycheck`), or `.dockerignore` is excluding the declaration.

## What happens if you skip the gates

Missing prompts degrade rather than crash. `UIRegistry` logs `console.error` naming the key — in
production as well as development — and the prompt renders an inline "this prompt is unavailable"
notice in place of the component, leaving the rest of the page usable.

That is a safety net, not a substitute for the build checks: you learn about it when a user hits the
screen.

## Separate repos for API and UI

This is the case ReqQuest does not solve for you today, so it is worth stating plainly rather than
leaving to inference.

The analyzer builds a real `ts.createProgram` over your definitions' sources. A UI repo that only
consumes a published `@reqquest/api` therefore cannot generate its own declaration — it can only
receive one. Generate both files on the API side, and deliver the `@reqquest/ui` one to the UI repo
as a committed artifact.

There is no automated transport across that boundary and no check that the two stayed in step, which
is exactly why the runtime degradation above exists. Treat the delivery as a release step you own.
