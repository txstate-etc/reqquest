<script lang="ts">
  import { Card } from '@txstate-mws/carbon-svelte'
  export let data
</script>

<p>Selected cat for adoption: { !!data.accept ? `#${data.id}`: 'No' }</p>