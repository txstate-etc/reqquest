<script lang="ts">
  import { Card } from '@txstate-mws/carbon-svelte'
  import type { LayoutData } from './$types.js'
  import { uiRegistry } from '../../../../local/index.js'

  export let data: LayoutData
  $: ({ basicRequestData } = data)
</script>

<div class="review-container">
  <div class="review-sidebar">
    <Card
      title="{basicRequestData.applicant.fullname} ({basicRequestData.period.name})"
    >
      <dl class="identifier">
        <dt>{uiRegistry.getWord('login')}</dt>
        <dd>{basicRequestData.applicant.login}</dd>
        {#each basicRequestData.applicant.otherIdentifiers as identifier}
          <dt>{identifier.label}:</dt>
          <dd>{identifier.id}</dd>
        {/each}
      </dl>
      {#if uiRegistry.config.slots?.reviewerSidebarCard}
        <svelte:component this={uiRegistry.config.slots.reviewerSidebarCard} {basicRequestData} />
      {/if}
    </Card>
    <slot name="sidebar" />
    {#if uiRegistry.config.slots?.reviewerSidebar}
      <svelte:component this={uiRegistry.config.slots.reviewerSidebar} {basicRequestData} />
    {/if}
  </div>
  <div class="review-content">
    <slot />
  </div>
</div>

<style>
  .review-container {
    display: flex;
    gap: 15px;
    padding: 15px;
  }

  .review-sidebar {
    container-type: inline-size;
    width: min(20rem, 33%);
  }

  .review-content {
    flex-grow: 1;
  }

  @media (max-width: 800px) {
    .review-container {
      flex-direction: column-reverse;
    }

    .review-sidebar {
      width: 100%;
    }
  }

  .identifier {
    width: 100%;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 8px;
    container-type: inline-size;
  }
  .identifier dt {
    font-weight: bold;
  }
  .identifier dd, .identifier dt {
    margin: 0;
    padding: 0;
  }
  @container (width < 18rem) {
    .identifier {
      grid-template-columns: 1fr;
    }
  }
</style>
