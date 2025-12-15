<script lang="ts">
  import { Card } from '@txstate-mws/carbon-svelte'
  export let data
</script>

<p>Selected dog for adoption: { !!data.accept ? `#${data.id}`: 'No' }</p>