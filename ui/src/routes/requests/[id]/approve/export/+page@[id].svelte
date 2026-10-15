<script lang="ts">
  import { ApplicationDetailsView } from '$internal'
  import { uiRegistry } from '../../../../../local'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ appRequest, appData, prequalPrompts, postqualPrompts, applicationsReview } = data)
</script>

{#if appRequest}

  <div class="max-w-4xl">
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
      title={`Review ${uiRegistry.getWord('appRequest')}`}
      subtitle={`Complete ${uiRegistry.getWord('appRequest').toLowerCase()} details for review.`}
    />
  </div>

{:else}
  <div class="error">
    <h1>{uiRegistry.getWord('appRequest')} Not Found</h1>
    <p>The requested {uiRegistry.getWord('appRequest').toLowerCase()} could not be loaded.</p>
  </div>
{/if}
