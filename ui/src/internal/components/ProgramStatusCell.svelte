<script lang="ts">
  import { TagSet } from '@txstate-mws/carbon-svelte'
  import { Tag, Tooltip } from 'carbon-components-svelte'
  import type { ReviewerDashboardRequest } from '../api.js'
  import { getApplicationStatusTags } from '../status-utils.js'

  /** The appRequest row from the reviewer dashboard list. */
  export let row: ReviewerDashboardRequest
  /** ColumnList passes the column definition too; unused here. */
  export let col: unknown = undefined
  /**
   * When true and the request has more than `maxInline` programs, collapse to a single grey
   * "N programs" tag whose tooltip lists each program with its status labels. The expanded
   * row detail renders with rollup={false} to show the full list.
  */
  export let rollup = true
  export let maxInline = 2

  $: programs = row.applications.map(a => ({
    key: a.programKey,
    title: a.title,
    tags: getApplicationStatusTags(a.status, row.phase, row.closedAt, a.rescindedStatus)
  }))
  $: collapsed = rollup && programs.length > maxInline
  $: void col
</script>

{#if collapsed}
  <div class="program-rollup">
    <Tooltip hideIcon direction="bottom" align="start">
      <svelte:fragment slot="triggerText">
        <Tag size="sm" type="gray">{programs.length} programs</Tag>
      </svelte:fragment>
      <ul class="program-rollup-list">
        {#each programs as program (program.key)}
          <li><strong>{program.title}</strong>: {program.tags.map(t => t.label).join(', ')}</li>
        {/each}
      </ul>
    </Tooltip>
  </div>
{:else}
  <div class="program-list">
    {#each programs as program (program.key)}
      <div class="program">
        <span class="program-title">{program.title}</span>
        <TagSet small tags={program.tags} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .program-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .program {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem 0.5rem;
  }
  .program-rollup {
    position: relative;
  }
  .program-rollup :global(.bx--tooltip__label) {
    display: inline-block;
  }
  /* carbon caps tooltips at 18rem; program titles plus their status labels need more room */
  .program-rollup :global(.bx--tooltip) {
    max-width: 28rem;
  }
  .program-rollup-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>
