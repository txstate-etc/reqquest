<script lang="ts">
  import { ColumnList, FieldDate, FilterUI, Pagination, IntroPanel } from '@txstate-mws/carbon-svelte'
  import { Tile } from 'carbon-components-svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { DateTime } from 'luxon'
  import { onMount, tick } from 'svelte'
  import { toQuery } from 'txstate-utils'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { api, getReviewerStatusTags, ProgramStatusCell, twoLineDateHtml } from '$internal'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../local/index.js'
  import { _inReviewStatuses, _reviewCompleteStatuses, _reviewPendingStatuses } from './+page.js'

  export let data: PageData
  $: ({ appRequests, totalItems, period, appCount, appRequestIndexes, filters } = data)
  $: periodStart = period?.openDate ? DateTime.fromISO(period.openDate) : undefined
  $: periodClose = period?.closeDate ? DateTime.fromISO(period.closeDate) : undefined
  $: periodArchive = period?.archiveDate ? DateTime.fromISO(period.archiveDate) : undefined
  let now = DateTime.now()

  const tabs = [
    { label: 'Review Pending', value: { status: _reviewPendingStatuses }, title: 'Review pending', subtitle: 'Submitted applications that no reviewer has started on yet.' },
    { label: 'In Review', value: { status: _inReviewStatuses }, title: 'In review', subtitle: 'Applications a reviewer is actively working on.' },
    { label: 'Review Complete', value: { status: _reviewCompleteStatuses }, title: 'Review complete', subtitle: 'Applications whose review is finished, including results already released to the applicant.' }
  ]
  // the active tab is whichever one's statuses the current filter carries; default to the first
  $: activeTab = tabs.find(t => t.value.status.some(s => filters.status?.includes(s))) ?? tabs[0]

  // export only those requests selected, otherwise export whatever the current filters show.
  async function downloadCSV (ids?: string[]) {
    const ticket = await api.getDownloadTicket()
    const query = '?' + toQuery({ f: ids?.length ? { ids } : filters } as unknown as Parameters<typeof toQuery>[0])
    location.href = `${api.baseUrl}/csv/${ticket}/requests/reviewerdashboard${DateTime.now().toFormat('yyyyLLddHHmmss')}.csv${query}`
  }

  onMount(() => {
    const interval = setInterval(() => {
      now = DateTime.now()
    }, 60000)
    return () => clearInterval(interval)
  })
</script>

<div class='[ px-8 ]'>
  <div class="[ flex justify-between flex-wrap mb-4 ]">
    <div class="[ flex gap-2 flex-wrap ]">
      {#if periodStart != null}
        <Tile class='[ flex flex-col gap-4 ]'>
          <span class='[ text-lg ]'>
            {uiRegistry.getWord('period')} Open{#if periodStart > now}s{:else}ed{/if}
          </span>
          <span>{periodStart.toFormat('f')}</span>
        </Tile>
      {/if}
      {#if periodClose != null}
        <Tile class='[ flex flex-col gap-4 ]'>
          <span class='[ text-lg ]'>
            {uiRegistry.getWord('period')} Close{#if periodClose < now}d{:else}s{/if}
          </span>
          <span>{periodClose.toFormat('f')}</span>
        </Tile>
      {/if}
      {#if periodArchive != null}
        <Tile class='[ flex flex-col gap-4 ]'>
          <span class='[ text-lg ]'>
            {uiRegistry.getWord('period')} Archive{#if periodArchive < now}d{:else}s{/if}
          </span>
          <span>{periodArchive.toFormat('f')}</span>
        </Tile>
      {/if}
    </div>
    <Tile class='[ flex flex-col gap-4 ]'>
      <span class='[ text-lg ]'>
        {appCount}
      </span>
      <span>{appCount > 1 ? uiRegistry.getPlural('appRequest') : uiRegistry.getWord('appRequest')} to review</span>
    </Tile>
  </div>

  <FilterUI tabs={tabs.map(t => ({ label: t.label, value: t.value }))} tabsAriaLabel="Review stage">
    <FieldDate path="submittedAfter" labelText="Submitted After" placeholder="Select a date" beginningOfDay />
    <FieldDate path="submittedBefore" labelText="Submitted Before" placeholder="Select a date" endOfDay />
  </FilterUI>

  <IntroPanel title={activeTab.title} subtitle={activeTab.subtitle} />

  <ColumnList
    autoHideColumns
    searchable
    listActions={[
      { label: 'Download', icon: DocExport, onClick: () => downloadCSV() }
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
