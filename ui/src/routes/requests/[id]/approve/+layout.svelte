<script lang="ts">
  import { TabLinks } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import { Button, Select, SelectItem } from 'carbon-components-svelte'
  import { invalidateAll } from '$app/navigation'
  import { resolve } from '$app/paths'
  import type { LayoutData } from './$types.js'
  import { api, IntroPanel, applicantStatuses, REVIEWER_STATUS_CONFIG, longNumericTime, phaseChangeMutations, type PhaseChangeMutations } from '$lib'

  export let data: LayoutData
  $: ({ basicRequestData, requestId } = data)
  $: tabs = [
    ...(basicRequestData.applications.map(a => ({
      label: a.navTitle,
      href: resolve(`/requests/${requestId}/approve/${a.programKey}`)
    }))),
    {
      label: 'Activity log',
      href: resolve(`/requests/${requestId}/approve/activity`)
    }
  ]

  const translateMutations = {
    submitAppRequest: 'submitted request for review.',
    returnToApplicant: 'returned request to applicant',
    completeReview: 'completed request review',
    returnToReview: 'returned request to review',
    acceptOffer: 'accepted offer',
    returnToOffer: 'returned request to applicant to accept offer',
    completeRequest: 'marked request as complete',
    returnToNonBlocking: 'returned request to non-blocking workflow tasks'
  }

  let appRequestAction: '' | PhaseChangeMutations | 'reopen' | 'close' = ''
  async function onAppRequestAction () {
    if ((phaseChangeMutations as readonly string[]).includes(appRequestAction)) {
      await appRequestPhaseChange(appRequestAction as PhaseChangeMutations)
    } else if (appRequestAction === 'close') {
      await closeRequest()
    } else if (appRequestAction === 'reopen') {
      await reopenRequest()
    }
  }

  async function appRequestPhaseChange (action: PhaseChangeMutations) {
    const response = await api.appRequestPhaseChange(requestId, action)
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Action Failed',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: `Successfully ${translateMutations[action]}.`
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
  tags={[{ label: REVIEWER_STATUS_CONFIG[basicRequestData.status].label, type: REVIEWER_STATUS_CONFIG[basicRequestData.status].color }]}
>
  <div class="block-end flex items-center" slot="block-end">
    <section class="text-base text-center flex-col gap-2 mr-[12px]">
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
    {#if basicRequestData.actions.completeReview || basicRequestData.actions.completeRequest || basicRequestData.actions.reopen || basicRequestData.actions.close || basicRequestData.actions.returnToApplicant || basicRequestData.actions.returnToOffer || basicRequestData.actions.returnToReview || basicRequestData.actions.returnToNonBlocking || basicRequestData.actions.submit || basicRequestData.actions.acceptOffer}
      <Select bind:selected={appRequestAction} labelText="Application action" size="sm">
        <SelectItem value="" text="Choose one" />
        {#if basicRequestData.actions.completeReview}
          <SelectItem value="completeReview" text="Complete Review" />
        {/if}
        {#if basicRequestData.actions.completeRequest}
          <SelectItem value="completeRequest" text="Complete Request" />
        {/if}
        {#if basicRequestData.actions.reopen}
          <SelectItem value="reopen" text="Reopen Request" />
        {/if}
        {#if basicRequestData.actions.close}
          <SelectItem value="close" text="Close Request" />
        {/if}
        {#if basicRequestData.actions.returnToApplicant}
          <SelectItem value="returnToApplicant" text="Return To Applicant" />
        {/if}
        {#if basicRequestData.actions.returnToOffer}
          <SelectItem value="returnToOffer" text="Return To Offer" />
        {/if}
        {#if basicRequestData.actions.returnToReview}
          <SelectItem value="returnToReview" text="Return To Review" />
        {/if}
        {#if basicRequestData.actions.returnToNonBlocking}
          <SelectItem value="returnToNonBlocking" text="Return To Final Workflow Tasks" />
        {/if}
        {#if basicRequestData.actions.submit}
          <SelectItem value="submit" text="Submit On Behalf Of Applicant" />
        {/if}
        {#if basicRequestData.actions.acceptOffer}
          <SelectItem value="acceptOffer" text="Accept Offer On Behalf Of Applicant" />
        {/if}
      </Select>
      <Button on:click={onAppRequestAction} size="small" class="ml-[4px]">Apply</Button>
    {/if}
  </div>
</IntroPanel>
<TabLinks {tabs} />
<slot />
<style>
  .block-end :global(.bx--label) {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
  }
</style>
