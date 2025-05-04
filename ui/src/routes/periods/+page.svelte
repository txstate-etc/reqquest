<script lang="ts">
  import { ColumnList } from '@txstate-mws/carbon-svelte'
  import { SettingsEdit } from 'carbon-icons-svelte'
  import { isBlank } from 'txstate-utils'
  import { base } from '$app/paths'
  import type { PageData } from './$types'

  type Period = PageData['periods'][number]

  export let data: PageData
  $: ({ periods } = data)

  function renderDate (prop: 'openDate' | 'closeDate' | 'archiveAt') {
    return (period: Period) => {
      const date = period[prop]
      if (isBlank(date)) return ''
      return new Date(date).toLocaleDateString()
    }
  }
</script>

<ColumnList
  title="Periods"
  columns={[
    { id: 'period', label: 'Period', get: 'name' },
    { id: 'openDate', label: 'Start Date', render: renderDate('openDate') },
    { id: 'closeDate', label: 'Close Date', render: renderDate('closeDate') },
    { id: 'archiveDate', label: 'Archive Date', render: renderDate('archiveAt') },
    { id: 'status', label: 'Status', get: 'status' }
  ]}
  rows={periods}
  actions={p => [
    { label: 'Configure', icon: SettingsEdit, href: `${base}/periods/${p.id}/configure` }
  ]}
/>
