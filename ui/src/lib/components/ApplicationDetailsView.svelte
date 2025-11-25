<script lang="ts">
  import type { UIRegistry } from '$lib/registry.js'
  import { getAppRequestStatusInfo } from '$lib/status-utils.js'
  import type { Scalars } from '$lib/typed-client/schema'
  import { enumRequirementType, type RequirementType } from '$lib/typed-client/index.js'
  import { Panel, TagSet } from '@txstate-mws/carbon-svelte'
  import { Tooltip } from 'carbon-components-svelte'
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
  export let showAppRequestStatus = true
  export let statusDisplay: 'tags' | 'icons' = 'tags'

  const applicantRequirementTypes: RequirementType[] = [enumRequirementType.PREQUAL, enumRequirementType.POSTQUAL, enumRequirementType.QUALIFICATION]
  const reviewerRequirementTypes: RequirementType[] = [enumRequirementType.APPROVAL, enumRequirementType.PREAPPROVAL]

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
        .filter(r => applicantRequirementTypes.includes(r.type))
        .flatMap(r => r.prompts)
      const reviewerPrompts = application.requirements
        .filter(r => reviewerRequirementTypes.includes(r.type))
        .flatMap(r => r.prompts)

      if (applicantPrompts.length || reviewerPrompts.length) {
        sections.push({
          title: application.title,
          prompts: applicantPrompts,
          subsections: reviewerPrompts.length ? [{ title: 'Reviewer Questions', prompts: reviewerPrompts }] : undefined
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
          <dl class="status-list-item [ flex items-center justify-between px-4 py-3 border-b ]">
            <dt class="status-list-label font-medium">Application Status</dt>
            <dd>
              <TagSet tags={[{ label: getAppRequestStatusInfo(appRequest.status).label, type: getAppRequestStatusInfo(appRequest.status).color }]} />
            </dd>
          </dl>
        {/if}

        <!-- Application Status List -->
        <ApplicantProgramList {applications} viewMode={statusDisplay === 'tags'} />
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
                  {prompt.title}
                </dt>
                <dd class="prompt-answer flow" class:large={def?.displayMode === 'large'}>
                  <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appData} prompt={prompt} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} />
                </dd>
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
                      {prompt.title}
                    </dt>
                    <dd class="prompt-answer flow" class:large={def?.displayMode === 'large'}>
                      <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appData} prompt={prompt} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} />
                    </dd>
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
</style>
