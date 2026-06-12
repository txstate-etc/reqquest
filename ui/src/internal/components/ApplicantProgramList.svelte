<script lang="ts">
  import { TagSet } from '@txstate-mws/carbon-svelte'
  import { Button } from 'carbon-components-svelte'
  import { Close, InProgress, CheckmarkFilled, Information, SubtractAlt } from 'carbon-icons-svelte'
  import { ucfirst } from 'txstate-utils'
  import { type ApplicationForDetails, type AppRequestForDetails, enumApplicationStatus, enumIneligiblePhases, enumRequirementStatus, enumRequirementType, type OptOutApplication, type PromptDefinition } from '$lib'
  import { getApplicationStatusInfo } from '../status-utils.js'
  import ApplicantProgramListTooltip from './ApplicantProgramListTooltip.svelte'
  import WarningIconYellow from './WarningIconYellow.svelte'
  import { api } from '$internal/api.js'
  import { stagedprompts } from '$internal/prompt-utils.js'
  import ApplicantOptOutModal from './ApplicantOptOutModal.svelte'

  export let appRequest: AppRequestForDetails
  export let applications: ApplicationForDetails[]
  export let viewMode = false
  export let showTooltipsAsText = false
  export let promptsById: Record<string, any> = {}

  let open = false
  let optIn = false
  let optOutPrompt: Omit<PromptDefinition, 'displayComponent'> | undefined
  let optOutSelected: OptOutApplication | undefined

  async function openOptOutModal (programId: string, openOptIn = false) {
    optOutSelected = optOutPrograms[programId]
    await loadOptOutPrompt()
    optIn = openOptIn
    open = true
  }

  $: promptsByApplicationId = applications.reduce<Record<string, typeof applications[0]['requirements'][0]['prompts'] | undefined>>((acc, curr) => ({
    ...acc,
    [curr.id]: curr.requirements
      .filter(r => r.type === enumRequirementType.QUALIFICATION)
      .flatMap(r => r.prompts)      
  }), {})

  $: programButtonStatus = applications.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: curr.completionStatus === enumApplicationStatus.PENDING
      ? curr.requirements.some(r => r.prompts.some(p => p.answered && !p.invalidated))
        ? curr.requirements.filter(r => r.type === enumRequirementType.QUALIFICATION).every(r => r.prompts.every(p => p.answered && !p.invalidated))
          ? 'complete'
          : 'continue'
        : 'start'
      : curr.completionStatus === enumApplicationStatus.INELIGIBLE
        ? curr.ineligiblePhase === enumIneligiblePhases.PREQUAL
          ? 'ineligible'
          : 'revisit'
        : 'complete'
  }), {} as Record<string, string>)

  $: programFirstPromptId = applications.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: (promptsByApplicationId[curr.id]?.find(p => (!p.answered || p.invalidated) && !p.optOut) ?? (promptsByApplicationId[curr.id]?.[0]?.optOut ? promptsByApplicationId[curr.id]?.[1] : promptsByApplicationId[curr.id]?.[0]))?.id
  }), {} as Record<string, string | undefined>)

  $: optOutPrograms = applications.reduce((acc, curr) => {
    const optOut = curr.requirements.flatMap(r => r.prompts).find(({ optOut: optOutPrompt }) => optOutPrompt)

    if (!optOut) return acc

    return {
      ...acc,
      [curr.id]: {
        ...curr,
        prompt: optOut
      }
    }
  }, {} as Record<string, OptOutApplication | undefined>)

 $: optedOutPrograms = applications
    .filter(curr => curr.requirements.flatMap(r => r.prompts).find(r => r.optOut))
    .reduce((acc, c) => {
      const optOutRequirement = c.requirements.find(r => r.prompts.some(p => p.optOut))
      return {
        ...acc,
        [c.id]: optOutRequirement?.status === enumRequirementStatus.DISQUALIFYING
      }
    }, {} as Record<string, boolean>)

  async function loadOptOutPrompt () {
    const promptId = optOutSelected?.prompt?.id
    if (!promptId) return
    if (promptsById[promptId]?.prestage && !stagedprompts.has(promptId)) {    
      const response = await api.stagePrompt(promptId, appRequest.dataVersion) 
      if (response.success) stagedprompts.add(promptId)
    }     
    const { prompt } = await api.getApplicantPrompt(appRequest.id, promptId)
    optOutPrompt = prompt
  }

