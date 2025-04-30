<script lang="ts">
  import { ColumnList } from '@txstate-mws/carbon-svelte'

  export let data
  $: ({ requests } = data)
</script>

<ColumnList title="App Requests" columns={[
  { get: 'id', id: 'id', label: 'ID' }
]} rows={requests} />
