<script lang="ts">
  import { ColumnList, FilterUI } from '@txstate-mws/carbon-svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { htmlEncode, keyby, sortby } from 'txstate-utils'
  import { uiRegistry } from '../../local/index.js'
  import type { PageData } from './$types.js'

  export let data: PageData
  $: ({ appRequests, appRequestIndexes: indexes } = data)
  $: requests = appRequests.map(r => ({ ...r, indexByCat: keyby(r.indexCategories, 'category') }))
  $: indexColumns = sortby(indexes.filter(idx => idx.appRequestListPriority), 'appRequestListPriority').map(idx => ({
    id: idx.category,
    label: idx.categoryLabel,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- r.indexByCat[idx.category] may be undefined if no values are present
    render: (r: typeof requests[number]) => htmlEncode(r.indexByCat[idx.category]?.values.map(v => v.label).join(', '))
  }))
  $: filterIndexes = sortby(indexes.filter(idx => idx.listFiltersPriority), 'listFiltersPriority')
</script>
<FilterUI>
  <svelte:fragment slot="quickfilters">
    {#each filterIndexes as filterIdx (filterIdx.category)}
      {filterIdx.categoryLabel}
    {/each}
  </svelte:fragment>
</FilterUI>
<ColumnList
  title={uiRegistry.getPlural('appRequest')}
  columns={[
    { id: 'period', label: uiRegistry.getWord('period'), render: r => htmlEncode(r.period.name) },
    { id: 'login', label: uiRegistry.getWord('login'), render: r => r.applicant.login },
    { id: 'status', label: 'Status', render: r => r.status },
    ...indexColumns
  ]}
  actions={row => [
    { icon: View, label: 'View', href: `/requests/${row.id}/approve` }
  ]}
  rows={requests}
/>
