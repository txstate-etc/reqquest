<script lang="ts">
  import { ColumnList } from '@txstate-mws/carbon-svelte'
  import { View } from 'carbon-icons-svelte'
  import { base } from '$app/paths'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ appRequests } = data)
</script>

<pre>{JSON.stringify(appRequests, null, 2)}</pre>
<ColumnList
  columns={[{ id: 'period', label: 'Period', render: r => r.period.name }, { id: 'Status', label: 'Status' }]}
  rows={appRequests}
  title="App Requests"
  actions={r => [
    {
      label: 'View',
      icon: View,
      href: `${base}/requests/${r.id}/apply`
    }
  ]}
/>
