<script lang="ts">
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { ColumnList } from '@txstate-mws/carbon-svelte'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ roles } = data)
</script>

<ColumnList
  title="Roles"
  columns={[
    { id: 'role', label: 'Role', get: 'name' },
    { id: 'groups', label: 'Groups', render: role => role.groups.join(', ') },
    { id: 'description', label: 'Description', get: 'description' }
  ]}
  rows={roles}
  actions={row => [
    {
      label: 'Edit',
      icon: View,
      href: `/roles/${row.id}`
    }
  ]}
/>
