<script lang="ts">
  import { Panel, PanelFormDialog, Card, ColumnList, ActionSet } from '@txstate-mws/carbon-svelte'
  import { Accordion, AccordionItem, Button, Tab, TabContent, Tabs, Tag } from 'carbon-components-svelte'
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

<!-- Configuring Pe{program.title}riod: {period.name}{#if period.code} ({period.code}){/if} -->

{#each programs as program (program.key)}
  <Panel title={program.title} expandable expanded>
    <Tabs>
      <Tab label={`Enabled Programs`} />
      <Tab label={`Disabled Programs`} />
      <svelte:fragment slot='content'>
        <TabContent>
          {#each program.requirements.filter(r => r.enabled) as requirement (requirement.key)}
            <Panel title={requirement.title} expandable noPrimaryAction actions={[{ label: 'Edit requirement', href: '/' }, { label: 'Disable Requirement', href: '/' }]} >
              {@const reqDef = uiRegistry.getRequirement(requirement.key)}
              <ul class="prompts">
                {#each requirement.prompts as prompt (prompt.key)}
                {@const promptDef = uiRegistry.getPrompt(prompt.key)}
                <li class="prompt justify-between">
                  <span>
                    <Tag type='green'>Prompt</Tag>{prompt.title}
                  </span>
                  <ActionSet
                    actions={[
                      { label: 'settings', icon: SettingsEdit, disabled: promptDef.configureComponent == null || !prompt.configuration.actions.update, onClick: onClick('prompt', prompt) }
                    ]}
                  />
                </li>
                {/each}
              </ul>
            </Panel>
          {/each}
        </TabContent>
        <TabContent>
          {#each program.requirements.filter(r => !r.enabled) as requirement (requirement.key)}
            <Panel title={requirement.title}>
              {@const reqDef = uiRegistry.getRequirement(requirement.key)}
              Requirement: {requirement.title}
              <Button on:click={onClick('requirement', requirement)} type="primary" size="small" icon={SettingsEdit} iconDescription="Edit Configuration" disabled={reqDef.configureComponent == null || !requirement.configuration.actions.update} />
              <ul class="prompts">
                {#each requirement.prompts as prompt (prompt.key)}
                {@const promptDef = uiRegistry.getPrompt(prompt.key)}
                <li class="prompt">
                  Prompt: {prompt.title}
                  <Button on:click={onClick('prompt', prompt)} type="primary" size="small" icon={SettingsEdit} iconDescription="Edit Configuration" disabled={promptDef.configureComponent == null || !prompt.configuration.actions.update} />
                </li>
                {/each}
              </ul>
            </Panel>
          {/each}
        </TabContent>
      </svelte:fragment>
    </Tabs>
  </Panel>
{/each}

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
