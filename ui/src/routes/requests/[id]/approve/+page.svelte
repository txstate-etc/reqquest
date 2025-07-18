<script lang="ts">
  import { Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import { invalidate } from '$app/navigation'
  import { api } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../local'

  /**
   * This page is the primary reviewer screen, it will show all the prompt
   * data so far collected and allow the reviewer to navigate to (modal popup?)
   * any available prompts to fill in more data.
   */
  export let data: PageData
  $: ({ appRequest } = data)

  type PromptExtraData = Awaited<ReturnType<typeof api.getPromptData>>
  type Prompt = PageData['appRequest']['applications'][0]['requirements'][0]['prompts'][0]
  type PromptWithExtra = Prompt & PromptExtraData
  let promptBeingEdited: PromptWithExtra | undefined = undefined
  let showPromptDialog = false
  let fetchingEditPrompt = false
  async function editPrompt (prompt: Prompt) {
    if (fetchingEditPrompt) return
    fetchingEditPrompt = true
    try {
      const extra = await api.getPromptData(appRequest.id, prompt.id)
      promptBeingEdited = { ...prompt, ...extra }
      showPromptDialog = true
    } finally {
      fetchingEditPrompt = false
    }
  }

  function closePromptDialog () {
    fetchingEditPrompt = false
    showPromptDialog = false
    promptBeingEdited = undefined
  }

  async function onPromptSubmit (data: any) {
    const response = await api.updatePrompt(promptBeingEdited!.id, data, false)
    return response
  }

  async function onPromptValidate (data: any) {
    const response = await api.updatePrompt(promptBeingEdited!.id, data, true)
    return response.messages
  }

  async function onPromptSaved (data: any) {
    await invalidate('request:approve')
    closePromptDialog()
  }
</script>

{#each appRequest.applications as application (application.id)}
  <Panel title="Program: {application.title}" expandable expanded>
    {#each application.requirements as requirement (requirement.id)}
      <Panel title="Requirement: {requirement.title} ({requirement.status})" expandable expanded>
        {#each requirement.prompts as prompt (prompt.id)}
          {@const def = uiRegistry.getPrompt(prompt.key)}
          <Panel title="{prompt.title} {prompt.answered ? '' : '(NEEDS ATTENTION)'}" expandable maxButtons={2} actions={[
            {
              label: 'Edit',
              icon: Edit,
              disabled: !prompt.actions.update,
              onClick: async () => {
                await editPrompt(prompt)
              }
            }
          ]}>
            {#if prompt.answered}
              <svelte:component this={def.displayComponent} data={appRequest.data[prompt.key] ?? {}}/>
            {:else}
              Incomplete Answer
            {/if}
          </Panel>
        {/each}
      </Panel>
    {/each}
  </Panel>
{/each}

{#if showPromptDialog && promptBeingEdited}
  <PanelFormDialog
    title="Edit Prompt"
    bind:open={showPromptDialog}
    on:cancel={closePromptDialog}
    submit={onPromptSubmit}
    validate={onPromptValidate}
    on:saved={onPromptSaved}
    centered
    preload={appRequest.data[promptBeingEdited.key]}
    let:data
  >
    {@const def = uiRegistry.getPrompt(promptBeingEdited.key)}
    <svelte:component this={def.formComponent} {data} appRequestData={promptBeingEdited.data} fetched={promptBeingEdited.fetchedData} configData={promptBeingEdited.configurationRelatedData} />
  </PanelFormDialog>
{/if}
