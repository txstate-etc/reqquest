<!--
  @component
  A button inside a prompt's form component for when the user should decide the moment something
  happens on the server - "Send this note to the applicant" being the typical case. Saving the
  prompt cannot be that moment on the reviewer screen, because inline reviewer forms autosave a few
  hundred milliseconds after every pause in typing, and a "send when the note changes" rule would
  email every half-typed draft.

  Clicking writes a fresh `{ clickId, at, snapshot }` record into the prompt data at `path` and saves
  immediately, so what gets acted on is exactly what the user is looking at. On the API side, the
  prompt's `afterUpdate` calls `promptActionFired(data[path], oldData?.[path])` to tell a click
  apart from an ordinary save, and the prompt's schema needs `promptActionSchema` at `path`. In a
  form that does not autosave (the full-screen modal, an applicant page) the click is held until
  the user saves the form, and the button says so.

  Afterward the button shows when it was last clicked. Pass the text being acted on as `snapshot`
  and it will also point out when that text has been edited since.
-->
<script lang="ts">
  import { Field, FORM_CONTEXT, type FormStore } from '@txstate-mws/svelte-forms'
  import { Button, Modal } from 'carbon-components-svelte'
  import Send from 'carbon-icons-svelte/lib/Send.svelte'
  import WarningAltFilled from 'carbon-icons-svelte/lib/WarningAltFilled.svelte'
  import { DateTime } from 'luxon'
  import { getContext } from 'svelte'
  import { equal, randomid } from 'txstate-utils'

  /**
   * Path in the prompt data where the click is recorded. Add `promptActionSchema` from
   * `@reqquest/api` to your prompt's schema at the same path.
   * @type {string}
   */
  export let path: string

  /**
   * Button text, e.g. 'Send note to applicant'.
   * @type {string}
   */
  export let label: string

  /**
   * Button text once it has been clicked before, e.g. 'Resend note'. Defaults to `label`.
   * @type {string | undefined}
   */
  export let againLabel: string | undefined = undefined

  /**
   * Status shown after a click, followed by the date, e.g. 'Sent to applicant' becomes
   * "Sent to applicant Nov 19, 2026, 2:14 PM".
   * @type {string}
   */
  export let doneText = 'Done'

  /**
   * Whatever the action acts on, remembered with the click so the button can tell the user when
   * it has changed since, e.g. the note text. Leave undefined to skip that check.
   * @type {any}
   */
  export let snapshot: any = undefined

  /**
   * Shown next to the status when `snapshot` no longer matches what was there at the last click.
   * @type {string}
   */
  export let changedText = 'Edited since then.'

  /**
   * When set, clicking asks for confirmation with this text first. Recommended for anything that
   * reaches outside the system, like an email - a stray click cannot be taken back.
   * @type {string | undefined}
   */
  export let confirmText: string | undefined = undefined

  /**
   * Disables the button, e.g. while the note it would send is empty.
   * @type {boolean}
   */
  export let disabled = false

  interface ActionRecord { clickId: string, at: string, snapshot?: any }

  const store = getContext<FormStore>(FORM_CONTEXT)
  let confirming = false
  /** the clickId of a click made on this page, which may still be waiting for the form's Save */
  let lastClickId: string | undefined

  async function act (finalPath: string) {
    confirming = false
    const record: ActionRecord = { clickId: randomid(), at: new Date().toISOString(), snapshot }
    lastClickId = record.clickId
    await store.setField(finalPath, record)
    // an autosave form would get here on its own after its debounce; skip the wait so the button
    // never claims "sent" for a click the API has not seen
    if (store.autoSave) await store.submit({ autoSave: true })
  }

  function onClick (finalPath: string) {
    if (confirmText) confirming = true
    else void act(finalPath)
  }

  function formatAt (at: string) {
    return DateTime.fromISO(at).toLocaleString(DateTime.DATETIME_MED)
  }
</script>

<Field {path} let:value let:finalPath>
  {@const record = value as ActionRecord | undefined}
  {@const waitingForSave = !store.autoSave && record?.clickId != null && record.clickId === lastClickId && $store.hasUnsavedChanges}
  {@const changed = record?.snapshot !== undefined && snapshot !== undefined && !equal(record.snapshot, snapshot)}
  <div class="prompt-action">
    <Button kind={record ? 'tertiary' : 'primary'} size="field" icon={Send} disabled={disabled || $store.submitting} on:click={() => { onClick(finalPath) }}>
      {record ? (againLabel ?? label) : label}
    </Button>
    {#if waitingForSave}
      <span class="prompt-action-status">Will happen when you save.</span>
    {:else if record}
      <span class="prompt-action-status" role="status">
        {doneText} {formatAt(record.at)}.
        {#if changed}
          <span class="prompt-action-changed"><WarningAltFilled size={16} /> {changedText}</span>
        {/if}
      </span>
    {/if}
  </div>
  <Modal
    bind:open={confirming}
    modalHeading={label}
    primaryButtonText={record ? (againLabel ?? label) : label}
    secondaryButtonText="Cancel"
    on:submit={() => act(finalPath)}
    on:click:button--secondary={() => { confirming = false }}
  >
    <p>{confirmText}</p>
  </Modal>
</Field>

<style>
  .prompt-action {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
  }
  .prompt-action-status {
    font-size: 0.875rem;
    color: var(--cds-text-secondary, #525252);
  }
  .prompt-action-changed {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--cds-text-primary, #161616);
  }
  .prompt-action-changed :global(svg) {
    fill: var(--cds-support-warning, #f1c21b);
  }
</style>
