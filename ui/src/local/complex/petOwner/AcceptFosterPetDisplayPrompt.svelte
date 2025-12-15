<script lang="ts">
  import { Card } from '@txstate-mws/carbon-svelte'
  export let data
</script>

<p>Selected pet for fostering: { !!data.accept ? `#${data.id}`: 'No' }</p>