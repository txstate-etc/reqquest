<script lang="ts">
  import { Tooltip } from 'carbon-components-svelte'
  import type { ApplicationForDetails } from '$lib'

  export let application: ApplicationForDetails
</script>

{#if application.warningReasons.length || application.ineligibleReasons.length || application.metReasons.length}
  <Tooltip align="end" direction="bottom" triggerText="" class="reason-tooltip">
    {#if application.metReasons.length}
      <p><strong>Eligible Because:</strong></p>
      {#each application.metReasons as reason (reason)}
        <p>{reason}</p>
      {/each}
    {:else if application.ineligibleReasons.length}
      <p><strong>Ineligible Because:</strong></p>
      {#each application.ineligibleReasons as reason (reason)}
        <p>{reason}</p>
      {/each}
    {:else if application.warningReasons.length}
      <p><strong>Warnings:</strong></p>
      {#each application.warningReasons as reason (reason)}
        <p>{reason}</p>
      {/each}    
    {/if}
  </Tooltip>
{/if}