</script>

<section class="programs-container">
  <header>
    <div class="program column">Program</div>
    <div class="status column">Eligibility</div>
  </header>
  {#each applications as application (application.id)}
    {@const programStatus = programButtonStatus[application.id]}
    {@const programFirstPrompt = programFirstPromptId[application.id]}
    <div class="program column [ flex-col ]" style='align-items: start;'>
      <span>{application.title}</span>
      {#if optedOutPrograms[application.id]}
        <Button on:click={() => openOptOutModal(application.id, true)} kind='ghost' style='padding: 0; min-height: 0;' class='[ p-0 justify-start ]'>Opt In</Button>
      {:else if optOutPrograms[application.id]}
        <Button on:click={() => openOptOutModal(application.id)} kind='ghost' style='padding: 0; min-height: 0;' class='[ p-0 justify-start ]'>Opt out</Button>
      {/if}
    </div>
    <div class="status column" class:no-tooltip={!application.statusReason?.length}>
      {#if !viewMode}
        <div class="icon-and-tooltip" class:wide-icon={application.completionStatus === enumApplicationStatus.INELIGIBLE}>
          {#if optedOutPrograms[application.id]}
            <SubtractAlt size={24} fill='#dd3b46'/>
          {:else if application.completionStatus === enumApplicationStatus.INELIGIBLE}
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
        {#if optedOutPrograms[application.id]}
          <p>Opted out</p>
        {:else if programFirstPrompt && programStatus !== 'ineligible'}
          <Button size="small" kind={programStatus === 'complete' ? 'ghost' : programStatus === 'revisit' ? 'secondary' : 'primary'} href={programFirstPrompt}>{ucfirst(programStatus)}</Button>
        {/if}
      {:else}
        {@const statusInfo = getApplicationStatusInfo(application.status, appRequest.phase, appRequest.closedAt)}
        <TagSet tags={[{ type: statusInfo.color, label: statusInfo.label }]} />
        <ApplicantProgramListTooltip {application} />
      {/if}
    </div>
    {#if application.warningReasons.length || application.ineligibleReasons.length}
      <div class="tooltip-text-row" class:visible={showTooltipsAsText}>
        {#each application.ineligibleReasons as reason (reason)}
          <div class="tooltip-text-item">
            <Information size={16} /> {reason}
          </div>
        {/each}
        {#each application.warningReasons as reason (reason)}
          <div class="tooltip-text-item">
            <Information size={16} /> {reason}
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</section>


{#if optOutPrompt?.key}
  <ApplicantOptOutModal bind:open bind:optIn bind:prompt={optOutPrompt} {optOutSelected} {appRequest} />
{/if}

<style>
  .programs-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin-bottom: 1.5rem;
    background-color: #F2F2F2;
  }

  .programs-container header {
    display: contents;
    font-weight: bold;
  }

  .programs-container header .column {
    padding: 0.75rem 10px;
  }

  .programs-container .column {
    border-bottom: 1px solid var(--cds-ui-03, #e0e0e0);
    padding: .5rem 10px;
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

  .tooltip-text-row {
    grid-column: span 2;
    background-color: #FBF1DA;
    padding: 0.5rem 1rem;
    display: none;
  }

  .tooltip-text-row.visible {
    display: block;
  }

  .tooltip-text-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.125rem 16px;
    color: var(--cds-text-01);
  }

  @media print {
    .tooltip-text-row {
      display: block !important;
    }
  }

  :global(.opt-out-modal .bx--modal-content) {
    margin-bottom: 1rem;
  }
</style>
