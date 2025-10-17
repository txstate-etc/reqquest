<script lang="ts">
  import { Button, Tooltip } from 'carbon-components-svelte'
  import Close from 'carbon-icons-svelte/lib/Close.svelte'
  import InProgress from 'carbon-icons-svelte/lib/InProgress.svelte'
  import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte'
  import { getContext } from 'svelte'
  import { ucfirst } from 'txstate-utils'
  import { afterNavigate } from '$app/navigation'
  import type { PageData } from './$types'
  import ProgressNavContainer from '../ProgressNavContainer.svelte'
  import { enumApplicationStatus, enumIneligiblePhases, enumPromptVisibility } from '$lib'

  export let data: PageData
  $: ({ appRequestForNavigation } = data)

  $: programButtonStatus = appRequestForNavigation.applications.reduce<Record<string, 'start' | 'ineligible' | 'continue' | 'revisit' | 'complete'>>((acc, curr) => ({
    ...acc,
    [curr.id]: curr.status === enumApplicationStatus.PENDING
      ? curr.requirements.some(r => r.prompts.some(p => p.answered))
        ? 'continue'
        : 'start'
      : curr.status === enumApplicationStatus.INELIGIBLE
        ? curr.ineligiblePhase === enumIneligiblePhases.PREQUAL
          ? 'ineligible'
          : 'revisit'
        : 'complete'
  }), {})
  $: programFirstPromptKey = appRequestForNavigation.applications.reduce<Record<string, string | undefined>>((acc, curr) => ({
    ...acc,
    [curr.id]: curr.requirements.flatMap(r => r.prompts).find(p => p.visibility === enumPromptVisibility.AVAILABLE || p.visibility === enumPromptVisibility.REQUEST_DUPE)?.key
  }), {})

  let prevHref: string | undefined
  let nextHref: string
  const getNextHref = getContext<() => { nextHref: string, prevHref: string | undefined }>('nextHref')
  afterNavigate(() => {
    ({ prevHref, nextHref } = getNextHref())
  })
</script>

<ProgressNavContainer title="Your potential programs" subtitle='Select "Start" to answer additional qualifying questions about the benefits you may be eligible for.'>
  <section class="programs-container">
    <header>
      <div class="program column">Program</div>
      <div class="status column">Eligibility</div>
    </header>
    {#each appRequestForNavigation.applications as application (application.id)}
      {@const programStatus = programButtonStatus[application.id]}
      {@const programFirstPrompt = programFirstPromptKey[application.id]}
      <div class="program column">{application.title}</div>
      <div class="status column" class:no-tooltip={!application.statusReason?.length}>
        <div class="icon-and-tooltip" class:wide-icon={application.status === enumApplicationStatus.INELIGIBLE}>
          {#if application.status === enumApplicationStatus.INELIGIBLE}
            <Close size={32} class="status-icon-ineligible" />
          {:else if application.status === enumApplicationStatus.PENDING}
            <InProgress size={24} class="status-icon-pending" />
          {:else}
            <CheckmarkFilled size={24} class="status-icon-complete" />
          {/if}
          {#if application.statusReason?.length}
            <Tooltip align="end" direction="bottom" triggerText="" class="reason-tooltip">
              {application.statusReason}
            </Tooltip>
          {/if}
        </div>
        {#if programFirstPrompt && programStatus !== 'ineligible'}
          <Button size="small" kind={programStatus === 'complete' ? 'ghost' : programStatus === 'revisit' ? 'secondary' : 'primary'} href="{programFirstPrompt}">{ucfirst(programStatus)}</Button>
        {/if}
      </div>
    {/each}
  </section>
  {#if appRequestForNavigation.applications.some(a => a.status === enumApplicationStatus.INELIGIBLE)}
    <div class="program-helptext">
      If you believe you should be eligible, read the tooltips above and review your answers. If you believe there is an error, please contact us.
    </div>
  {/if}
  <div class='form-submit flex gap-12 justify-center mt-16'>
    {#if prevHref}
      <Button kind="ghost" href={prevHref}>Back</Button>
    {/if}
    <Button type="submit" href={nextHref}>Continue</Button>
  </div>

</ProgressNavContainer>

<style>
  .programs-container {
    display: grid;
    grid-template-columns: 1fr min-content;
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
    justify-content: center;
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

  .icon-and-tooltip {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .icon-and-tooltip.wide-icon {
    gap: 4px;
  }

  .program-helptext {
    text-align: center;
    font-size: 0.9rem;
  }
</style>
