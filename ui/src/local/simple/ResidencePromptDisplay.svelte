<script lang="ts">
  import type { StateResidencePromptData } from './types.js'
  export let data: StateResidencePromptData
  // export let configData
  // $: resultText = `Resident homeowner of ${configData.state_residence_req.residentOfState}`  
</script>
{#if data.residentOfRequiredState}
   Resident of ##configData is not available to display state##<!-- Config data does not seem to be available for display prompt {resultText}. -->
{:else}
  Non resident.
{/if}
