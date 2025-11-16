<script lang="ts">
  import { Tooltip } from 'carbon-components-svelte'
  import type { ApplicationForDetails } from './types'

  export let application: ApplicationForDetails
</script>

{#if application.warningReasons.length || application.ineligibleReasons.length}
  <Tooltip align="end" direction="bottom" triggerText="" class="reason-tooltip">
    {#if application.ineligibleReasons.length}
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
