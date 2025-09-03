<script lang="ts">
  import type { PageData } from './$types'
  import { getAppRequestStatusInfo } from '$lib/status-utils.js'
  import { ApplicationDetailsView } from '$lib/components'
  import { uiRegistry } from '../../../../local'

  export let data: PageData
  $: ({ selectedApplication, applicationDetails } = data)
</script>

{#if selectedApplication}
  <div class="application-header flow ">
    <div class="application-title text-xl font-bold ">Application Export</div>
    <div class="application-period font-bold">{selectedApplication.period.name}</div>
    <div class="application-status">
      Status: <strong>{getAppRequestStatusInfo(selectedApplication.status).label}</strong>
    </div>
  </div>

  <div class="export-content max-w-4xl ">
    <ApplicationDetailsView
      {selectedApplication}
      {applicationDetails}
      loading={false}
      {uiRegistry}
    />
  </div>

{:else}
  <div class="error">
    <h1>Application Not Found</h1>
    <p>The requested application could not be loaded.</p>
  </div>
{/if}

<style>

  @media print {
    :global(.bx--header) {
      display: none !important;
    }

    :global(.breadcrumbs) {
      display: none !important;
    }

    .application-header {
      break-inside: avoid;
    }

    .export-content {
      break-inside: avoid;
    }

    .export-content :global(.panel) {
      break-inside: avoid;
      margin-bottom: 1rem !important;
    }
  }
</style>
