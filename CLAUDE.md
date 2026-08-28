# ReqQuest

ReqQuest is a **platform** (not a finished app) for building benefit-application systems: an organization offers one or more programs, applicants prove eligibility, reviewers approve or deny. Downstream projects install `@reqquest/api` and `@reqquest/ui`, then define their own programs, requirements, and prompts in code. The full domain model is described in [README.md](README.md); read it when working on domain logic.

## Repo layout

- [api/](api/) — `@reqquest/api`, the GraphQL API library (fastify + type-graphql via `@txstate-mws/graphql-server`, MySQL via `mysql2-async`). Domain folders under `api/src/` (appRequest, application, requirement, prompt, program, period, access...). `api/src/registry/` holds the definition interfaces downstream projects implement.
- [ui/](ui/) — `@reqquest/ui`, the SvelteKit UI library (`@txstate-mws/carbon-svelte`). `ui/src/local/` contains the demo projects' prompt components.
- [demos/](demos/) — runnable demo instances (pet-adoption theme): `simple`, `default`, `multi`, `complex`, `rc`. Each shows the downstream-developer pattern: a `RQServer` started with definitions for programs, requirements, and prompts.
- [test/](test/) — Playwright e2e tests. Run with root `./test.sh`. `up.sh` to run one of the demos (CLI args to choose a demo).
- [docs/](docs/) — sitemap and user stories.

**Regenerate demo keys after changing a definition** — `npm run keys:generate` in [demos/](demos/). `demos/src/keys.generated.d.ts` is generated from the definitions and is what makes `promptKeys`, `requirementKeys` and friends autocomplete and reject typos. It goes stale when a definition is added, removed, renamed, or re-keyed; `./test.sh` runs `keys:check` up front and refuses to proceed on a stale file. It also emits `ui/src/local/keys.generated.d.ts`, which types the UI's component registration. Hot reload regenerates both: the dev stack bind-mounts that one file into the api container and nodemon runs `keys:generate:dev`, so a prompt added on the API side is a valid UI key as soon as you save. That relative `../ui/src/local` path is a monorepo shape and does not transfer — a downstream project whose API definitions and UI live in separate repos has no shared watcher and must regenerate in CI or on dependency install. `./test.sh` checks both files either way. Generating needs `api/dist`. Note the dev stack deletes and rebuilds it on every change to `api/src` or `demos/src`, so run these when the stack is idle — mid-rebuild you get a confusing "could not resolve '@reqquest/api'" or a module-not-found instead.

**Run `npm install` in [demos/](demos/) before relying on your editor there.** It is the one package that is not needed for the docker workflow, so it is easy to leave uninstalled — and when it is, `@reqquest/api` and five other modules do not resolve, every type in `demos/src` becomes an error type, and nothing is checked. Typed key references (`promptKeys`, `requirementKeys`) then silently accept typos in the editor while still failing in the container. `@reqquest/api` resolves to `api/dist`, which is bind-mounted and rebuilt by the running stack, so restart the stack after changing `api/src` to refresh the types the editor sees.

## Domain model (condensed)

- **Period** — an application window with open/close/archive dates. Configurations/enabling/disabling (of prompts/requirements/programs) are per-period and lock as reviews begin.
- **AppRequest** — one applicant's entire submission within a period. Contains one **Application** per program.
- **Program** — a benefit. Each program has an ordered list of requirements.
- **Requirement** — a procedural business rule ("applicant must provide proof of X", paired with "reviewer must evaluate proof of X"). Has a type binding it to a phase: PREQUAL, QUALIFICATION, POSTQUAL, PREAPPROVAL, APPROVAL, ACCEPTANCE, WORKFLOW. Its developer-written logic evaluates collected prompt data and returns an **ApplicationRequirement** status: PENDING, MET, DISQUALIFYING, WARNING (passing-with-caveat), NOT_APPLICABLE. Logic must return PENDING until no further answer could change the result; once non-pending the status must be stable.
- **Prompt / PromptAnswer** — a data-collection screen (a Svelte component) and the answered data per app-request. Requirements consume prompt data only after the prompt is fully "answered" (developer-defined). Prompts are revealed one at a time per requirement while it stays PENDING, so only needed data is collected. Prompts can be shared across requirements; `promptKeysAnyOrder` and `promptKeysNoDisplay` are special dependency modes.
- **Lifecycle** — AppRequest phases: PREQUAL → QUALIFICATION → POSTQUAL → READY_TO_SUBMIT → (submit) → PREAPPROVAL → APPROVAL → blocking WORKFLOW stages → REVIEW_COMPLETE → optional ACCEPTANCE → APPROVED/NOT_APPROVED or ACCEPTED/REJECTED → non-blocking WORKFLOW → COMPLETE. Applications also carry a status (PENDING/ELIGIBLE/INELIGIBLE/ACCEPTED/REJECTED) independent of phase — INELIGIBLE applications still proceed through blocking workflow. CLOSED is an independent flag layered on top of whatever status the request had.
- **Authorization** — Roles map external groups to **Grants** of controls (grouped in Control Groups), optionally restricted by **Tags** (downstream developer-defined, derived from prompt answers, e.g. applicants that chose a specific college). **Exceptions** subtract tagged access from a role; exceptions never escape the role boundary - roles union.

## Conventions

- The `@txstate-mws` skills (graphql-server*, graphql-svelte*, mysql2-async) apply throughout — load the relevant one before working in api/ or ui/.
- Design decision: INELIGIBLE (dead) applications are NOT exempt from blocking workflow or status progression; skipping is modeled by requirements returning NOT_APPLICABLE.
