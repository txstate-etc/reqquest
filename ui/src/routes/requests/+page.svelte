<script lang="ts">
  import { ColumnList, FieldDate, FieldMultiselect, FieldSelect, FieldTextInput, FilterUI, Pagination, Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import { DateTime } from 'luxon'
  import { htmlEncode, isBlank, isNotBlank, keyby, sortby, toQuery } from 'txstate-utils'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { api, REVIEWER_STATUS_CONFIG } from '$internal'
  import { uiRegistry } from '../../local/index.js'
  import type { PageData } from './$types.js'
  import { _defaultRequestListFilters } from './+page.js'

  export let data: PageData

  $: ({ appRequests, appRequestIndexes: indexes, allPeriods, openPeriods, access, filters } = data)
  $: requests = appRequests.map(r => ({ ...r, indexByCat: keyby(r.indexCategories, 'category') }))
  $: indexColumns = sortby(indexes.filter(idx => idx.appRequestListPriority), 'appRequestListPriority').map(idx => ({
    id: idx.category,
    label: idx.categoryLabel,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- r.indexByCat[idx.category] may be undefined if no values are present
    render: (r: typeof requests[number]) => htmlEncode(r.indexByCat[idx.category]?.values.map(v => v.label).join(', '))
  }))
  $: filterIndexes = sortby(indexes.filter(idx => idx.listFiltersPriority && (idx.values.length || !idx.listable)), 'listFiltersPriority')

  let unlistableIndexItems: Record<string, { value: string, label: string }[] | undefined> = {}
  function searchIndexItems (category: string) {
    return (e: Event) => {
      (async () => {
        const search = (e.target as HTMLInputElement).value
        if (isBlank(search)) {
          unlistableIndexItems[category] = undefined
        } else {
          unlistableIndexItems[category] = await api.searchIndexItems(category, search)
        }
        unlistableIndexItems = unlistableIndexItems // trigger reactivity
      })().catch(console.error)
    }
  }

  let createDialog = false
  let lastInsertedId: string | undefined
  async function openCreateDialog () {
    createDialog = true
  }

  function closeCreateDialog () {
    createDialog = false
  }

  async function onCreateSaved () {
    closeCreateDialog()
    await goto(resolve(`/requests/${lastInsertedId}/approve`))
  }

  async function validateAppRequest (data: { periodId: string, login: string }) {
    const response = await api.createAppRequest(data.periodId, data.login, true)
    return response.messages
  }

  async function submitAppRequest (data: { periodId: string, login: string }) {
    const response = await api.createAppRequest(data.periodId, data.login)
    if (response.success) lastInsertedId = response.id
    return {
      ...response,
      data
    }
  }
  let showDateFilters = isNotBlank(filters?.closedAfter) || isNotBlank(filters?.closedBefore) || isNotBlank(filters?.updatedAfter) || isNotBlank(filters?.updatedBefore) || isNotBlank(filters?.submittedAfter) || isNotBlank(filters?.submittedBefore)

  async function downloadCSV () {
    const ticket = await api.getDownloadTicket()
    location.href = `${api.baseUrl}/csv/${ticket}/requests/requests${DateTime.now().toFormat('yyyyLLddHHmmss')}.csv${location.search || ('?' + toQuery({ ..._defaultRequestListFilters }))}`
  }
</script>
<div class='[ px-[20px] ]'>
  <FilterUI search>
    <svelte:fragment slot="quickfilters">
      <FieldMultiselect
        path="status"
        label="Status"
        placeholder="Status"
        items={Object.entries(REVIEWER_STATUS_CONFIG).map(([value, config]) => ({ value, label: config.label }))}
      />
      {#each filterIndexes as filterIdx, i (filterIdx.category)}
        {#if i < 2}
          <FieldMultiselect path="indexes.{filterIdx.category}"
            label={filterIdx.categoryLabel}
            placeholder={filterIdx.categoryLabel}
            items={filterIdx.listable ? filterIdx.values : unlistableIndexItems[filterIdx.category] ?? []}
            filterable={!filterIdx.listable}
            on:input={!filterIdx.listable ? searchIndexItems(filterIdx.category) : () => {}}
          />
        {/if}
      {/each}
    </svelte:fragment>
    <FieldDate
      path="createdAfter"
      labelText="Created After"
      placeholder="Select a date"
      filterable
    />
    <FieldDate
      path="createdBefore"
      labelText="Created Before"
      placeholder="Select a date"
      filterable
    />
    <Panel bind:expanded={showDateFilters} expandable title="Additional Date Filters">
      <FieldDate
        path="submittedAfter"
        labelText="Submitted After"
        placeholder="Select a date"
        filterable
      />
      <FieldDate
        path="submittedBefore"
        labelText="Submitted Before"
        placeholder="Select a date"
        filterable
      />
      <FieldDate
        path="closedAfter"
        labelText="Closed After"
        placeholder="Select a date"
        filterable
      />
      <FieldDate
        path="closedBefore"
        labelText="Closed Before"
        placeholder="Select a date"
        filterable
      />
      <FieldDate
        path="updatedAfter"
        labelText="Updated After"
        placeholder="Select a date"
        filterable
      />
      <FieldDate
        path="updatedBefore"
        labelText="Updated Before"
        placeholder="Select a date"
        filterable
      />
    </Panel>
    <FieldMultiselect
      path="periodIds"
      label="Periods"
      placeholder="Select Periods"
      items={allPeriods.map(p => ({ value: p.id, label: p.name }))}
      filterable
    />
    {#each filterIndexes as filterIdx, i (filterIdx.category)}
      {#if i >= 2}
        <FieldMultiselect path="indexes.{filterIdx.category}"
          label={filterIdx.categoryLabel}
          placeholder={filterIdx.categoryLabel}
          items={filterIdx.listable ? filterIdx.values : unlistableIndexItems[filterIdx.category] ?? []}
          filterable={!filterIdx.listable}
          on:input={!filterIdx.listable ? searchIndexItems(filterIdx.category) : () => {}}
        />
      {/if}
    {/each}
  </FilterUI>
  <div class="app-requests-intro [ flow py-4 px-[16px] ]">
    <h2 class="[ text-lg ]">All Applications</h2>
    <p class="[ text-gray-600 ]">This is where you can see all applications submitted to the business app. Browse them all or use the filters above to narrow down applications.</p>
  </div>
  <ColumnList
    autoHideColumns
    title={uiRegistry.getPlural('appRequest')}
    columns={[
      { id: 'id', label: 'Request #', fixed: '90px', minWidth: 90, tags: r => [{ label: r.id }] },
      { id: 'login', label: uiRegistry.getWord('login'), minWidth: 100, tags: r => [{ label: r.applicant.login, type: 'green' }] },
      { id: 'period', label: uiRegistry.getWord('period'), minWidth: 150, render: r => htmlEncode(r.period.name) },
      { id: 'name', label: 'Name', render: r => r.applicant.fullname, grow: 2 },
      { id: 'dateSubmitted', label: 'Submitted', minWidth: 150, render: r => DateTime.fromISO(r.createdAt).toFormat('f') },
      { id: 'status', label: 'Status', minWidth: 150, tags: r => [{ label: REVIEWER_STATUS_CONFIG[r.status].label, type: REVIEWER_STATUS_CONFIG[r.status].color }] },
      ...indexColumns,
      { id: 'lastUpdated', label: 'Last Updated', minWidth: 150, render: r => DateTime.fromISO(r.updatedAt).toFormat('f') }
    ]}
    listActions={[
      ...(access.createAppRequestOther
        ? [
          { label: 'Create App Request', onClick: openCreateDialog }
        ]
        : []
      ),
      { label: 'Download', icon: DocExport, onClick: async () => { await downloadCSV() } }
    ]}
    actions={row => [
      { icon: View, label: 'View', href: `/requests/${row.id}/approve` }
    ]}
    rows={requests}
  />
  <Pagination
    totalItems={data.pageInfo.appRequests?.totalItems}
    page={data.pageInfo.appRequests?.currentPage}
    pageSize={25}
    chooseSize
  />
</div>

<PanelFormDialog open={createDialog} title="Create App Request" validate={validateAppRequest} submit={submitAppRequest} on:cancel={closeCreateDialog} on:saved={onCreateSaved}>
  <FieldSelect
    labelText="Period"
    path="periodId"
    items={openPeriods.map(p => ({ value: p.id, label: p.name }))}
    required
    helperText="Select the period in which you want to create an app request."
  />
  <FieldTextInput
    path="login"
    labelText="Applicant Login"
    required
    notNull
    helperText="Enter the login of the applicant for this request."
  />
</PanelFormDialog>

<style>
  .app-requests-intro {
    background-color: var(--cds-layer);
  }
</style>
