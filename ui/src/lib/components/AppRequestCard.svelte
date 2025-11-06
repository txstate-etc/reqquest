<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { getApplicationStatusInfo, getAppRequestStatusInfo, getNavigationButton } from '$lib/status-utils.js'
  import { longNumericTime } from '$lib/util.js'
  import type { ActionItem } from '@txstate-mws/carbon-svelte'
  import { BadgeNumber, Card, TagSet } from '@txstate-mws/carbon-svelte'
  import { Accordion, AccordionItem, Button } from 'carbon-components-svelte'
  import type { PageData } from '../../routes/dashboards/applicant/$types'

  // Type for the partial AppRequest data passed from dashboard
  type DashboardAppRequest = PageData['appRequests'][number]

  export let request: DashboardAppRequest
  export let actions: ActionItem[] = []
  export let showAcceptanceButtons = true
  export let onAcceptanceNavigate: ((requestId: string) => void) | undefined = undefined

  $: statusInfo = getAppRequestStatusInfo(request.status)
  $: navButton = getNavigationButton(request.status, request.id)

  async function handleAcceptanceClick () {
    if (onAcceptanceNavigate) {
      onAcceptanceNavigate(request.id)
    } else {
      await goto(resolve(`/requests/${request.id}/apply`))
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
      {#each request.applications as application (application.id)}
        {@const appStatusTag = getApplicationStatusInfo(application.status)}
        <div class="program-status py-2 px-4 mb-4">
          <div class="flex items-center">
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

          <!-- Status reason -->
          {#if application.statusReason && application.status !== 'INELIGIBLE'}
            <p class="status-reason mt-2 mb-0 text-sm">{application.statusReason}</p>
          {/if}

          <!-- Failed requirements for INELIGIBLE applications -->
          {#if application.status === 'INELIGIBLE' && application.requirements}
            {@const failedRequirements = application.requirements.filter(req => req.status === 'DISQUALIFYING' && req.statusReason)}
            {#if failedRequirements.length === 1}
              <p class="status-reason mt-2 mb-0 text-sm">{failedRequirements[0].statusReason}</p>
            {/if}
            {#if failedRequirements.length > 1}
            <div class="flex">
              <BadgeNumber value={failedRequirements.length} class="mt-5 mr-2" style="--badge-bg: #FBE9EA; --badge-text:#a11c25" />
              <div class="failed-requirements mt-2 w-full">
                <Accordion align="start">
                  <AccordionItem title="Multiple eligibility issues">
                    <ol class="list-decimal">
                      {#each failedRequirements as requirement (requirement.id)}
                        <li class="failed-requirement">{requirement.statusReason}</li>
                      {/each}
                    </ol>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            {/if}
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
