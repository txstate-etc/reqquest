<script lang="ts">
  import { ApplicationDetailsView } from '$internal'
  import { uiRegistry } from '../../../../../local'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ appRequest, appData, prequalPrompts, postqualPrompts, applicationsReview, basicRequestData } = data)
</script>

{#if appRequest}

  <div class="export-content max-w-4xl">
    <ApplicationDetailsView
      {appRequest}
      applications={applicationsReview}
      {appData}
      {prequalPrompts}
      {postqualPrompts}
      loading={false}
      {uiRegistry}
      expandable={false}
      printMode
      showWarningsInline={true}
      title={`View ${basicRequestData.applicant.fullname} ${uiRegistry.getWord('appRequest').toLowerCase()}`}
      subtitle={`Complete ${uiRegistry.getWord('appRequest').toLowerCase()} details for review.`}
    />
  </div>

{:else}
  <div class="error">
    <h1>{uiRegistry.getWord('appRequest')} Not Found</h1>
    <p>The requested {uiRegistry.getWord('appRequest').toLowerCase()} could not be loaded.</p>
  </div>
{/if}

<style>
  /* Reviewer standard: prompt/requirement column 40%, answer column 60%. */
  .export-content {
    --prompt-list-columns: minmax(0, 2fr) minmax(0, 3fr);
  }
</style>
