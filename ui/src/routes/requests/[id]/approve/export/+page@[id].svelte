<script lang="ts">
  import { ApplicationDetailsView } from '$lib/components'
  import { uiRegistry } from '../../../../../local'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ appRequest, appData, prequalPrompts, postqualPrompts, applicationsReview } = data)
</script>

{#if appRequest}

  <div class="export-content max-w-4xl ">
    <ApplicationDetailsView
      {appRequest}
      applications={applicationsReview}
      {appData}
      {prequalPrompts}
      {postqualPrompts}
      loading={false}
      {uiRegistry}
      expandable={false}
      showWarningsInline={true}
      title="Review Application"
      subtitle="Complete application details for review."
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

    .export-content {
      break-inside: avoid;
    }

    .export-content :global(.panel) {
      break-inside: avoid;
      margin-bottom: 1rem !important;
    }
  }
</style>
