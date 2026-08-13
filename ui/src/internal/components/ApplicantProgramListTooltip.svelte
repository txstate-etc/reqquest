<script lang="ts">
  import { Tooltip } from 'carbon-components-svelte'
  import { isNotBlank } from 'txstate-utils'
  import type { ApplicationForDetails } from '$lib'
  import { isIneligiblePreSubmission } from '../appreq-utils.js'

  export let application: ApplicationForDetails

  // Programs that died before submission get extra context above the failing reason: what the
  // program is and a summary of what it would have required. An applicant disqualified early may
  // never have seen the program's prompts, so the statusReason alone lacks context.
  $: programDescriptions = isIneligiblePreSubmission(application)
    ? [application.applicantDescription, application.eligibilityDescription].filter(isNotBlank)
    : []
</script>

{#if application.warningReasons.length || application.ineligibleReasons.length || application.metReasons.length || programDescriptions.length}
  <Tooltip align="end" direction="bottom" triggerText="" class="reason-tooltip">
    {#if application.ineligibleReasons.length || programDescriptions.length}
      {#each application.ineligibleReasons as reason (reason)}
        <p>{reason}</p>
      {/each}
      {#each programDescriptions as description (description)}
        <p class="program-description">{description}</p>
      {/each}
    {:else if application.warningReasons.length}
      <p><strong>Warnings:</strong></p>
      {#each application.warningReasons as reason (reason)}
        <p>{reason}</p>
      {/each}
    {:else if application.metReasons.length}
      {#each application.metReasons as reason (reason)}
        <p>{reason}</p>
      {/each}
    {/if}
  </Tooltip>
{/if}

<style>
  .program-description {
    margin-top: 0.75rem;
  }
</style>
