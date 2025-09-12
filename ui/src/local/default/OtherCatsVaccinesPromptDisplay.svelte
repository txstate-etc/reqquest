<script lang="ts">
  import type { VaccineData } from './types.js'
  export let data: VaccineData
</script>

{#each [data.distemperDoc, data.rabiesDoc, data.felineLeukemiaDoc, data.felineHIVDoc] as doc}
  {#if doc}
    <div>
      {doc.name} ({Math.round(doc.size / 1024)} KB)
    </div>
  {:else}
    <div>No document uploaded.</div>
  {/if}
{/each}
