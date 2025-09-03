<script lang="ts">
  import { goto } from '$app/navigation'
  import { base } from '$app/paths'
  import { getApplicationStatusInfo, getAppRequestStatusInfo, getNavigationButton } from '$lib/status-utils.js'
  import { longNumericTime } from '$lib/util.js'
  import { Card, TagSet } from '@txstate-mws/carbon-svelte'
  import { Button } from 'carbon-components-svelte'
  import type { DashboardAppRequest } from './types.js'

  export let request: DashboardAppRequest
  export let actions: any[] = []
  export let showAcceptanceButtons = true
  export let onAcceptanceNavigate: ((requestId: string) => void) | undefined = undefined

  $: statusInfo = getAppRequestStatusInfo(request.status)
  $: navButton = getNavigationButton(request.status, request.id)

  async function handleAcceptanceClick () {
    if (onAcceptanceNavigate) {
      onAcceptanceNavigate(request.id)
    } else {
      await goto(`${base}/requests/${request.id}/apply`)
    }
  }
</script>

<Card
  title={request.period.name}
  subhead={`Started: ${longNumericTime(request.createdAt)}`}
  tags={[{ label: statusInfo.label, type: statusInfo.color }]}
  tagsInBody
  {actions}
  forceOverflow={true}
  navigations={navButton ? [navButton] : []}>

  <!-- Status description -->
  {#if statusInfo.description}
    <p class="pl-1.5 mb-4 text-gray-600 text-sm">{statusInfo.description}</p>
  {/if}

  <!-- Benefits section -->
  <div class="rounded">
    <h4 class="m-0 mb-2 text-lg text-gray-900">Potential benefits</h4>
    <p class="m-0 mb-3 text-gray-600 text-sm">Benefit results will be finalized once the application submission and review is completed.</p>

    {#if request.applications && request.applications.length > 0}
      {#each request.applications as application}
        {@const appStatusTag = getApplicationStatusInfo(application.status)}
        <div class="program-status flex items-center py-2 px-4 mb-4 bg-gray-100">
          <span class="font-medium">{application.title}</span>
          <div class="tagwrap">
            <TagSet tags={[{ label: appStatusTag.label, type: appStatusTag.color }]} />
          </div>

          <!-- Acceptance buttons -->
          {#if showAcceptanceButtons && (request.status === 'ACCEPTANCE' || request.status === 'READY_TO_ACCEPT') && application.status === 'ELIGIBLE'}
            <Button kind="primary" size="small" class="ml-auto"
              on:click={handleAcceptanceClick}>
              {request.status === 'READY_TO_ACCEPT' ? 'Accept Offer' : 'Review Offer'}
            </Button>
          {/if}
        </div>
      {/each}
    {:else}
      <p>No benefits associated with this application.</p>
    {/if}
  </div>

  <!-- Footer info grid -->
  <div class="mt-4 grid grid-cols-3 bg-gray-100">
    <div class="text-center py-4 px-2 border-r border-black">
      <span class="block text-xs font-semibold text-black mb-1">Request number:</span>
      <span class="block text-sm text-gray-900">{request.id.slice(0, 6).toUpperCase()}</span>
    </div>
    <div class="text-center py-4 px-2 border-r border-black">
      <span class="block text-xs font-semibold text-black mb-1">Last updated:</span>
      <span class="block text-sm text-gray-900">{longNumericTime(request.updatedAt)}</span>
    </div>
    <div class="text-center py-4 px-2">
      <span class="block text-xs font-semibold text-black mb-1">Waiting on:</span>
      <span class="block text-sm text-gray-900">{statusInfo.waitingOn}</span>
    </div>
  </div>
</Card>

<style>
  /* Global styles for external component overrides */
  :global(.tagwrap .tag-set > *) {
    max-width: 100% !important;
  }
</style>
