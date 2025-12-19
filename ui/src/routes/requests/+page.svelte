<script lang="ts">
  import { ColumnList, FieldDate, FieldMultiselect, FieldSelect, FieldTextInput, FilterUI, Pagination, PanelFormDialog, type ActionItem } from '@txstate-mws/carbon-svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import { htmlEncode, isBlank, isNotBlank, keyby, pluralize, sortby } from 'txstate-utils'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { api, type AppRequest } from '$lib'
  import { uiRegistry } from '../../local/index.js'
  import type { PageData } from './$types.js'
    import { DateTime } from 'luxon'
    import { downloadCsv } from '$lib/csv.js'

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

  function formatCSVData (d: typeof requests) {
    return d.map(d => ({
      Id: d.id,
      Period: d.period.name,
      'TXST ID': d.applicant.login,
      Name: d.applicant.fullname,
      'Date Submitted': DateTime.fromISO(d.createdAt).toFormat('f').replace(',', ''),
      Benefit: `"${d.applications.map(a => a.title).join(', ')}"`,
      Status: d.status,
      'Last Submitted': DateTime.fromISO(d.updatedAt).toFormat('f').replace(',', '')
    }))
  }

  const selectedActions = (rows: any): ActionItem[] => [
    {
      label: `Download ${rows.length} ${pluralize('applications', rows.length)}`,
      // icon: TrashCan,
      onClick: () => { downloadCsv(formatCSVData(requests)) }
    }
  ]

</script>
<FilterUI search>
  <svelte:fragment slot="quickfilters">
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
  <button type="button" on:click={() => { showDateFilters = !showDateFilters }} class="btn btn-ghost">
    {showDateFilters ? 'Hide Date Filters' : 'Show Date Filters'}
  </button>
  {#if showDateFilters}
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
  {/if}
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
<div class="app-requests-intro [ flow p-4 ]">
  <h2 class="[ text-lg ]">All Applications</h2>
  <p class="[ text-gray-600 ]">This is where you can see all applications submitted to the business app. Browse them all or use the filters above to narrow down applications.</p>
</div>
<ColumnList
  title={uiRegistry.getPlural('appRequest')}
  {selectedActions}
  columns={[
    { id: 'id', label: 'Id', tags: r => [{ label: r.id } ] },
    { id: 'period', label: uiRegistry.getWord('period'), render: r => htmlEncode(r.period.name) },
    { id: 'txstID', label: 'TXST ID', tags: r => [{ label: r.applicant.login, type: 'green' } ] },
    { id: 'name', label: 'Name', render: r => r.applicant.fullname },
    { id: 'dateSubmitted', label: 'Date Submitted', render: r => DateTime.fromISO(r.createdAt).toFormat('f') },
    { id: 'benefit', label: 'Benefit', render: r => r.applications.map(a => a.title).join(', ') },
    { id: 'status', label: 'Status', render: r => r.status },
    { id: 'lastUpdated', label: 'Last Updated', render: r => DateTime.fromISO(r.updatedAt).toFormat('f') },
    ...indexColumns
  ]}
  listActions={[
    ...(access.createAppRequestOther
      ? [
        { label: 'Create App Request', onClick: openCreateDialog },
        { label: 'Download', icon: DocExport, onClick: () => { downloadCsv(formatCSVData(requests)) } }
      ]
      : [{ label: 'Download', icon: DocExport, onClick: () => { downloadCsv(formatCSVData(requests)) } }]
    )
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
