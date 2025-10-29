<script lang="ts">
  import type { UIRegistry } from '$lib/registry.js'
  import { getAppRequestStatusInfo, getApplicationStatusInfo } from '$lib/status-utils.js'
  import type { Scalars } from '$lib/typed-client/schema'
  import { Panel, TagSet } from '@txstate-mws/carbon-svelte'
  import { Tooltip } from 'carbon-components-svelte'
  import { WarningAltFilled, Close, CheckmarkFilled } from 'carbon-icons-svelte'
  import { isEmpty } from 'txstate-utils'
  import type { AnsweredPrompt, PromptSection, AppRequestForDetails } from './types'
  import RenderDisplayComponent from './RenderDisplayComponent.svelte'

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
  export let relatedConfigDataLookup: Record<string, any> | undefined = undefined

  /* Normalize a prompt by ensuring it has relatedConfigData. */
  function normalizePrompt (prompt: AnsweredPrompt): AnsweredPrompt {
    if (!isEmpty(prompt.relatedConfigData)) {
      return prompt
    }
    return {
      ...prompt,
      relatedConfigData: relatedConfigDataLookup?.[prompt.key] ?? {}
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
        r.prompts.map(p => normalizePrompt({
          ...p,
          requirementStatus: r.status,
          requirementStatusReason: r.statusReason
        }))
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
        {#if appRequest.applications.length > 0}
          <div class="status-list border">
            {#if !showAppRequestStatus}
              <dl class="status-list-header [ flex items-center justify-between px-4 py-3 border-b border-black border-solid font-semibold ]">
                <dt>Program</dt>
                <dd>Eligibility</dd>
              </dl>
            {/if}
            {#each appRequest.applications as application (application.title)}
              <dl class="status-list-item flex items-center justify-between px-4 py-3 border-b ">
                <dt class="status-list-label font-medium">{application.title}</dt>
                <dd>
                  {#if statusDisplay === 'icons'}
                    {@const app = application as typeof application & { statusReason?: string | null }}
                    <div class="status-icon">
                      {#if application.status === 'INELIGIBLE'}
                        <Close size={24} />
                        <Tooltip>
                          <p>{app.statusReason ?? 'Not eligible'}</p>
                        </Tooltip>
                      {:else if application.status === 'ELIGIBLE'}
                        <CheckmarkFilled size={24} class="status-icon-complete" />
                        <Tooltip>
                          <p>{app.statusReason ?? 'Eligible'}</p>
                        </Tooltip>
                      {:else}
                        <span class="icon-warning"><WarningAltFilled size={24} class="text-grey-900" /></span>
                        <Tooltip>
                          <p>{app.statusReason ?? 'Pending'}</p>
                        </Tooltip>
                      {/if}
                    </div>
                  {:else}
                    {@const appStatusTag = getApplicationStatusInfo(application.status)}
                    <TagSet tags={[{ label: appStatusTag.label, type: appStatusTag.color }]} />
                  {/if}
                </dd>
              </dl>
            {/each}
          </div>
        {/if}
      </div>
    </section>

    <!-- Prompt Sections -->
    {#if loading}
      <Panel title="Loading...">
        <p>Loading prompt data...</p>
      </Panel>
    {:else if sections.length > 0}
      {#each sections as section (section.title)}
        <Panel title="{section.title}" {expandable} expanded>
          {#if section.prompts.length}
            {#each section.prompts as prompt (prompt.id)}
              {@const def = uiRegistry.getPrompt(prompt.key)}
              <dl class="prompt-list py-4" >
                <dt class="prompt-term font-medium">
                  {#if showWarningsInline && (prompt.requirementStatus === 'WARNING' || prompt.requirementStatus === 'DISQUALIFYING')}
                  <div class="inline-icon flex">
                    {#if prompt.requirementStatus === 'WARNING'}
                      <Tooltip>
                        <div class="icon" slot="icon">
                          <WarningAltFilled size={16} class="text-grey-900 fill-yellow-300 " />
                        </div>
                        <p>{prompt.requirementStatusReason ?? 'Warning'}</p>
                      </Tooltip>
                    {:else if prompt.requirementStatus === 'DISQUALIFYING'}
                      <Tooltip>
                        <div class="icon" slot="icon">
                          <WarningAltFilled size={16} class="text-grey-900" />
                        </div>
                        <p>{prompt.requirementStatusReason ?? 'Disqualifying'}</p>
                      </Tooltip>
                    {/if}
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

  .status-list {
    border-color: var(--cds-border-subtle);
  }

  .status-list-item {
    border-color: var(--cds-border-subtle);
  }

  .status-list-header {
    border-color: var(--cds-border-subtle);
    color: var(--cds-text-01);
  }

  .status-list-label {
    color: var(--cds-text-01);
  }

  .prompt-list {
    border-bottom:1px solid var(--cds-border-subtle);
  }

  .prompt-list:last-child {
    /* border-bottom: none; */
  }

  .prompt-term {
    display: flex;
    gap:1em;
    color: var(--cds-text-01);
  }

  .prompt-answer {
    color: var(--cds-text-02);
  }

  .status-icon {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-icon :global(.status-icon-complete) {
    fill: var(--cds-support-04);
  }

  /* .inline-icon :global(.bx--tooltip__trigger:focus svg) {
    fill: yellow;
  } */
  .inline-icon :global(.bx--tooltip__trigger svg),
  .icon-warning :global(svg) {
    fill: var(--cds-support-03, rgba(239, 200, 108, 1));
  }

  .inline-icon :global([data-icon-path="inner-path"]),
  .icon-warning :global([data-icon-path="inner-path"]) {
    fill: black;
  }

  .status-icon :global(.bx--tooltip__label) {
    padding-top:0.5em;
  }
</style>
