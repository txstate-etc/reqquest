<script lang="ts">
  import type { UIRegistry } from '$lib/registry.js'
  import type { ApplicationDetailsData, SelectedApplication, PromptSection } from './types.js'
  import { TagSet, Panel } from '@txstate-mws/carbon-svelte'
  import { getAppRequestStatusInfo, getApplicationStatusInfo } from '$lib/status-utils.js'

  // Props
  export let selectedApplication: SelectedApplication | undefined = undefined

  export let applicationDetails: ApplicationDetailsData | undefined = undefined

  export let loading = false
  export let uiRegistry: UIRegistry

  // Group prompts by sections, showing only answered prompts
  $: sections = (() => {
    if (!applicationDetails) return []

    const sections: PromptSection[] = []

    // General Questions === PREQUAL prompts
    if (applicationDetails.prequalPrompts && applicationDetails.prequalPrompts.length > 0) {
      const answeredPrequal = applicationDetails.prequalPrompts.filter(p => p.answered)
      if (answeredPrequal.length > 0) {
        sections.push({
          title: 'General Questions',
          prompts: answeredPrequal
        })
      }
    }

    // Program-specific sections

    applicationDetails.applications.forEach(app => {
      const allAppPrompts = app.requirements.flatMap(r => r.prompts)
      const answeredAppPrompts = allAppPrompts.filter(p => p.answered)
      if (answeredAppPrompts.length > 0) {
        sections.push({
          title: app.navTitle,
          prompts: answeredAppPrompts
        })
      }
    })

    // Additional Questions === POSTQUAL prompts
    if (applicationDetails.postqualPrompts && applicationDetails.postqualPrompts.length > 0) {
      const answeredPostqual = applicationDetails.postqualPrompts.filter(p => p.answered)
      if (answeredPostqual.length > 0) {
        sections.push({
          title: 'Additional Questions',
          prompts: answeredPostqual
        })
      }
    }

    return sections
  })()
</script>

{#if selectedApplication}
  <div class="application-details flow">
    <!-- Application Status Panel -->
    <Panel title="{selectedApplication.period.name} - Status">
      <div class="status-content">
        <p class="mb-4 status-text">Overall Status: <strong>{getAppRequestStatusInfo(selectedApplication.status).label}</strong></p>

        <!-- Application Status List -->
        {#if selectedApplication.applications && selectedApplication.applications.length > 0}
          <div class="status-list border rounded">
            {#each selectedApplication.applications as application}
              {@const appStatusTag = getApplicationStatusInfo(application.status)}
              <dl class="status-list-item flex items-center justify-between px-4 py-3 border-b last:border-b-0">
                <dt class="status-list-label font-medium">{application.title}</dt>
                <dd>
                  <TagSet tags={[{ label: appStatusTag.label, type: appStatusTag.color }]} />
                </dd>
              </dl>
            {/each}
          </div>
        {/if}
      </div>
    </Panel>

    <!-- Prompt Sections -->
    {#if loading}
      <Panel title="Loading...">
        <p>Loading prompt data...</p>
      </Panel>
    {:else if sections.length > 0}
      {#each sections as section}
        <Panel title="{section.title}" expandable expanded>
          {#if section.prompts.length}
            {#each section.prompts as prompt}
              {@const def = uiRegistry.getPrompt(prompt.key)}
              <dl class="prompt-list mb-4 last:mb-0 p-3 border-b-2 border-solid">
                <dt class="prompt-term font-semibold mb-2">{prompt.title}</dt>
                <dd class="prompt-answer">
                  {#if applicationDetails}
                    {#if applicationDetails.data[prompt.key] && def.displayComponent}
                      <svelte:component this={def.displayComponent} data={applicationDetails.data[prompt.key]} />
                    {:else if applicationDetails.data[prompt.key]}
                      <em>Answered (display component not found)</em>
                    {:else}
                      <em>Answered (no data available)</em>
                    {/if}
                  {/if}
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

  </div>
{:else}
  <p>No application selected</p>
{/if}

<style>
  dl:not(:has(dl)) {
    display:grid;
    grid-template-columns: 2fr 1fr;
    row-gap:0.5rem;
  }

  .prompt-answer :global(dl) {
    display:grid;
    grid-template-columns: 2fr 1fr;
    row-gap:0.5rem;
  }

  .status-text {
    color: var(--cds-text-02);
  }

  .status-list {
    border-color: var(--cds-border-subtle);
  }

  .status-list-item {
    border-color: var(--cds-border-subtle);
  }

  .status-list-label {
    color: var(--cds-text-01);
  }

  .prompt-list {
    border-color: var(--cds-border-subtle);
  }

  .prompt-term {
    color: var(--cds-text-01);
  }

  .prompt-answer {
    color: var(--cds-text-02);
  }
</style>
