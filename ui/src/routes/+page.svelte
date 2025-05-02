<script lang="ts">
    import type { PageData } from './$types'

  export let data: PageData
  $: ({ appRequests } = data)
</script>

<pre>{JSON.stringify(appRequests, null, 2)}</pre>
