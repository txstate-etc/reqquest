<script lang="ts">
  import type { StateResidencePromptData } from './types.js'
  export let data: StateResidencePromptData
</script>

{#if data.residentOfRequiredState}
  Resident.
{:else}
  Non resident.
{/if}
