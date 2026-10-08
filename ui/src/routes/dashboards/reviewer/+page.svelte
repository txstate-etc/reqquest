<script lang="ts">
  import { ColumnList, FieldDate, FilterUI, Pagination, IntroPanel } from '@txstate-mws/carbon-svelte'
  import { Tile } from 'carbon-components-svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { DateTime, Duration } from 'luxon'
  import { tick } from 'svelte'
  import { pluralize, toQuery } from 'txstate-utils'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { api, getReviewerStatusTags, ProgramStatusCell, twoLineDateHtml } from '$internal'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../local/index.js'
  import { _inReviewStatuses, _reviewCompleteStatuses, _reviewPendingStatuses } from './+page.js'

  export let data: PageData
  $: ({ appRequests, totalItems, appRequestIndexes, filters, tabCounts, applicantCounts, avgDecisionSeconds } = data)

  // tab labels carry the count of open requests in that stage
  $: tabs = [
    { label: `Review Pending (${tabCounts.pending})`, value: { status: _reviewPendingStatuses }, title: 'Review not started', subtitle: 'These are applications waiting to be started by the review team.' },
    { label: `In Review (${tabCounts.inReview})`, value: { status: _inReviewStatuses }, title: 'Review in progress', subtitle: 'These are applications currently being reviewed.' },
    { label: `Review Complete (${tabCounts.complete})`, value: { status: _reviewCompleteStatuses }, title: 'Review complete', subtitle: 'These applications have finished review, including results already released to the applicant.' }
  ]
  // the active tab is whichever one's statuses the current filter carries; default to the first
  $: activeTab = tabs.find(t => t.value.status.some(s => filters.status?.includes(s))) ?? tabs[0]

  function formatDuration (seconds: number) {
    const d = Duration.fromObject({ seconds: Math.round(seconds) }).shiftTo('days', 'hours', 'minutes').toObject()
    const parts = (['days', 'hours', 'minutes'] as const).filter(unit => (d[unit] ?? 0) >= 1).map(unit => pluralize(unit.slice(0, -1), Math.floor(d[unit]!), true))
    return parts.length ? parts.join(', ') : 'under a minute'
  }

  // export only those requests selected, otherwise export whatever the current filters show.
  async function downloadCSV (ids?: string[]) {
    const ticket = await api.getDownloadTicket()
    const query = '?' + toQuery({ f: ids?.length ? { ids } : filters } as unknown as Parameters<typeof toQuery>[0])
    location.href = `${api.baseUrl}/csv/${ticket}/requests/reviewerdashboard${DateTime.now().toFormat('yyyyLLddHHmmss')}.csv${query}`
  }

</script>

<div class='intro-wide [ px-8 ]'>
  <div class="review-header [ flex justify-between items-end flex-wrap gap-4 mb-4 ]">
    <div class="review-tabs">
      <FilterUI tabs={tabs.map(t => ({ label: t.label, value: t.value }))} tabsAriaLabel="Review stage" />
    </div>
    <div class="[ flex gap-2 flex-wrap ]">
      <Tile class="stat-tile [ flex flex-col gap-4 ]">
        <span class='[ text-lg ]'>First time application</span>
        <span>{pluralize('application', applicantCounts.firstTime, true)}</span>
      </Tile>
      <Tile class="stat-tile [ flex flex-col gap-4 ]">
        <span class='[ text-lg ]'>Returning application</span>
        <span>{pluralize('application', applicantCounts.returning, true)}</span>
      </Tile>
      {#if avgDecisionSeconds != null}
        <Tile class="stat-tile [ flex flex-col gap-4 ]">
          <span class='[ text-lg ]'>Avg. time to finish review</span>
          <span>{formatDuration(avgDecisionSeconds)}</span>
        </Tile>
      {/if}
    </div>
  </div>

  <IntroPanel title={activeTab.title} subtitle={activeTab.subtitle} />

  <ColumnList
    autoHideColumns
    searchable
    showExpandAll
    filterTitle="Request Filters"
    listActions={[
      { label: 'Export', icon: DocExport, onClick: () => downloadCSV() }
    ]}
    selectedActions={rows => [
      { label: 'Download selected', icon: DocExport, onClick: () => downloadCSV(rows.map(r => r.id)) }
    ]}
    columns={[
      { id: 'request', label: 'Request #', fixed: '90px', minWidth: 90, tags: row => [{ label: String(row.id) }] },
      { id: 'period', label: uiRegistry.getWord('period'), render: r => r.period.name },
      { id: 'login', label: uiRegistry.getWord('login'), minWidth: 100, tags: r => [{ label: r.applicant.login, type: 'green' }] },
      { id: 'name', label: 'Name', get: 'applicant.fullname' },
      { id: 'dateSubmitted', label: 'Date Submitted', minWidth: 120, render: r => twoLineDateHtml(r.createdAt) },
      { id: 'program', label: 'Program', minWidth: 220, component: ProgramStatusCell },
      { id: 'status', label: 'Application status', minWidth: 150, tags: r => getReviewerStatusTags(r.status, r.phase, r.closedAt) },
      { id: 'lastUpdated', label: 'Last Updated', minWidth: 120, render: r => twoLineDateHtml(r.updatedAt) },
      ...appRequestIndexes.map(index => ({
        id: 'cat_' + index.category,
        label: index.categoryLabel,
        render: r => {
          const matchingIndex = r.indexes?.find(i => i.category === index.category)
          return (matchingIndex?.values.map(v => ({ label: v.label })) ?? []).join(', ')
        }
      }))
    ]}
    rows={appRequests}
    title={uiRegistry.getPlural('appRequest')}
    actions={r => [
      {
        label: 'View',
        icon: View,
        // Heisenbug :) Resolved after console dumps slowed it down and worked.
        // defer navigation one tick past the click's synchronous handling. goto() inside the handler
        // raced with the action button's click and got dropped on the first uncached click after a fresh page load, required second click to navigate.
        onClick: async () => {
          await tick()
          await goto(resolve(`/requests/${r.id}/approve`))
        }
      }
    ]}
  >
    <svelte:fragment slot="filters">
      <FieldDate path="submittedAfter" labelText="Submitted After" placeholder="Select a date" beginningOfDay />
      <FieldDate path="submittedBefore" labelText="Submitted Before" placeholder="Select a date" endOfDay />
    </svelte:fragment>
    <svelte:fragment let:row>
      <div class="[ mb-2 ]"><strong>Programs</strong></div>
      <ProgramStatusCell {row} rollup={false} />
    </svelte:fragment>
  </ColumnList>

  <Pagination
    {totalItems}
    pageSize={25}
    chooseSize
  />
</div>

<style>
  .intro-wide :global(.intro-panel .content-start) {
    max-width: none;
  }
  /* the header row owns the spacing below the tabs; FilterUI's own bottom margin would double it */
  .review-tabs :global(.filter-ui-container) {
    margin-bottom: 0;
  }
</style>
