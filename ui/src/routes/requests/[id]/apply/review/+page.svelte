<script lang="ts">
  import { Button } from 'carbon-components-svelte'
  import Touch_1 from 'carbon-icons-svelte/lib/Touch_1.svelte'
  import { invalidate, goto } from '$app/navigation'
  import { api, ApplicationDetailsView } from '$lib'
  import { enumAppRequestStatus } from '$lib/typed-client'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../../local'
  import { getContext } from 'svelte'

  /**
   * This page will allow applicants to review all the information they've
   * entered so far, and to navigate to any prompts that need correction, then
   * allows them to submit the app request.
   */
  export let data: PageData
  $: ({ appRequestForNavigation, prequalPrompts, appRequestData } = data)

  const getNavigation = getContext<() => { nextHref?: string, prevHref?: string }>('nextHref')
  $: ({ prevHref } = getNavigation())
  $: hasPreviousPrompt = !!prevHref

  async function handleBack () {
    if (prevHref) {
      await goto(prevHref)
    }
  }

  // Build lookup of relatedConfigData by prompt key for component to use
  $: relatedConfigDataLookup = appRequestData.applications
    .flatMap(a => a.requirements.flatMap(r => r.prompts))
    .reduce<Record<string, any>>((acc, curr) => ({
      ...acc,
      [curr.key]: curr.relatedConfigData
    }), {})

  async function onSubmit () {
    await api.submitAppRequest(appRequestForNavigation.id)
    await invalidate('request:apply')
  }
</script>

<ApplicationDetailsView
  appRequest={appRequestForNavigation}
  appData={appRequestData.data}
  {prequalPrompts}
  postqualPrompts={undefined}
  {relatedConfigDataLookup}
  {uiRegistry}
  title="Review Your Submission"
  subtitle="Please review all information before submitting."
  expandable={false}
  showWarningsInline={true}
  showAppRequestStatus={false}
  statusDisplay="icons"
>
  <svelte:fragment slot="footer">
    <footer class="[ mt-6 ] flow">
      {#if uiRegistry.config.supportUrl}
        <p class="text-center">If you think this was a mistake please review your answers or reach out through the support page.</p>
      {/if}
      <div class="footer-actions">
        {#if hasPreviousPrompt}
            <Button kind="ghost" on:click={handleBack}>Back</Button>
        {/if}
        {#if uiRegistry.config.supportUrl}
            <Button kind="ghost" href={uiRegistry.config.supportUrl}>Support</Button>
        {/if}
        {#if appRequestForNavigation.status === enumAppRequestStatus.READY_TO_SUBMIT}
          <Button icon={Touch_1} on:click={onSubmit}>Submit For Review</Button>
        {/if}
      </div>
    </footer>
  </svelte:fragment>
</ApplicationDetailsView>

<style>
  .footer-actions {
    display: flex;
    gap: 3rem;
    justify-content: center;
    margin-top: 2rem;
  }
</style>
