<script lang="ts">
  import { ColumnList, FieldDate, FilterUI, Pagination } from '@txstate-mws/carbon-svelte'
  import { Tile } from 'carbon-components-svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { DateTime } from 'luxon'
  import { onMount } from 'svelte'
  import { resolve } from '$app/paths'
  import { api, REVIEWER_STATUS_CONFIG } from '$internal'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../local/index.js'
  import { _dashboardStatuses } from './+page.js'

  export let data: PageData
  $: ({ appRequests, totalItems, period, filters, appCount, appRequestIndexes } = data)
  $: periodStart = period?.openDate ? DateTime.fromISO(period.openDate) : undefined
  $: periodClose = period?.closeDate ? DateTime.fromISO(period.closeDate) : undefined
  $: periodArchive = period?.archiveDate ? DateTime.fromISO(period.archiveDate) : undefined
  let now = DateTime.now()

  async function downloadCSV () {
    const ticket = await api.getDownloadTicket()
    location.href = `${api.baseUrl}/csv/${ticket}/requests/reviewerdashboard${DateTime.now().toFormat('yyyyLLddHHmmss')}.csv${location.search}`
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
      <span>Applications to review</span>
    </Tile>
  </div>

  <FilterUI tabs={[
    { label: 'Awaiting Review', value: { reviewStarted: false, complete: false, status: _dashboardStatuses } },
    { label: 'Review in Progress', value: { reviewStarted: true, complete: false, status: _dashboardStatuses } },
    { label: 'Completed Review', value: { complete: true } }
  ]}>
  </FilterUI>

  <div class="flow [ p-4 bg-gray-100 ]">
    <h2 class="[ text-lg ]">{filters.reviewStarted ? 'Review in progress' : filters.complete ? 'Completed review' : 'Review not started'}</h2>
    <p class="[ text-gray-600 ]">{filters.reviewStarted ? 'These are applications that are in progress, if you are looking for reviews you have participated in, filter by your name.' : filters.complete ? 'These applications have been completely reviewed.' : 'These are applications waiting to be reviewed.'}</p>
  </div>

  <ColumnList
    searchable
    filterTitle='Request Filters'
    listActions={[
      { label: 'Download', icon: DocExport, onClick: downloadCSV }
    ]}
    columns={[
      { id: 'request', label: 'Request #', tags: row => [{ label: String(row.id) }] },
      { id: 'period', label: 'Period', render: r => r.period.name },
      { id: 'login', label: uiRegistry.getWord('login'), tags: r => [{ label: r.applicant.login, type: 'green' }] },
      { id: 'name', label: 'Name', get: 'applicant.fullname' },
      { id: 'dateSubmitted', label: 'Date Submitted', render: r => DateTime.fromISO(r.createdAt).toFormat('f') },
      { id: 'status', label: 'Status', tags: r => [{ label: REVIEWER_STATUS_CONFIG[r.status].label, type: REVIEWER_STATUS_CONFIG[r.status].color }] },
      { id: 'lastUpdated', label: 'Last Updated', render: r => DateTime.fromISO(r.updatedAt).toFormat('f') },
      ...appRequestIndexes.map(index => ({
        id: 'cat_' + index.category,
        label: index.categoryLabel,
        render: r => {
          const matchingIndex = r.indexes.find(i => i.category === index.category)
          return (matchingIndex?.values.map(v => ({ label: v.label })) ?? []).join(', ')
        }
      }))
    ]}
    rows={appRequests}
    title="App Requests"
    actions={r => [
      {
        label: 'View',
        icon: View,
        href: resolve(`/requests/${r.id}/approve`)
      }
    ]}
  >
    <svelte:fragment slot="filters">
      <FieldDate path='submittedAfter' label='Submitted After' />
      <FieldDate path='submittedBefore' label='Submitted Before' />
    </svelte:fragment>
  </ColumnList>

  <Pagination
    {totalItems}
    pageSize={25}
    chooseSize
  />
</div>
