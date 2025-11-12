<script lang="ts">
  import type { UIRegistry } from '$lib/registry.js'
  import { getAppRequestStatusInfo } from '$lib/status-utils.js'
  import type { Scalars } from '$lib/typed-client/schema'
  import { Panel, TagSet } from '@txstate-mws/carbon-svelte'
  import { Tooltip } from 'carbon-components-svelte'
  import WarningAltFilled from 'carbon-icons-svelte/lib/WarningAltFilled.svelte'
  import type { AnsweredPrompt, PromptSection, AppRequestForDetails } from './types'
  import RenderDisplayComponent from './RenderDisplayComponent.svelte'
  import ApplicantProgramList from './ApplicantProgramList.svelte'

  // TODO: design alignement could reduce props here
  export let appRequest: AppRequestForDetails | undefined = undefined
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

  /* Normalize a prompt by ensuring it has relatedConfigData. */
  function normalizePrompt (prompt: AnsweredPrompt): AnsweredPrompt {
    return {
      ...prompt,
      relatedConfigData: prompt.relatedConfigData ?? {}
    }
  }

  // Group prompts by sections
  $: sections = (() => {
    if (!appRequest) return []

    const sections: PromptSection[] = []

    // General Questions === PREQUAL prompts
    if (prequalPrompts?.length) {
      sections.push({
        title: 'General Questions',
        prompts: prequalPrompts.map(normalizePrompt)
      })
    }

    // Application-Specific Questions
    for (const application of appRequest.applications) {
      const prompts = application.requirements.flatMap(r =>
        r.prompts.map(normalizePrompt)
      )
      if (prompts.length) {
        sections.push({
          title: application.title,
          prompts
        })
      }
    }

    // Additional Questions === POSTQUAL prompts
    if (postqualPrompts?.length) {
      sections.push({
        title: 'Additional Questions',
        prompts: postqualPrompts.map(normalizePrompt)
      })
    }

    return sections
  })()
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
        <ApplicantProgramList {appRequest} viewMode={statusDisplay === 'tags'} />
      </div>
    </section>

    <!-- Prompt Sections -->
    {#if loading}
      <Panel title="Loading...">
        <p>Loading prompt data...</p>
      </Panel>
    {:else if sections.length > 0}
      {#each sections as section, sectionIndex (section.title)}
        <Panel title="{section.title}" {expandable} expanded>
          {#if section.prompts.length}
            {#each section.prompts as prompt (prompt.id)}
              {@const def = uiRegistry.getPrompt(prompt.key)}
              <dl class="prompt-list py-4" >
                <dt class="prompt-term font-medium">
                  {#if showWarningsInline && (prompt.requirements.some(r => r.status === 'WARNING' || r.status === 'DISQUALIFYING'))}
                  <div class="inline-icon flex">
                    <Tooltip align="start">
                      <div class="icon" slot="icon">
                        <WarningAltFilled size={16} />
                      </div>
                      {#each prompt.requirements.filter(r => r.status === 'WARNING' || r.status === 'DISQUALIFYING') as r, i (i)}
                        {#if sectionIndex === 0}<p>{r.status === 'WARNING' ? 'Warning' : 'Disqualifying'} for {r.programName}</p>{/if}
                        <p>{r.statusReason ?? r.status}</p>
                      {/each}
                    </Tooltip>
                  </div>
                  {/if}
                  {prompt.title}
                </dt>
                <dd class="prompt-answer" class:large={def?.displayMode === 'large'}>
                  <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appData} prompt={prompt} relatedConfigData={prompt.relatedConfigData ?? {}} />
                </dd>
              </dl>
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
  dl:not(:has(dl)) {
    display:grid;
    grid-template-columns: 1fr 1fr;
    row-gap:0.5rem;
  }

  .prompt-answer :global(dl) {
    padding-block-start:1em;
    display:grid;
    grid-template-columns: 1fr 1fr;
    row-gap:0.5rem;
  }

  .prompt-answer.large {
    grid-template-columns: 1fr;
  }

  .status-list-item {
    border-color: var(--cds-border-subtle);
  }

  .status-list-label {
    color: var(--cds-text-01);
  }

  .prompt-list {
    border-bottom:1px solid var(--cds-border-subtle);
  }

  .prompt-term {
    display: flex;
    gap:1em;
    color: var(--cds-text-01);
  }

  .prompt-answer {
    color: var(--cds-text-02);
  }

  .inline-icon :global(.bx--tooltip__trigger svg) {
    fill: var(--cds-support-03, rgba(239, 200, 108, 1));
  }

  .inline-icon :global([data-icon-path="inner-path"]) {
    fill: black;
  }
</style>
