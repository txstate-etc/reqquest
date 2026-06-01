<script lang="ts">
  import { toasts } from '@txstate-mws/svelte-components'
  import { Button } from 'carbon-components-svelte'
  import Touch_1 from 'carbon-icons-svelte/lib/Touch_1.svelte'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import { afterNavigate, goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import type { ResolvedPathname } from '$app/types'
  import { api, ApplicationDetailsView } from '$internal'
  import { enumAppRequestStatus } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../../local'
  import { enumIneligiblePhases } from '$lib'

  /**
   * This page will allow applicants to review all the information they've
   * entered so far, and to navigate to any prompts that need correction, then
   * allows them to submit the app request.
   */
  export let data: PageData
  $: ({ appRequestForExport, prequalPrompts, postqualPrompts, applicationsForNav } = data)

  const nextHref = getContext<Writable<{ nextHref?: ResolvedPathname, prevHref?: ResolvedPathname }>>('nextHref')
  $: previousHref = nextHref ? $nextHref.prevHref : undefined

  async function handleBack () {
    if (previousHref) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve -- already resolved
      await goto(previousHref)
    }
  }

  async function onSubmit () {
    const resp = await api.appRequestPhaseChange(appRequestForExport.id, 'submitAppRequest')
    if (resp.success) {
      toasts.add({ type: 'success', title: 'Submission Succeeded', message: 'Successfully submitted application for review' })
      await goto(resolve('/dashboards/applicant'))
    } else {
      toasts.add({ type: 'error', title: 'Submission Failed', message: resp.messages.map(m => m.message).join('\n') || 'There was an error submitting your application. Please try again later.' })
    }
  }

  afterNavigate(({ from }) => {
    if (from?.url.pathname) previousHref = from.url.pathname + from.url.search
    const h2 = document.querySelector('h2')
    if (h2) {
      h2.tabIndex = -1
      h2.focus()
    }
  })
</script>
<div class:max-w-screen-md={uiRegistry.config.applicantReviewMaxWidth !== false} class:mx-auto={uiRegistry.config.applicantReviewMaxWidth !== false}>
  <ApplicationDetailsView
    appRequest={appRequestForExport}
    applications={applicationsForNav.filter(a => a.ineligiblePhase !== enumIneligiblePhases.PREQUAL)}
    appData={appRequestForExport.data}
    {prequalPrompts}
    {postqualPrompts}
    {uiRegistry}
    title="Review your application"
    subtitle="Confirm the benefits shown are the ones you are requesting and that your responses are correct, or make changes before submitting."
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
          {#if previousHref}
              <Button kind="ghost" on:click={handleBack}>Back</Button>
          {/if}
          {#if uiRegistry.config.supportUrl}
              <Button kind="ghost" href={uiRegistry.config.supportUrl}>Support</Button>
          {/if}
          {#if appRequestForExport.status === enumAppRequestStatus.READY_TO_SUBMIT}
            <Button icon={Touch_1} on:click={onSubmit}>Submit application</Button>
          {/if}
        </div>
      </footer>
    </svelte:fragment>
  </ApplicationDetailsView>
</div>
<style>
  .footer-actions {
    display: flex;
    gap: 3rem;
    justify-content: center;
    margin-top: 2rem;
  }
</style>
