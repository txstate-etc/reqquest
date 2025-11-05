<script lang="ts">
  import { TabLinks } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import { Button } from 'carbon-components-svelte'
  import { invalidateAll } from '$app/navigation'
  import { resolve } from '$app/paths'
  import type { LayoutData } from './$types.js'
  import { api, IntroPanel, applicantStatuses, APP_REQUEST_STATUS_CONFIG, longNumericTime } from '$lib'

  export let data: LayoutData
  $: ({ basicRequestData, requestId } = data)
  $: tabs = [
    ...(basicRequestData.applications.map(a => ({
      label: a.navTitle,
      href: resolve(`/requests/${requestId}/approve/${a.programKey}`, {})
    }))),
    {
      label: 'Activity log',
      href: resolve(`/requests/${requestId}/approve/activity`, {})
    }
  ]

  async function makeOffer () {
    const response = await api.makeOffer(requestId)
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Could not send application to applicant',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: 'Application sent to applicant.'
      })
    }
    await invalidateAll()
  }

  async function closeRequest () {
    const response = await api.closeAppRequest(requestId)
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Could not close application request',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: 'Application request closed.'
      })
    }
    await invalidateAll()
  }

  async function reopenRequest () {
    const response = await api.reopenAppRequest(requestId)
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Could not reopen application request',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: 'Application request reopened.'
      })
    }
    await invalidateAll()
  }

</script>

<IntroPanel
  title={basicRequestData.period.name + (basicRequestData.period.code ? ` (${basicRequestData.period.code})` : '')}
  subtitle="Review and complete the application below or advance it in the workflow."
  tags={[{ label: APP_REQUEST_STATUS_CONFIG[basicRequestData.status].label, type: APP_REQUEST_STATUS_CONFIG[basicRequestData.status].color }]}
>
  <svelte:fragment slot="block-end">
    <section class="text-base text-center flex-col gap-2">
      <dl class="flex gap-4  text-sm">
        <div class="flex flex-col bg-[var(--cds-ui-03,#d9d9d9)] py-4 px-4  justify-center">
          <dt class="font-bold">
            {#if basicRequestData.closedAt}
              Closed
            {:else if applicantStatuses.has(basicRequestData.status)}
              Submit By
            {:else if !basicRequestData.complete}
              Review By
            {:else}
              Auto-Closes
            {/if}:
          </dt>
          <dd>
            {#if basicRequestData.closedAt}
              <time datetime={basicRequestData.closedAt}>{longNumericTime(basicRequestData.closedAt)}</time>
            {:else if applicantStatuses.has(basicRequestData.status)}
              {#if basicRequestData.period.closeDate}
                <time datetime={basicRequestData.period.closeDate}>{longNumericTime(basicRequestData.period.closeDate)}</time>
              {:else}
                No deadline
              {/if}
            {:else if !basicRequestData.complete}
              {#if basicRequestData.period.archiveDate}
                <time datetime={basicRequestData.period.archiveDate}>{longNumericTime(basicRequestData.period.archiveDate)}</time>
              {:else}
                No deadline
              {/if}
            {:else}
              {#if basicRequestData.period.archiveDate}
                <time datetime={basicRequestData.period.archiveDate}>{longNumericTime(basicRequestData.period.archiveDate)}</time>
              {:else}
                Never
              {/if}
            {/if}
          </dd>
        </div>
      </dl>
    </section>

    {#if basicRequestData.actions.offer}
      <Button on:click={makeOffer}>Complete Review</Button>
    {:else if basicRequestData.actions.reopen}
      <Button on:click={reopenRequest}>Reopen Request</Button>
    {:else if basicRequestData.actions.close && basicRequestData.complete}
      <Button on:click={closeRequest}>Close Request</Button>
    {/if}
  </svelte:fragment>
</IntroPanel>
<TabLinks {tabs} />
<slot />
