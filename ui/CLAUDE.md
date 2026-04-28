- UI built with svelte 5 but no runes yet, svelte 4 reactivity/stores or @txstate-mws/svelte-store
- built as SPA, all client-side routing, no SSR even though sveltekit prefers SSR
- Very specific technique for env due to SPA build. `ui/.env` looks weird but correct given what apply-env.sh will do.
- Component library @txstate-mws/carbon-svelte based on carbon-components-svelte, based on the IBM Carbon design system
- Prefer using components from @txstate-mws/carbon-svelte, then carbon-components-svelte, then raw HTML/CSS ideally reuse carbon CSS classes/variables.
- Prefer ColumnList over DataTable in almost all situations.
- Prefer icons from carbon-icons-svelte, then custom SVGs
- Tailwind available but prefer not use it, may be deprecated soon
- svelte components in script html style order
- toasts.add() available from @txstate-mws/svelte-components
- luxon for date math and formatting

## Forms and Validation
- Component library based on `@txstate-mws/svelte-forms`, provides a number of `Field` wrappers like `FieldTextInput` and `Form` wrappers like `PanelDialogForm`.
- All input elements from component library, no raw HTML inputs unless UI-only, like navigation select
- svelte-forms specifies system where the UI requests validation from the API after every user input (debounce built in)
- `Form` wrappers accept `validate` and `submit` async functions that call api with/without `validateOnly` param
- API returns `ValidatedResponse` including list of messages meant to inline underneath fields based on `path` or `arg`
- `submit` should not include side effects like toasts or goto, `on:saved` instead, happens after all Form state updates are complete

## API Interaction
- APIBase from @txstate-mws/sveltekit-utils handles bearer token auth, 401 → redirect to login
- Each project `class API extends APIBase` with methods like `getInvoices()`, then `export const api = new API()`
- API methods return typed data
- API methods reshape graphql response to match svelte-forms `Feedback`, APIBase provides `messageForDialog` `mutationForDialog` helpers
- API expected to provide `actions` property on any objects to inform UI current user permission level e.g. { actions: { edit: true, delete: false } }
- API expected to provide top-level endpoint for global permissions / screen access, loaded in top +layout.svelte, available to all pages
- 403 encountered by user is software bug, should not happen unless they type a bad address into URL bar
- APIBase catches API errors and sends toast, all such errors are considered software bugs

## Main Navigation
- top +layout.svelte creates UILayout with prop that lists all possible screens/routes in the app, identifies them by route id and sets title, nav title, grouping, etc
