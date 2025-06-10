<script lang="ts">
  import { ColumnList, FilterUI } from '@txstate-mws/carbon-svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { htmlEncode, sortby } from 'txstate-utils'
  import { uiRegistry } from '../../local/index.js'
  import type { PageData } from './$types.js'

  export let data: PageData
  $: ({ appRequests: requests, appRequestIndexes: indexes } = data)
  $: indexColumns = sortby(indexes.filter(idx => idx.appRequestListPriority), 'appRequestListPriority').map(idx => ({
    id: idx.category,
    label: idx.categoryLabel,
    render: (r: PageData['appRequests'][number]) => htmlEncode(r.indexCategories.find(c => c.category === idx.category)?.values.map(v => v.label).join(', '))
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
