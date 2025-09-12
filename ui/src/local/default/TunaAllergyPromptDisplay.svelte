<script lang="ts">
  import type { TunaAllergyData } from './types.js'
  export let data: TunaAllergyData
</script>

{#if data.allergicToTuna}
  Allergic.
{:else}
  Not allergic.
{/if}
