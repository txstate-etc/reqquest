<script lang="ts">
  import { toasts } from '@txstate-mws/svelte-components'
  import { Button } from 'carbon-components-svelte'
  import Touch_1 from 'carbon-icons-svelte/lib/Touch_1.svelte'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import { afterNavigate, goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import type { ResolvedPathname } from '$app/types'
  import { api, ApplicationDetailsView, enumAppRequestStatus } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../../local'

  /**
   * This page will allow applicants to review all the information they've
   * entered so far, and to navigate to any prompts that need correction, then
   * allows them to submit the app request.
   */
  export let data: PageData
  $: ({ appRequestForExport, applicationsAccept } = data)

  const nextHref = getContext<Writable<{ nextHref?: ResolvedPathname, prevHref?: ResolvedPathname }>>('nextHref')
  $: hasPreviousPrompt = !!$nextHref.prevHref

  async function handleBack () {
    if ($nextHref.prevHref) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve -- already resolved
      await goto($nextHref.prevHref)
    }
  }

  async function onSubmit () {
    const resp = await api.appRequestPhaseChange(appRequestForExport.id, 'acceptOffer')
    if (resp.success) await goto(resolve('/dashboards/applicant'))
    else toasts.add({ type: 'error', title: 'Submission Failed', message: resp.messages.map(m => m.message).join('\n') || 'There was an error submitting your application. Please try again later.' })
  }

  afterNavigate(() => {
    const h2 = document.querySelector('h2')
    if (h2) {
      h2.tabIndex = -1
      h2.focus()
    }
  })
</script>

<ApplicationDetailsView
  appRequest={appRequestForExport}
  applications={applicationsAccept}
  appData={appRequestForExport.data}
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
        <p class="text-center">If you think there was a mistake please review your answers or reach out through the support page.</p>
      {/if}
      <div class="footer-actions">
        {#if hasPreviousPrompt}
            <Button kind="ghost" on:click={handleBack}>Back</Button>
        {/if}
        {#if uiRegistry.config.supportUrl}
            <Button kind="ghost" href={uiRegistry.config.supportUrl}>Support</Button>
        {/if}
        {#if appRequestForExport.status === enumAppRequestStatus.READY_TO_ACCEPT}
          <Button icon={Touch_1} on:click={onSubmit}>Submit</Button>
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
