<script lang="ts">
  import { api } from "$internal"
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import IntroPanel from "$internal/components/IntroPanel.svelte"
  import { FieldCheckbox, FieldDateTime, FieldRadio, FieldTextArea, FieldTextInput, FieldToggle, Form, TagSet } from "@txstate-mws/carbon-svelte"
  import type { PageData } from "../announcement/$types"
  import { Button, InlineNotification, NotificationActionButton } from 'carbon-components-svelte'
  import { DateTime } from "luxon"
  import { invalidateAll } from "$app/navigation"
  import { toasts } from "@txstate-mws/svelte-components"
  import TextClearFormat from "carbon-icons-svelte/lib/TextClearFormat.svelte";


  export let data: PageData
  $: ({ anouncement } = data)

  let store: FormStore | undefined

  async function submit (data: any) {
    const { id, addLink, ...rest } = data
    const { success, messages, data: newData } = id ? await api.updateAnnouncement(id, rest, false) : await api.createAnnouncement(rest, false)
    if (success) toasts.add({ message: 'This message has been saved.', title: 'Success', type: 'success' })
    return {
      success,
      messages,
      data: newData
    }
  }

  async function validate (data: any) {
    const { id, addLink, ...rest } = data
    const { messages } = id ? await api.updateAnnouncement(id, rest) : await api.createAnnouncement(rest)
    return messages
  }

  async function saved () {
    await invalidateAll()
  }

  async function reset () {
    if (anouncement?.id) await api.deleteAnnouncement(anouncement.id)
    await invalidateAll()
    store?.reset()
    store?.setField('type', 'toggle')
  }

  $: enabled = anouncement?.enabled || ((anouncement?.end != null && DateTime.fromISO(anouncement.end) >= DateTime.now()) && anouncement?.start != null && DateTime.fromISO(anouncement.start) <= DateTime.now())

</script>
<IntroPanel
  title="Applicant dashboard message"
  subtitle='This is a time-sensitive message that will automatically display to applicants when enabled or scheduled.'
>
  <div class="flex items-center gap-2">
    <TagSet
      tags={enabled ? [{ label: 'Active', type: 'green' }] : [{ label: 'Inactive', type: 'purple' }]}
      tagType="status"
      tagSize="sm"
    />
    <span class="text-sm">{enabled ? 'This message is currently displaying to applicants.' : 'This message is not currently displaying to applicants.'}</span>
  </div>
</IntroPanel>

<Form
  let:data
  {submit}
  {validate}
  bind:store
  on:saved={saved}
  hideFallbackMessage
  preload={anouncement ? { ...anouncement, addLink: anouncement?.link || anouncement?.linkText } : undefined}
>
  <FieldRadio
    path='type'
    required
    labelText="Status"
    defaultValue='toggle'
    class="md:w-[645px]"
    items={[
      { label: 'Toggle on and off', value: 'toggle' },
      { label: 'Date range', value: 'date' }
    ]} />
    {#if data.type === 'toggle'}
      <FieldToggle path='enabled' labelText='active' labelA='Message inactive' labelB='Message active' />
    {:else}
      <div class="md:w-[645px] flow datetime-full">
        <FieldDateTime required path='start' labelText='Start time' />

        <FieldDateTime required path='end' labelText='End time' helperText='This is how long the message will display.' />
        <div class="flex justify-end mt-0">
          <Button size='small' kind='ghost' on:click={() => { store?.setField('start', undefined); store?.setField('end', undefined)}} icon={TextClearFormat}>Reset</Button>
        </div>
      </div>
    {/if}

    <div class="md:w-[645px] flow">
      <FieldTextArea rows={1} required path='subject' labelText='Message title' maxCount={40} class="md:w-[645px]"/>
      <FieldTextArea required path='body' labelText='Message text' maxCount={140} class="md:w-[645px]"/>
    </div>

    <FieldCheckbox path='addLink' labelText='Add link' on:change={(e: any) => {
      if (!e.target.checked) {
        store?.setField('linkText', undefined)
        store?.setField('link', undefined)
      }
    }} />

    {#if data.addLink}
      <div class="flex flex-row gap-4">
        <FieldTextInput required path='linkText' labelText='Link text' />
        <FieldTextInput required path='link' labelText='URL' />
      </div>
    {/if}


    {#if data.subject && data.body}
      <div class='w-full'>
        <InlineNotification
          kind="warning"
          title={data.subject}
          subtitle={data.body}
          lowContrast
          hideCloseButton
          class="time-sensitive-banner"
        >
          <svelte:fragment slot="actions">
            {#if data.link}
            <NotificationActionButton href={data.link}>{data.linkText}</NotificationActionButton>
            {/if}
          </svelte:fragment>
        </InlineNotification>
      </div>
    {:else}
      <div class="bg-[var(--cds-ui-01)] p-4 gap-8 md:w-[645px]">
        <p>No message to display</p>
        <p class="text-sm text-[--cds-text-02]">Nothing will be shown to applicants until a message is configured.</p>
      </div>
    {/if}
  
    <div slot='submit' class="flex gap-4">
      <Button type='submit'>Save</Button>
      <Button kind='ghost' on:click={reset} icon={TextClearFormat}>Reset</Button>
    </div>
</Form>

<style>
  /* Stretch FieldDateTime (date input + time input + am/pm select) across the full form width. */
  .datetime-full :global(.picker-row) {
    gap: .5rem;
  }
  .datetime-full :global(.picker-row > *) {
    flex-grow: 1;
    width: 100%;
  }
  .datetime-full :global(.bx--text-input__field-wrapper) {
    width: 100% !important;
  }
  .datetime-full :global(.bx--date-picker-input__wrapper),
  .datetime-full :global(.bx--date-picker--single),
  .datetime-full :global(.bx--date-picker-container),
  .datetime-full :global(.flatpickr-wrapper),
  .datetime-full :global(input.bx--date-picker__input),
  .datetime-full :global(.bx--time-picker .bx--select-input),
  .datetime-full :global(.bx--time-picker),
  .datetime-full :global(.bx--time-picker__input),
  .datetime-full :global(.bx--time-picker__input-field) {
    width: 100%;
  }

  :global(div.time-sensitive-banner.bx--inline-notification) {
    min-width: unset;
    max-width: fit-content;
    flex-wrap: wrap;
    width: auto;
    align-items: center;
  }
  .time-sensitive-banner :global(.bx--inline-notification__details) {
    flex-grow: unset;
  }
  .time-sensitive-banner :global(.bx--inline-notification__text-wrapper) {
    display: block;
  }
</style>