<script lang="ts">
  import { base } from "$app/paths"
  import { ColumnList, FieldDate, FieldMultiselect, FieldSelect, FilterUI, Pagination } from "@txstate-mws/carbon-svelte"
  import { DateTime } from "luxon"
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'

  export let data: any
  export let title: string
  export let subtitle: string
</script>

<div class="flow [ p-4 bg-gray-100 ]">
  <h2 class="[ text-lg ]">{title}</h2>
  <p class="[ text-gray-600 ]">{subtitle}</p>
</div>

<ColumnList
  searchable
  filterTitle='Request Filters'
  listActions={[
      { label: 'Download', icon: DocExport, onClick: () => { alert('Add Structure') } }
  ]}
  columns={[
    { id: 'request', label: 'Request #', tags: (row) => [{ label: String(row.id), }] },
    { id: 'period', label: 'Period', render: r => r.period.name },
    { id: 'aNumber', label: 'TXST ID' },
    { id: 'name', label: 'Name', get: 'applicant.fullname' },
    { id: 'dateSubmitted', label: 'Date Submitted', render: r => DateTime.fromISO(r.createdAt).toFormat('f') },
    { id: 'benefit', label: 'Benefit', render: r => r.applications.map(a => a.title).join(', ') },
    { id: 'lastUpdated', label: 'Last Updated', render: r => DateTime.fromISO(r.updatedAt).toFormat('f') },
  ]}
  rows={data}
  title="App Requests"

  actions={r => [
    {
      label: 'View',
      icon: View,
      href: `${base}/requests/${r.id}/apply`
    }
  ]}
>
  <svelte:fragment slot="filters">
    <FieldMultiselect
      path="period"
      labelText="Period"
      items={[]}
      placeholder="Choose one or more"
    />
    <FieldDate
    path='dateSubmitted'
    label='Date Submitted'
    />
    <FieldMultiselect
      path="test"
      labelText="Period"
      items={[]}
      placeholder="Choose one or more"
    />
  </svelte:fragment>
</ColumnList>

<Pagination
  totalItems={data.length}
  pageSize={25}
  chooseSize
/>
