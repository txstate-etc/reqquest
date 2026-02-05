<script lang="ts">
  import { ColumnList, FieldDate, FieldMultiselect, Pagination, type ActionItem } from '@txstate-mws/carbon-svelte'
  import { DateTime } from 'luxon'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import DocExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import { pluralize } from 'txstate-utils'
  import { base } from '$app/paths'
  import type { AppRequest } from '$lib'
  import { downloadCsv } from '../csv.js'
  import { uiRegistry } from '../../local/index.js'

  export let data: AppRequest[]
  export let title: string
  export let subtitle: string

  const selectedActions = (rows: AppRequest[]): ActionItem[] => [
    {
      label: `Download ${rows.length} ${pluralize('application', rows.length)}`,
      // icon: TrashCan,
      onClick: () => { console.log(rows); downloadCsv(formatCSVData(rows)) }
    }
  ]

  function formatCSVData (d: AppRequest[]) {
    return d.map(d => ({
      Id: d.id,
      Period: d.period.name,
      [uiRegistry.getWord('login')]: d.applicant.login,
      Name: d.applicant.fullname,
      'Date Submitted': DateTime.fromISO(d.createdAt).toFormat('f').replace(',', ''),
      Benefit: `"${d.applications.map(a => a.title).join(', ')}"`,
      'Last Submitted': DateTime.fromISO(d.updatedAt).toFormat('f').replace(',', '')
    }))
  }
</script>

<div class="flow [ p-4 bg-gray-100 ]">
  <h2 class="[ text-lg ]">{title}</h2>
  <p class="[ text-gray-600 ]">{subtitle}</p>
</div>

<ColumnList
  searchable
  filterTitle='Request Filters'
  {selectedActions}
  listActions={[
    { label: 'Download', icon: DocExport, onClick: () => { console.log(data); downloadCsv(formatCSVData(data)) } }
  ]}
  columns={[
    { id: 'request', label: 'Request #', tags: row => [{ label: String(row.id) }] },
    { id: 'period', label: 'Period', render: r => r.period.name },
    { id: 'login', label: uiRegistry.getWord('login'), tags: r => [{ label: r.applicant.login, type: 'green' }] },
    { id: 'name', label: 'Name', get: 'applicant.fullname' },
    { id: 'dateSubmitted', label: 'Date Submitted', render: r => DateTime.fromISO(r.createdAt).toFormat('f') },
    { id: 'benefit', label: 'Benefit', render: r => r.applications.map(a => a.title).join(', ') },
    { id: 'lastUpdated', label: 'Last Updated', render: r => DateTime.fromISO(r.updatedAt).toFormat('f') }
  ]}
  rows={data}
  title="App Requests"

  actions={r => [
    {
      label: 'View',
      icon: View,
     // href: `${base}/requests/${r.id}/apply`
      href: `${base}/requests/${r.id}/approve`
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
