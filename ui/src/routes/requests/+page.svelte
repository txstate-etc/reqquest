<script lang="ts">
  import { ColumnList, FieldMultiselect, FilterUI } from '@txstate-mws/carbon-svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { htmlEncode, keyby, sortby } from 'txstate-utils'
  import { api } from '$lib'
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
  $: filterIndexes = sortby(indexes.filter(idx => idx.listFiltersPriority && (idx.values.length || !idx.listable)), 'listFiltersPriority')

  const unlistableIndexItems: Record<string, { value: string, label: string }[] | undefined> = {}
  const filterInputs: Record<string, string> = {}
  async function searchIndexItems (category: string, search: string) {
    unlistableIndexItems[category] = await api.searchIndexItems(category, search)
  }
  function onFilterSearch (filterIdx: typeof filterIndexes[number]) {
    return (e: CustomEvent) => {
      if (filterIdx.listable || !(e.target instanceof HTMLInputElement)) return
      if (filterInputs[filterIdx.category] === e.target.value) return
      filterInputs[filterIdx.category] = e.target.value
      searchIndexItems(filterIdx.category, e.target.value).catch(console.error)
    }
  }
</script>
<FilterUI>
  <svelte:fragment slot="quickfilters">
    {#each filterIndexes as filterIdx (filterIdx.category)}
      <FieldMultiselect path={filterIdx.category}
        label={filterIdx.categoryLabel}
        placeholder={filterIdx.categoryLabel}
        items={filterIdx.listable ? filterIdx.values : unlistableIndexItems[filterIdx.category] ?? []}
        filterable
        on:input={onFilterSearch(filterIdx)}
      />
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
