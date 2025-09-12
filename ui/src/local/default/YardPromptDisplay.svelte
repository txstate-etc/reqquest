<script lang="ts">
  import type { YardData } from './types.js'
  export let data: YardData
</script>

{#if !data.haveYard}
  No yard.
{:else}
  <dl>
    <dt>Square Footage</dt>
    <dd>{data.squareFootage ?? ''}</dd>
    <dt>Total Pets</dt>
    <dd>{data.totalPets ?? ''}</dd>
  </dl>
{/if}
