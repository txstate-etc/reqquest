<script lang="ts">
  import type { UIRegistry } from '$lib/registry.js'
  import { getAppRequestStatusInfo, getApplicationStatusInfo, applicantRequirementTypes, reviewRequirementTypes } from '$lib/status-utils.js'
  import type { Scalars } from '$lib/typed-client/schema'
  import { enumRequirementType, type RequirementType } from '$lib/typed-client/index.js'
  import { Panel, TagSet } from '@txstate-mws/carbon-svelte'
  import { Button, InlineNotification, Tooltip } from 'carbon-components-svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import type { AnsweredPrompt, PromptSection, AppRequestForDetails, ApplicationForDetails } from './types'
  import RenderDisplayComponent from './RenderDisplayComponent.svelte'
  import ApplicantProgramList from './ApplicantProgramList.svelte'
  import WarningIconYellow from './WarningIconYellow.svelte'

  // TODO: design alignement could reduce props here
  export let appRequest: AppRequestForDetails
  export let applications: ApplicationForDetails[]
  export let appData: Scalars['JsonData'] = {}
  export let prequalPrompts: AnsweredPrompt[] | undefined = undefined
  export let postqualPrompts: AnsweredPrompt[] | undefined = undefined
  export let loading = false
  export let uiRegistry: UIRegistry
  export let title = 'View your application'
  export let subtitle = 'Select document names to preview them.'
  export let expandable = true
  export let showWarningsInline = false
  export let showCorrectionsInline = false
  export let showAppRequestStatus = true
  export let statusDisplay: 'tags' | 'icons' = 'tags'
  export let showTooltipsAsText = false

  const CORRECTABLE_STATUSES = ['STARTED', 'READY_TO_SUBMIT', 'DISQUALIFIED']

  $: canMakeCorrections = CORRECTABLE_STATUSES.includes(appRequest.status)

  // Group prompts by sections, with reviewer prompts nested within application sections
  $: sections = (() => {
    const sections: PromptSection[] = []

    // General Questions === PREQUAL prompts
    if (prequalPrompts?.length) {
      sections.push({ title: 'General Questions', prompts: prequalPrompts })
    }

    // Application-Specific Questions with nested Reviewer Questions
    for (const application of applications) {
      const applicantPrompts = application.requirements
        .filter(r => applicantRequirementTypes.has(r.type))
        .flatMap(r => r.prompts)
      const reviewerPrompts = application.requirements
        .filter(r => reviewRequirementTypes.has(r.type))
        .flatMap(r => r.prompts)
      const workflowPrompts = application.requirements
        .filter(r => r.type === enumRequirementType.WORKFLOW)
        .flatMap(r => r.prompts)

      if (applicantPrompts.length || reviewerPrompts.length || workflowPrompts.length) {
        const subsections: PromptSection[] = []
        if (reviewerPrompts.length) subsections.push({ title: 'Reviewer Questions', prompts: reviewerPrompts })
        if (workflowPrompts.length) subsections.push({ title: 'Workflow Questions', prompts: workflowPrompts })
        sections.push({
          title: application.title,
          prompts: applicantPrompts,
          subsections,
          applicationStatus: application.status
        })
      }
    }

    // Additional Questions === POSTQUAL prompts
    if (postqualPrompts?.length) {
      sections.push({ title: 'Additional Questions', prompts: postqualPrompts })
    }

    return sections
  })()

  function hasWarning (prompt: AnsweredPrompt) {
    return prompt.statusReasons.some(r => r.status === 'WARNING' || r.status === 'DISQUALIFYING')
  }

  function getWarnings (prompt: AnsweredPrompt) {
    return prompt.statusReasons.filter(r => r.status === 'WARNING' || r.status === 'DISQUALIFYING')
  }

  function needsCorrection (prompt: AnsweredPrompt) {
    return prompt.invalidated && prompt.invalidatedReason
  }
</script>

