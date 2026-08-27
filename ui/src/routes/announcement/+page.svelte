<script lang="ts">
  import { api } from "$internal";
  import IntroPanel from "$internal/components/IntroPanel.svelte";
  import { FieldCheckbox, FieldDateTime, FieldRadio, FieldTextArea, FieldTextInput, FieldToggle, Form, TagSet } from "@txstate-mws/carbon-svelte";
  import type { PageData } from "../announcement/$types";
  import { InlineNotification, NotificationActionButton } from 'carbon-components-svelte'

  export let data: PageData
  $: ({ anouncement } = data)

  async function submit (data: any) {
    const { id, status, addLink, ...rest } = data
    if (data.status === 'toggle') {
      delete rest.start
      delete rest.end
    } else {
      data.enabled = false
    }
    const { success, messages, data: newData } = id ? await api.updateAnnouncement(id, rest, false) : await api.createAnnouncement(rest, false)
    return {
      success,
      messages,
      data: newData
    }
  }

  async function validate (data: any) {
    const { id, status, addLink, ...rest } = data
    const { messages } = await api.createAnnouncement(rest)
    return messages
  }

</script>
<IntroPanel
  title="Applicant dashboard message"
  subtitle='This is a time-sensitive message that will automatically display to applicants when enabled or scheduled.'
>
  <TagSet
    tags={[{ label: 'Enabled', type: 'green' }, { label: 'Scheduled', type: 'blue' }]}
    tagType="status"
    tagSize="sm"
  />
</IntroPanel>

<div class="md:w-1/2">
<Form let:data class='w-md' {submit} {validate} preload={{ ...anouncement, status: anouncement?.start && anouncement?.end ? 'data' : 'toggle', addLink: anouncement?.link || anouncement?.linkText }}>
  <FieldRadio
    path='status'
    required
    labelText="Status"
    defaultValue='toggle'
    items={[
      { label: 'Toggle on and off', value: 'toggle' },
      { label: 'Date range', value: 'date' }
    ]} />
    {#if data.status === 'toggle'}
      <FieldToggle path='enabled' labelText='active' labelA='Message inactive' labelB='Message active' />
    {:else}
      <FieldDateTime required path='start' labelText='Start time' />
      <FieldDateTime required path='end' labelText='End time' />
    {/if}

    <FieldTextInput required path='subject' labelText='Message title'/>
    <FieldTextArea required path='body' labelText='Message text' />

    <FieldCheckbox path='addLink' labelText='Add link' />

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
      <div>
        <p class="font-bold text-sm">No message to display</p>
        <p class="text-sm">Nothing will be shown to applicants until a message is configured.</p>
      </div>
    {/if}
</Form>
</div>