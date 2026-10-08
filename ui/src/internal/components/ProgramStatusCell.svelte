<script lang="ts" context="module">
  export interface ProgramStatusRow {
    phase: string
    closedAt?: string | null
    applications: { programKey: string, title: string, status: string, rescindedStatus?: string | null }[]
  }
</script>

<script lang="ts">
  import { TagSet } from '@txstate-mws/carbon-svelte'
  import { FloatingPortal, Tag } from 'carbon-components-svelte'
  import { onDestroy } from 'svelte'
  import { randomid } from 'txstate-utils'
  import { getApplicationStatusTags } from '../status-utils.js'

  export let row: ProgramStatusRow
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

  const tooltipId = randomid()
  let triggerRef: HTMLElement | null = null
  let tooltipOpen = false
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  function show () {
    clearTimeout(closeTimer)
    tooltipOpen = true
  }
  function hideSoon () {
    clearTimeout(closeTimer)
    closeTimer = setTimeout(() => { tooltipOpen = false }, 150)
  }
  function hideNow () {
    clearTimeout(closeTimer)
    tooltipOpen = false
  }
  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Escape' && tooltipOpen) { e.stopPropagation(); hideNow() }
  }
  onDestroy(() => clearTimeout(closeTimer))
</script>

{#if collapsed}
  <!-- focusable so keyboard users can reveal the tooltip; a <button> can't hold carbon's Tag (it renders a div) -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex a11y-no-static-element-interactions -->
  <span bind:this={triggerRef} class="program-rollup__trigger" tabindex="0" aria-describedby={tooltipOpen ? tooltipId : undefined}
    on:mouseenter={show} on:mouseleave={hideSoon} on:focus={show} on:blur={hideNow} on:keydown={onKeydown}>
    <Tag size="sm" type="gray">{programs.length} programs</Tag>
  </span>
  <FloatingPortal anchor={triggerRef} open={tooltipOpen} direction="bottom" intrinsicWidth intrinsicAlign="start" gapBottom={4}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div id={tooltipId} role="tooltip" class="program-rollup__tooltip" on:mouseenter={show} on:mouseleave={hideSoon}>
      <ul class="program-rollup-list">
        {#each programs as program (program.key)}
          <li><strong>{program.title}</strong>: {program.tags.map(t => t.label).join(', ')}</li>
        {/each}
      </ul>
    </div>
  </FloatingPortal>
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
  .program-rollup__trigger {
    display: inline-block;
    cursor: default;
  }
  .program-rollup__trigger:focus-visible {
    outline: 2px solid var(--cds-focus, #0f62fe);
    outline-offset: 1px;
  }
  .program-rollup__tooltip {
    background: var(--cds-inverse-02, #393939);
    color: var(--cds-inverse-01, #ffffff);
    padding: 1rem;
    border-radius: 2px;
    box-shadow: 0 2px 6px var(--cds-shadow, rgba(0, 0, 0, 0.3));
    font-size: 0.875rem;
    line-height: 1.25rem;
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
