<script lang="ts">
  import { PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { Button } from 'carbon-components-svelte'
  import SettingsEdit from 'carbon-icons-svelte/lib/SettingsEdit.svelte'
  import { invalidate } from '$app/navigation'
  import { page } from '$app/stores'
  import { api } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../local'

  export let data: PageData
  $: ({ programs, period } = data)

  type Requirement = PageData['programs'][number]['requirements'][number]
  type Prompt = PageData['programs'][number]['requirements'][number]['prompts'][number]

  let editingConfiguration = false
  let editingConfigurationType: 'prompt' | 'requirement' | undefined = undefined
  let editingConfigurationDef: Requirement | Prompt | undefined

  function closeConfigurationDialog () {
    editingConfiguration = false
    editingConfigurationType = undefined
    editingConfigurationDef = undefined
  }

  function onClick (type: 'prompt' | 'requirement', def: Requirement | Prompt) {
    return () => {
      editingConfiguration = true
      editingConfigurationType = type
      editingConfigurationDef = def
    }
  }

  async function onSubmit (data: any) {
    const { success, messages } = await api.updateConfiguration($page.params.id!, editingConfigurationDef!.key, data, false)
    return {
      success,
      messages,
      data
    }
  }

  async function onValidate (data: any) {
    const { messages } = await api.updateConfiguration($page.params.id!, editingConfigurationDef!.key, data, true)
    return messages
  }

  async function onSaved () {
    await invalidate('api:getPeriodConfigurations')
    closeConfigurationDialog()
  }
</script>

Configuring Period: {period.name}{#if period.code} ({period.code}){/if}

<ul class="programs">
  {#each programs as program (program.key)}
    <li class="program">Program: {program.title}</li>
    <ul class="requirements">
      {#each program.requirements as requirement (requirement.key)}
        {@const reqDef = uiRegistry.getRequirement(requirement.key)}
        <li class="requirement">
          Requirement: {requirement.title}
          <Button on:click={onClick('requirement', requirement)} type="primary" size="small" icon={SettingsEdit} iconDescription="Edit Configuration" disabled={reqDef.configureComponent == null || !requirement.configuration.actions.update} />
        </li>
        <ul class="prompts">
          {#each requirement.prompts as prompt (prompt.key)}
            {@const promptDef = uiRegistry.getPrompt(prompt.key)}
            <li class="prompt">
              Prompt: {prompt.title}
              <Button on:click={onClick('prompt', prompt)} type="primary" size="small" icon={SettingsEdit} iconDescription="Edit Configuration" disabled={promptDef.configureComponent == null || !prompt.configuration.actions.update} />
            </li>
          {/each}
        </ul>
      {/each}
    </ul>
  {/each}
</ul>

{#if editingConfiguration && editingConfigurationDef != null}
  {#if editingConfigurationType === 'prompt'}
    {@const def = uiRegistry.getPrompt(editingConfigurationDef.key)}
    <PanelFormDialog open submit={onSubmit} validate={onValidate} title="Edit Configuration" on:cancel={closeConfigurationDialog} on:saved={onSaved} preload={editingConfigurationDef.configuration.data} let:data>
      <svelte:component this={def.configureComponent} {data} />
    </PanelFormDialog>
  {:else}
    {@const def = uiRegistry.getRequirement(editingConfigurationDef.key)}
    <PanelFormDialog open submit={onSubmit} validate={onValidate} title="Edit Configuration" on:cancel={closeConfigurationDialog} on:saved={onSaved} preload={editingConfigurationDef.configuration.data} let:data>
      <svelte:component this={def.configureComponent} {data} />
    </PanelFormDialog>
  {/if}
{/if}

<style>
  ul {
    list-style: inside;
  }
  ul ul {
    padding-left: 1.5rem;
  }
  li {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.3rem 0;
  }
</style>
