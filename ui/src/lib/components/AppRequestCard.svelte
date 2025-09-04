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
    <p class="pl-1.5 mb-4 text-sm">{statusInfo.description}</p>
  {/if}

  <!-- Benefits section -->
  <div class="rounded">
    <h4 class="m-0 mb-2 text-lg benefits-title">Potential benefits</h4>
    <p class="m-0 mb-3 benefits-subtitle text-sm">Benefit results will be finalized once the application submission and review is completed.</p>

    {#if request.applications.length > 0}
      {#each request.applications as application}
        {@const appStatusTag = getApplicationStatusInfo(application.status)}
        <div class="program-status flex items-center py-2 px-4 mb-4">
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
  <div class="mt-4 grid grid-cols-3 footer-grid">
    <div class="text-center py-4 px-2 footer-section">
      <span class="block text-sm font-semibold footer-label mb-1">Request number:</span>
      <span class="block text-sm footer-value">{request.id.slice(0, 6).toUpperCase()}</span>
    </div>
    <div class="text-center py-4 px-2 footer-section">
      <span class="block text-sm font-semibold footer-label mb-1">Last updated:</span>
      <span class="block text-sm footer-value">{longNumericTime(request.updatedAt)}</span>
    </div>
    <div class="text-center py-4 px-2 footer-section">
      <span class="block text-sm font-semibold footer-label mb-1">Waiting on:</span>
      <span class="block text-sm footer-value">{statusInfo.waitingOn}</span>
    </div>
  </div>
</Card>

<style>
  /* Global styles for external component overrides */
  :global(.tagwrap .tag-set > *) {
    max-width: 100% !important;
  }

  .benefits-subtitle {
    color: var(--cds-text-02);
  }

  .program-status {
    background-color: var(--cds-ui-01);
  }

  .footer-grid {
    background-color: var(--cds-ui-01);
  }

  .footer-section {
    border-right: 1px solid var(--cds-ui-05);

  }
  .footer-section:last-child {
    border-right: none;
  }

  .footer-label {
    color: var(--cds-text-01);
  }

  .footer-value {
    color: var(--cds-text-01);
  }
</style>
