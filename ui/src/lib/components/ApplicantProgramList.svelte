<script lang="ts">
  import { TagSet } from '@txstate-mws/carbon-svelte'
  import { Button } from 'carbon-components-svelte'
  import { Close, InProgress, CheckmarkFilled } from 'carbon-icons-svelte'
  import { ucfirst } from 'txstate-utils'
  import type { ApplicationForDetails } from './types'
  import { enumApplicationStatus, enumIneligiblePhases, enumRequirementType, getApplicationStatusInfo } from '$lib'
  import ApplicantProgramListTooltip from './ApplicantProgramListTooltip.svelte'
  import WarningIconYellow from './WarningIconYellow.svelte'

  export let applications: ApplicationForDetails[]
  export let viewMode = false

  $: promptsByApplicationId = applications.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: curr.requirements
      .filter(r => r.type === enumRequirementType.QUALIFICATION)
      .flatMap(r => r.prompts)
  }), {})

  $: programButtonStatus = applications.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: curr.completionStatus === enumApplicationStatus.PENDING
      ? curr.requirements.some(r => r.prompts.some(p => p.answered))
        ? curr.requirements.filter(r => r.type === enumRequirementType.QUALIFICATION).every(r => r.prompts.every(p => p.answered))
          ? 'complete'
          : 'continue'
        : 'start'
      : curr.completionStatus === enumApplicationStatus.INELIGIBLE
        ? curr.ineligiblePhase === enumIneligiblePhases.PREQUAL
          ? 'ineligible'
          : 'revisit'
        : 'complete'
  }), {})
  $: programFirstPromptId = applications.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: (promptsByApplicationId[curr.id].find(p => !p.answered) ?? promptsByApplicationId[curr.id][0])?.id
  }), {})
</script>

<section class="programs-container">
  <header>
    <div class="program column">Program</div>
    <div class="status column">Eligibility</div>
  </header>
  {#each applications as application (application.id)}
    {@const programStatus = programButtonStatus[application.id]}
    {@const programFirstPrompt = programFirstPromptId[application.id]}
    <div class="program column">{application.title}</div>
    <div class="status column" class:no-tooltip={!application.statusReason?.length}>
      {#if !viewMode}
        <div class="icon-and-tooltip" class:wide-icon={application.completionStatus === enumApplicationStatus.INELIGIBLE}>
          {#if application.completionStatus === enumApplicationStatus.INELIGIBLE}
            <Close size={32} class="status-icon-ineligible" />
          {:else if ['start', 'continue'].includes(programStatus)}
            <InProgress size={24} class="status-icon-pending" />
          {:else if application.hasWarning}
            <WarningIconYellow size={24} class="status-icon-warning" />
          {:else}
            <CheckmarkFilled size={24} class="status-icon-complete" />
          {/if}
          <ApplicantProgramListTooltip {application} />
        </div>
        {#if programFirstPrompt && programStatus !== 'ineligible'}
          <Button size="small" kind={programStatus === 'complete' ? 'ghost' : programStatus === 'revisit' ? 'secondary' : 'primary'} href={programFirstPrompt}>{ucfirst(programStatus)}</Button>
        {/if}
      {:else}
        {@const statusInfo = getApplicationStatusInfo(application.status)}
        <TagSet tags={[{ type: statusInfo.color, label: statusInfo.label }]} />
        <ApplicantProgramListTooltip {application} />
      {/if}
    </div>
  {/each}
</section>

<style>
  .programs-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin-bottom: 1.5rem;
  }

  .programs-container header {
    display: contents;
    font-weight: bold;
  }

  .programs-container header .column {
    padding: 0.5rem 8px;
  }

  .programs-container .column {
    border-bottom: 1px solid var(--cds-ui-03, #e0e0e0);
    padding: 1rem 8px;
  }

  .programs-container :global(.status-column) {
    flex-grow: 0;
  }

  :not(.header) .program.column {
    display: flex;
    align-items: center;
  }

  :not(.header) .status.column {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
  }

  .status.column :global(.reason-tooltip) {
    height: 16px;
  }
  :not(.header) .status.column.no-tooltip {
    flex-wrap: nowrap
  }

  .programs-container :global(.status-icon-pending) {
    fill: var(--cds-support-04);
  }

  .programs-container :global(.status-icon-complete) {
    fill: var(--cds-support-04);
  }

  .programs-container :global(.status-icon-ineligible) {
    margin-left: -4px;
  }

  .icon-and-tooltip {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .icon-and-tooltip.wide-icon {
    gap: 4px;
  }
</style>
