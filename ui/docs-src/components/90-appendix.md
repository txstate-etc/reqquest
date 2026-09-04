## Appendix: version drift, deep imports, sources

### Documented upstream, not available at this version

The design-system doc site tracks carbon-svelte's main branch and runs ahead of what a ReqQuest
project resolves. These are documented there but are **not** exported by the version in the table at
the top of this file, so importing them will not compile. They are omitted from the catalog above:

%%SITE_ONLY%%

Two known cases and where they actually live:

- **`FieldRichText`** - a CKEditor 5 field, shipped separately as
  `@txstate-mws/carbon-svelte-ckeditor`, not from the main package.
- **`ExpandCollapseAll`** - not exported at this version.

### Exported but not on the doc site

Any entry above carrying an `<!-- no upstream doc at this version -->` marker had its props read out
of the component source instead. Those entries have no example and no events table; the props are
accurate but thin. `LoadingIcon`, `ScrollOverflow`, `SiteMap`, `FormInlineNotification`,
`FieldMultiselectPills`, `FieldUploadTable` and the skeleton family are usually in this bucket.

### Present in `dist/` but not re-exported

These exist in the package but are not in its barrel, so they need a deep import and are not covered
above. Treat them as internal; the barrel is the supported surface.

```ts
import BreadcrumbNav from '@txstate-mws/carbon-svelte/dist/BreadcrumbNav.svelte'
import LoadingBar from '@txstate-mws/carbon-svelte/dist/LoadingBar.svelte'
import ProgressNavStep from '@txstate-mws/carbon-svelte/dist/ProgressNavStep.svelte'
import TagSkeleton from '@txstate-mws/carbon-svelte/dist/TagSkeleton.svelte'
import UserImpersonation from '@txstate-mws/carbon-svelte/dist/UserImpersonation.svelte'
```

`@reqquest/ui` has one of these too: `DelayedSkeleton` is compiled into `dist/components/` but is not
re-exported from the barrel. The framework's own screens use it via `$lib`; downstream code should
register a `loader` on the prompt instead of mounting it directly.

### When this file is not enough

- **Props, exactly.** `carbon-svelte` ships unbundled, so
  `node_modules/@txstate-mws/carbon-svelte/dist/<Name>.svelte` is the real source with its JSDoc
  intact, and `dist/<Name>.svelte.d.ts` beside it has the resolved prop types.
- **Item and definition shapes.** `node_modules/@txstate-mws/carbon-svelte/dist/util.d.ts` is the
  single best reference - `ColumnDefinition`, `ActionItem`, `TagItem`, `NavigationItem`,
  `ShellItem`, `UserProfile` and friends, all heavily commented.
- **The ReqQuest contract.** `node_modules/@reqquest/ui/dist/registry.d.ts` carries the full
  `UIConfig` and `PromptDefinition` JSDoc, and `dist/keys.d.ts` explains the key augmentation.
- **Keys and registration end to end.** `docs/downstream-setup.md` in the reqquest repo.
- **Live examples.** The design-system site renders every component with source:
  <https://component-library.app.qual.txst.edu>.

### Sources and regeneration

The carbon-svelte sections of this file are generated. The design-system team publishes machine
-readable docs at:

- <https://component-library.app.qual.txst.edu/llms.txt> - the index
- <https://component-library.app.qual.txst.edu/llms-full.txt> - everything in one file
- `https://component-library.app.qual.txst.edu/llms/<Name>.md` - one component

Anything else on that host answers `200` with the SPA shell rather than a `404`, so a fetch has to
sniff the body, not the status. The generator does.

To rebuild after a carbon-svelte bump:

```
cd ui
npm run docs:components          # regenerate ui/src/lib/components.md
npm run docs:components:check    # CI gate: fails if the committed file is stale
```

Every `svelte` fence in the Recipes section is meant to compile as written. To re-verify after
editing one, extract the fences into a scratch folder inside a real project's `src/local` and run
`npx svelte-check` there - `ColumnList`'s requirement that row types carry an `id` was caught that
way, not by reading.

Hand-written sections live in `ui/docs-src/components/`. To replace a generated entry with a
hand-written one, drop a file at `ui/docs-src/components/overrides/<Name>.md` and it is used
verbatim. Do not edit `components.md` directly - the next build discards it.

The file ships to downstream projects because `svelte-package` copies non-code files out of
`src/lib` into `dist`, and `package.json` ships `"files": ["dist"]`. Downstream it is at
`ui/node_modules/@reqquest/ui/dist/components.md`.
