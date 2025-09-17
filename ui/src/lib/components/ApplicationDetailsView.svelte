<script lang="ts">
  import type { UIRegistry } from '$lib/registry.js'
  import { getAppRequestStatusInfo, getApplicationStatusInfo } from '$lib/status-utils.js'
  import type { Scalars, AppRequestStatus, ApplicationStatus } from '$lib/typed-client/schema'
  import { Panel, TagSet } from '@txstate-mws/carbon-svelte'
  import type { AnsweredPrompt, PromptSection } from './types'

  // Local interface for what this component actually needs
  interface AppRequestForDetails {
    id: string
    status: AppRequestStatus
    period: { name: string }
    applications: {
      title: string
      status: ApplicationStatus
    }[]
    createdAt?: string
    updatedAt?: string
    actions?: any
  }

  export let appRequest: AppRequestForDetails | undefined = undefined
  export let appData: Scalars['JsonData'] = {}
  export let prequalPrompts: AnsweredPrompt[] | undefined = undefined
  export let postqualPrompts: AnsweredPrompt[] | undefined = undefined
  export let loading = false
  export let uiRegistry: UIRegistry

  // Group prompts by sections, showing only answered prompts
  $: sections = (() => {
    if (!appRequest) return []

    const sections: PromptSection[] = []

    // General Questions === PREQUAL prompts
    if (prequalPrompts && prequalPrompts.length > 0) {
      const answeredPrequal = prequalPrompts.filter(p => p.answered)
      if (answeredPrequal.length > 0) {
        sections.push({
          title: 'General Questions',
          prompts: answeredPrequal
        })
      }
    }

    // Additional Questions === POSTQUAL prompts
    if (postqualPrompts && postqualPrompts.length > 0) {
      const answeredPostqual = postqualPrompts.filter(p => p.answered)
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

{#if appRequest}
  <div class="application-details flow">
    <!-- Application Status Panel -->
    <div class="app-view-intro text-center">
      <h2 class="text-xl mb-3">View your {appRequest.period.name} application</h2>
      <p class="app-view-subtitle mb-3">Select document names to preview them.</p>
    </div>
    <section>
      <div class="status-content">
        <dl class="status-list-item flex items-center justify-between px-4 py-3 border-b ">
          <dt class="status-list-label font-medium">Application Status</dt>
          <dd>
            <TagSet tags={[{ label: getAppRequestStatusInfo(appRequest.status).label, type: getAppRequestStatusInfo(appRequest.status).color }]} />
          </dd>
        </dl>

        <!-- Application Status List -->
        {#if appRequest.applications.length > 0}
          <div class="status-list border rounded">
            {#each appRequest.applications as application}
              {@const appStatusTag = getApplicationStatusInfo(application.status)}
              <dl class="status-list-item flex items-center justify-between px-4 py-3 border-b ">
                <dt class="status-list-label font-medium">{application.title}</dt>
                <dd>
                  <TagSet tags={[{ label: appStatusTag.label, type: appStatusTag.color }]} />
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
      {#each sections as section}
        <Panel title="{section.title}" expandable expanded>
          {#if section.prompts.length}
            {#each section.prompts as prompt}
              {@const def = uiRegistry.getPrompt(prompt.key)}
              <dl class="prompt-list mb-4 last:mb-0 p-3 border-b-2 border-solid">
                <dt class="prompt-term font-semibold mb-2">{prompt.title}</dt>
                <dd class="prompt-answer">
                  {#if appData[prompt.key] && def.displayComponent}
                    <svelte:component this={def.displayComponent} data={appData[prompt.key]} />
                  {:else if appData[prompt.key]}
                    <em>Answered (display component not found)</em>
                  {:else}
                    <em>Answered (no data available)</em>
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
    grid-template-columns: 2fr 1fr;
    row-gap:0.5rem;
  }

  .prompt-answer :global(dl) {
    display:grid;
    grid-template-columns: 2fr 1fr;
    row-gap:0.5rem;
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
