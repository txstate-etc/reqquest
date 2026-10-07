<script lang="ts">
  import { ColumnList, FieldDate, FieldMultiselect, FilterUI, Pagination, IntroPanel } from '@txstate-mws/carbon-svelte'
  import { Tile } from 'carbon-components-svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { DateTime } from 'luxon'
  import { onMount, tick } from 'svelte'
  import { toQuery } from 'txstate-utils'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { api, APPLICATION_STATUS_CONFIG, FieldNestedMultiselect, getReviewerStatusTags, ProgramStatusCell, REVIEWER_STATUS_CONFIG, type NestedMultiselectItem } from '$internal'
  import { enumApplicationRescindedStatus, enumApplicationStatus } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../local/index.js'
  import { _defaultReviewerDashboardFilters } from './+page.js'

  export let data: PageData
  $: ({ appRequests, totalItems, period, appCount, appRequestIndexes, programs } = data)
  $: periodStart = period?.openDate ? DateTime.fromISO(period.openDate) : undefined
  $: periodClose = period?.closeDate ? DateTime.fromISO(period.closeDate) : undefined
  $: periodArchive = period?.archiveDate ? DateTime.fromISO(period.archiveDate) : undefined
  let now = DateTime.now()

  const rescindableStatuses = new Set<string>([enumApplicationStatus.ELIGIBLE, enumApplicationStatus.ACCEPTED])
  const programStatusItems: NestedMultiselectItem[] = Object.entries(APPLICATION_STATUS_CONFIG)
    .filter(([status]) => status !== enumApplicationStatus.RESCINDED)
    .map(([status, config]) => ({
      value: { status },
      label: config.label,
      children: rescindableStatuses.has(status)
        ? [
            { value: { status, rescindedStatus: enumApplicationRescindedStatus.RESCINDED }, label: 'Rescinded' },
            { value: { status, rescindedStatus: enumApplicationRescindedStatus.RESTORED }, label: 'Restored' }
          ]
        : undefined
    }))

  // export only those requests selected, otherwise export whatever the current filters show.
  async function downloadCSV (ids?: string[]) {
    const ticket = await api.getDownloadTicket()
    const query = ids?.length ? '?' + toQuery({ f: { ids } }) : (location.search || ('?' + toQuery(_defaultReviewerDashboardFilters)))
    location.href = `${api.baseUrl}/csv/${ticket}/requests/reviewerdashboard${DateTime.now().toFormat('yyyyLLddHHmmss')}.csv${query}`
  }

  /** Date on one line, time beneath it. Output is our own luxon formatting, so it is safe for ColumnList's {@html} render. */
  function twoLineDate (iso: string) {
    const d = DateTime.fromISO(iso)
    return `<div>${d.toFormat('D')}</div><div>${d.toFormat('t')}</div>`
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

  <FilterUI search>
    <svelte:fragment slot="quickfilters">
      <FieldMultiselect
        path="status"
        labelText="Application status"
        label="Choose one or more"
        hideLabel={false}
        items={Object.entries(REVIEWER_STATUS_CONFIG).map(([value, config]) => ({ value, label: config.label }))}
      />
      <FieldNestedMultiselect
        path="applicationStatuses"
        labelText="Program status"
        items={programStatusItems}
      />
      <FieldMultiselect
        path="programKeys"
        labelText="Program"
        label="Choose one or more"
        hideLabel={false}
        items={programs.map(p => ({ value: p.key, label: p.title }))}
      />
    </svelte:fragment>
    <FieldDate path="submittedAfter" labelText="Submitted After" placeholder="Select a date" beginningOfDay />
    <FieldDate path="submittedBefore" labelText="Submitted Before" placeholder="Select a date" endOfDay />
  </FilterUI>

  <IntroPanel title="Review queue" subtitle="Applications awaiting or under review. Use the filters above to narrow the list." />

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
      { id: 'dateSubmitted', label: 'Date Submitted', minWidth: 120, render: r => twoLineDate(r.createdAt) },
      { id: 'program', label: 'Program', minWidth: 220, component: ProgramStatusCell },
      { id: 'status', label: 'Status', minWidth: 150, tags: r => getReviewerStatusTags(r.status, r.phase, r.closedAt) },
      { id: 'lastUpdated', label: 'Last Updated', minWidth: 120, render: r => twoLineDate(r.updatedAt) },
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