{#if appRequest}
  <div class="[ my-6 ] application-details flow">
    <!-- Application Status Panel -->
    <header class="[ mb-12 ] app-view-intro text-center">
      <h2 class="[ text-xl mb-3 ]">{title}</h2>
      <p class="app-view-subtitle mb-3">{subtitle}</p>
    </header>
    <section class="prompt-section">
      <div class="status-content">
        {#if showAppRequestStatus}
          <dl class="status-list-item [ flex items-center justify-between px-2 py-3 border-b ]">
            <dt class="status-list-label font-medium">Application Status</dt>
            <dd class="px-2">
              <TagSet tags={[{ label: getAppRequestStatusInfo(appRequest.status).label, type: getAppRequestStatusInfo(appRequest.status).color }]} />
            </dd>
          </dl>
        {/if}

        <!-- Application Status List -->
        <ApplicantProgramList {applications} viewMode={statusDisplay === 'tags'} {showTooltipsAsText} />
      </div>
    </section>

    <!-- Prompt Sections -->
    {#if loading}
      <Panel title="Loading...">
        <p>Loading prompt data...</p>
      </Panel>
    {:else if sections.length > 0}
      {#each sections as section (section.title)}
        <Panel title={section.title} {expandable} expanded>
          <svelte:fragment slot="headerLeft">
            {#if section.applicationStatus}
              <TagSet tags={[{ label: getApplicationStatusInfo(section.applicationStatus).label, type: getApplicationStatusInfo(section.applicationStatus).color }]} />
            {/if}
          </svelte:fragment>
          {#if section.prompts.length}
            <dl class="prompt-list">
              {#each section.prompts as prompt (prompt.id)}
                {@const def = uiRegistry.getPrompt(prompt.key)}
                <dt class="prompt-term [ font-medium ]">
                  {#if showWarningsInline && hasWarning(prompt)}
                    <Tooltip align="start">
                      <div class="icon" slot="icon">
                        <WarningIconYellow size={16} />
                      </div>
                      {#each getWarnings(prompt) as r, i (i)}
                        <p>
                          {r.status === 'WARNING' ? 'Warning' : 'Disqualifying'}{#if section.title !== r.programName}&nbsp;for {r.programName}{/if}<br>
                          {r.statusReason}
                        </p>
                      {/each}
                    </Tooltip>
                  {/if}
                  {#if showCorrectionsInline && canMakeCorrections && needsCorrection(prompt)}
                    <Tooltip align="start">
                      <div class="icon" slot="icon">
                        <WarningIconYellow size={16} />
                      </div>
                      <p>Correction needed<br>{prompt.invalidatedReason}</p>
                    </Tooltip>
                  {/if}
                  {prompt.title}
                </dt>
                <dd class="prompt-answer flow" class:large={def?.displayMode === 'large'}>
                  <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appData} prompt={prompt} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} />
                  {#if showCorrectionsInline && canMakeCorrections && needsCorrection(prompt)}
                    <Button kind="ghost" size="small" icon={Edit} iconDescription="Edit this answer" href={`/requests/${appRequest.id}/apply/${prompt.id}`} class="edit-button" />
                  {/if}
                </dd>
                {#if showCorrectionsInline && canMakeCorrections && needsCorrection(prompt)}
                  <div class="correction-notice">
                    <InlineNotification kind="warning-alt" title="Correction needed" subtitle={prompt.invalidatedReason ?? ''} hideCloseButton lowContrast />
                  </div>
                {/if}
              {/each}
            </dl>
          {/if}

          <!-- Nested subsections (e.g., Reviewer Questions) -->
          {#if section.subsections}
            {#each section.subsections as subsection (subsection.title)}
              <Panel title={subsection.title} {expandable} expanded>
                <dl class="prompt-list">
                  {#each subsection.prompts as prompt (prompt.id)}
                    {@const def = uiRegistry.getPrompt(prompt.key)}
                    <dt class="prompt-term [ font-medium ]">
                      {#if showWarningsInline && hasWarning(prompt)}
                        <Tooltip align="start">
                          <div class="icon" slot="icon">
                            <WarningIconYellow size={16} />
                          </div>
                          {#each getWarnings(prompt) as r, i (i)}
                            <p>
                              {r.status === 'WARNING' ? 'Warning' : 'Disqualifying'}{#if section.title !== r.programName}&nbsp;for {r.programName}{/if}<br>
                              {r.statusReason}
                            </p>
                          {/each}
                        </Tooltip>
                      {/if}
                      {#if showCorrectionsInline && canMakeCorrections && needsCorrection(prompt)}
                        <Tooltip align="start">
                          <div class="icon" slot="icon">
                            <WarningIconYellow size={16} />
                          </div>
                          <p>Correction needed<br>{prompt.invalidatedReason}</p>
                        </Tooltip>
                      {/if}
                      {prompt.title}
                    </dt>
                    <dd class="prompt-answer flow" class:large={def?.displayMode === 'large'}>
                      <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appData} prompt={prompt} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} />
                      {#if showCorrectionsInline && canMakeCorrections && needsCorrection(prompt)}
                        <Button kind="ghost" size="small" icon={Edit} iconDescription="Edit this answer" href={`/requests/${appRequest.id}/apply/${prompt.id}`} class="edit-button" />
                      {/if}
                    </dd>
                    {#if showCorrectionsInline && canMakeCorrections && needsCorrection(prompt)}
                      <div class="correction-notice">
                        <InlineNotification kind="warning-alt" title="Correction needed" subtitle={prompt.invalidatedReason ?? ''} hideCloseButton lowContrast />
                      </div>
                    {/if}
                  {/each}
                </dl>
              </Panel>
            {/each}
          {/if}
        </Panel>
      {/each}
    {:else}
      <Panel title="Prompts and Answers">
        <p>No prompts available for this application.</p>
      </Panel>
    {/if}

    <slot name="footer" />
  </div>
{:else}
  <p>No application selected</p>
{/if}

<style>
  .app-view-subtitle {
    color: var(--cds-text-02);
    /* margin-top: -0.5rem; */
    margin-bottom: 1rem;
  }

  .status-list-item {
    border-bottom: 1px solid var(--cds-border-subtle);
  }

  .prompt-answer :global(dl) {
    padding-block-start:1em;
    display:grid;
    grid-template-columns: 1fr 1fr;
    row-gap:0.5rem;
  }

  .status-content dl {
    padding-block-start:1em;
    display:grid;
    grid-template-columns: 2fr 1fr;
    row-gap:0.5rem;
  }

  .status-list-item {
    border-color: var(--cds-border-subtle);
  }

  .status-list-label {
    color: var(--cds-text-01);
  }

  .prompt-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
    row-gap: 0.5rem;
  }
  .prompt-list dt, .prompt-list dd {
    padding-bottom: 0.5rem;
  }

  .prompt-term {
    display: flex;
    gap:1em;
    color: var(--cds-text-01);
    border-bottom: 1px solid var(--cds-border-subtle);
  }
  .prompt-term:has(+ .prompt-answer.large) {
    border-bottom: none;
  }

  .prompt-answer {
    color: var(--cds-text-02);
    border-bottom: 1px solid var(--cds-border-subtle);
  }
  .prompt-answer.large {
    grid-column: span 2;
  }

  .correction-notice {
    grid-column: span 2;
    margin-bottom: 0.5rem;
  }

  .correction-notice :global(.bx--inline-notification) {
    max-width: 100%;
  }

  .prompt-answer :global(.edit-button) {
    float: right;
    margin-top: -0.5rem;
    --cds-icon-01: var(--cds-link-01);
  }
</style>
