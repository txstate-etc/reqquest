<script lang="ts">
  import { Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { Edit } from 'carbon-icons-svelte'
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
  $: console.log('appRequest', appRequest)

  type Prompt = PageData['appRequest']['applications'][0]['requirements'][0]['prompts'][0]

  let promptBeingEdited: Prompt | undefined = undefined
  let showPromptDialog = false
  function editPrompt (prompt: Prompt) {
    promptBeingEdited = prompt
    showPromptDialog = true
  }

  function closePromptDialog () {
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
              onClick: () => {
                editPrompt(prompt)
              }
            }
          ]}>
            <svelte:component this={def.displayComponent} data={appRequest.data[prompt.key]}/>
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
    <svelte:component this={def.formComponent} {data} fetched={{ TODO: 'TODO' }} />
  </PanelFormDialog>
{/if}
