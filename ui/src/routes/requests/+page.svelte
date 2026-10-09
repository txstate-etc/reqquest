<script lang="ts">
  import { ColumnList, FieldDate, FieldMultiselect, FieldSelect, FieldTextInput, FilterUI, IntroPanel, Pagination, Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import { DateTime } from 'luxon'
  import { htmlEncode, isBlank, isNotBlank, keyby, sortby, toQuery } from 'txstate-utils'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { api, FieldNestedMultiselect, getProgramStatusFilterItems, getReviewerStatusFilterOptions, getReviewerStatusTags, ProgramStatusCell, twoLineDateHtml, REVIEWER_STATUS_CONFIG } from '$internal'
  import { enumApplicationRescindedStatus } from '$lib'
  import { uiRegistry } from '../../local/index.js'
  import type { PageData } from './$types.js'
  import { _defaultRequestListFilters } from './+page.js'

  export let data: PageData

  $: ({ appRequests, appRequestIndexes: indexes, allPeriods, openPeriods, access, filters, programs } = data)
  const statusFilterItems = getReviewerStatusFilterOptions({ includeClosed: true })
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

  async function downloadCSV (ids?: string[]) {
    const ticket = await api.getDownloadTicket()
    const query = toQuery({ f: ids?.length ? { ids } : (filters ?? _defaultRequestListFilters) } as unknown as Parameters<typeof toQuery>[0])
    location.href = `${api.baseUrl}/csv/${ticket}/requests/requests${DateTime.now().toFormat('yyyyLLddHHmmss')}.csv?${query}`
  }
</script>
<div class='intro-wide [ px-[20px] ]'>
  <div class="requests-filters">
  <FilterUI search>
    <svelte:fragment slot="quickfilters">
      <FieldMultiselect
        path="status"
        labelText="Application status"
        label="Choose one or more"
        hideLabel={false}
        json
        items={statusFilterItems}
      />
      <FieldNestedMultiselect
        path="applicationStatuses"
        labelText="Program status"
        items={getProgramStatusFilterItems()}
      />
      <FieldMultiselect
        path="programKeys"
        labelText="Program"
        label="Choose one or more"
        hideLabel={false}
        items={programs.map(p => ({ value: p.key, label: p.title }))}
      />
    </svelte:fragment>
    <FieldMultiselect
      path="periodIds"
      label="Periods"
      placeholder="Select Periods"
      items={allPeriods.map(p => ({ value: p.id, label: p.name }))}
      filterable
    />
    {#each filterIndexes as filterIdx (filterIdx.category)}
      <FieldMultiselect path="indexes.{filterIdx.category}"
        label={filterIdx.categoryLabel}
        placeholder={filterIdx.categoryLabel}
        items={filterIdx.listable ? filterIdx.values : unlistableIndexItems[filterIdx.category] ?? []}
        filterable={!filterIdx.listable}
        on:input={!filterIdx.listable ? searchIndexItems(filterIdx.category) : () => {}}
      />
    {/each}
    <FieldDate
      path="createdAfter"
      labelText="Created After"
      placeholder="Select a date"
      beginningOfDay
    />
    <FieldDate
      path="createdBefore"
      labelText="Created Before"
      placeholder="Select a date"
      endOfDay
    />
    <Panel bind:expanded={showDateFilters} expandable title="Additional Date Filters">
      <FieldDate
        path="submittedAfter"
        labelText="Submitted After"
        placeholder="Select a date"
        beginningOfDay
      />
      <FieldDate
        path="submittedBefore"
        labelText="Submitted Before"
        placeholder="Select a date"
        endOfDay
      />
      <FieldDate
        path="closedAfter"
        labelText="Closed After"
        placeholder="Select a date"
        beginningOfDay
      />
      <FieldDate
        path="closedBefore"
        labelText="Closed Before"
        placeholder="Select a date"
        endOfDay
      />
      <FieldDate
        path="updatedAfter"
        labelText="Updated After"
        placeholder="Select a date"
        beginningOfDay
      />
      <FieldDate
        path="updatedBefore"
        labelText="Updated Before"
        placeholder="Select a date"
        endOfDay
      />
    </Panel>
  </FilterUI>
  </div>
  <IntroPanel title="All Applications" subtitle="This is where you can see all applications submitted to the business app. Browse them all or use the filters above to narrow down applications." />
  <ColumnList
    autoHideColumns
    title={uiRegistry.getPlural('appRequest')}
    columns={[
      { id: 'id', label: 'Request #', fixed: '90px', minWidth: 90, tags: r => [{ label: r.id }] },
      { id: 'login', label: uiRegistry.getWord('login'), minWidth: 100, tags: r => [{ label: r.applicant.login, type: 'green' }] },
      { id: 'period', label: uiRegistry.getWord('period'), minWidth: 150, render: r => htmlEncode(r.period.name) },
      { id: 'name', label: 'Name', render: r => r.applicant.fullname, grow: 2 },
      { id: 'dateSubmitted', label: 'Submitted', minWidth: 120, render: r => twoLineDateHtml(r.createdAt) },
      { id: 'program', label: 'Program', minWidth: 220, component: ProgramStatusCell },
      { id: 'status', label: 'Application status', minWidth: 150, tags: r => getReviewerStatusTags(r.status, r.phase, r.closedAt) },
      ...indexColumns,
      { id: 'lastUpdated', label: 'Last Updated', minWidth: 120, render: r => twoLineDateHtml(r.updatedAt) }
    ]}
    selectedActions={rows => [
      { label: 'Download selected', icon: DocExport, onClick: () => downloadCSV(rows.map(r => r.id)) }
    ]}
    listActions={[
      ...(access.createAppRequestOther
        ? [
          { label: `Create ${uiRegistry.getWord('appRequest')}`, onClick: openCreateDialog }
        ]
        : []
      ),
      { label: 'Download', icon: DocExport, onClick: async () => { await downloadCSV() } }
    ]}
    actions={row => [
      { icon: View, label: 'View', onClick: () => { goto(`/requests/${row.id}/approve`) } }
    ]}
    rows={requests}
  >
    <svelte:fragment let:row>
      <div class="[ mb-2 ]"><strong>Programs</strong></div>
      <ProgramStatusCell {row} rollup={false} />
    </svelte:fragment>
  </ColumnList>
  <Pagination
    totalItems={data.pageInfo.appRequests?.totalItems}
    page={data.pageInfo.appRequests?.currentPage}
    pageSize={25}
    chooseSize
  />
</div>

<PanelFormDialog open={createDialog} title={`Create ${uiRegistry.getWord('appRequest')}`} validate={validateAppRequest} submit={submitAppRequest} on:cancel={closeCreateDialog} on:saved={onCreateSaved}>
  <FieldSelect
    labelText={uiRegistry.getWord('period')}
    path="periodId"
    items={openPeriods.map(p => ({ value: p.id, label: p.name }))}
    required
    helperText={`Select the ${uiRegistry.getWord('period').toLowerCase()} in which you want to create an ${uiRegistry.getWord('appRequest').toLowerCase()}.`}
  />
  <FieldTextInput
    path="login"
    labelText={`Applicant ${uiRegistry.getWord('login')}`}
    required
    notNull
    helperText={`Enter the ${uiRegistry.getWord('login').toLowerCase()} of the applicant for this request.`}
  />
</PanelFormDialog>

<style>
  .intro-wide :global(.intro-panel .content-start) {
    max-width: none;
  }
  /* the quick-filter fields carry labels above them; bottom-align the row so the search box and
     More filters button sit level with the fields rather than with the labels */
  .requests-filters :global(.filter-ui-container) {
    align-items: flex-end;
  }
  .app-requests-intro {
    background-color: var(--cds-layer);
  }
</style>
