<script lang="ts">
  import { Button } from 'carbon-components-svelte'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import { afterNavigate } from '$app/navigation'
  import type { PageData } from './$types'
  import ProgressNavContainer from '../ProgressNavContainer.svelte'
  import { ApplicantProgramList } from '$internal'
  import { uiRegistry } from '../../../../../local/index.js'
  import { enumApplicationStatus, enumIneligiblePhases } from '$lib'

  export let data: PageData
  $: ({ applicationsForNav, appRequestForExport } = data)

  let prevHref: string | undefined
  let nextHref: string | undefined
  const getNextHref = getContext<Writable<{ nextHref: string | undefined, prevHref: string | undefined }>>('nextHref')
  $: ({ prevHref, nextHref } = $getNextHref)

  afterNavigate(() => {
    const h2 = document.querySelector('h2')
    if (h2) {
      h2.tabIndex = -1
      h2.focus()
    }
  })
</script>

<ProgressNavContainer title="Your potential programs" subtitle='Select "Start" to answer additional qualifying questions about the benefits you may be eligible for.'>
  {@const eligibleApplicationsForNav = applicationsForNav.filter(a => a.ineligiblePhase !== enumIneligiblePhases.PREQUAL)}
  <div class="max-w-screen-md mx-auto">    
    <ApplicantProgramList applications={eligibleApplicationsForNav} appRequest={appRequestForExport} />
    {#if eligibleApplicationsForNav.some(a => a.status === enumApplicationStatus.INELIGIBLE)}
      <div class="program-helptext">
        If you believe you should be eligible, read the tooltips above and review your answers. If you believe there is an error, please contact us.
      </div>
    {/if}
  </div>
  <div class='form-submit flex gap-12 justify-center mt-16'>
    {#if prevHref}
      <Button kind="ghost" href={prevHref}>Back</Button>
    {/if}
    <Button type="submit" href={nextHref}>
      {#if nextHref?.endsWith('/review')}
        Review {uiRegistry.getWord('appRequest')}
      {:else}
        Continue
      {/if}
    </Button>
  </div>

</ProgressNavContainer>

<style>
  .program-helptext {
    text-align: center;
    font-size: 0.9rem;
  }
</style>
