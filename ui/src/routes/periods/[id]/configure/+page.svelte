<script lang="ts">
  import { Panel, PanelFormDialog, Card, ColumnList, ActionSet, TagSet } from '@txstate-mws/carbon-svelte'
  import { Accordion, AccordionItem, Button, InlineNotification, NotificationActionButton, Tab, TabContent, Tabs, Tag } from 'carbon-components-svelte'
  import SettingsEdit from 'carbon-icons-svelte/lib/SettingsEdit.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { invalidate } from '$app/navigation'
  import { page } from '$app/stores'
  import { api, type Period } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../local'
  import { Modal } from 'carbon-components-svelte'

  export let data: PageData
  $: ({ programs, period } = data)

  $: sharedProgramRequirements = programs.reduce((acc, curr) => {
    curr.requirements.forEach(r => {
      if (!acc[r.key]) acc[r.key] = [curr.key]
      else acc[r.key].push(curr.key)
    })
    return acc
  }, {})

  // Modal State
  let sharedModal: { open: boolean, requirementKey: string | null } = { open: false, requirementKey: null }

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
  
  const disablePeriodProgram = (requirementKey: string) => async () => {
    const res = await api.disablePeriodProgramRequirements($page.params.id!, requirementKey, true)
    await invalidate('api:getPeriodConfigurations')
  }

  const enablePeriodProgram = (requirementKey: string) => async () => {
    const res = await api.disablePeriodProgramRequirements($page.params.id!, requirementKey, false)
    await invalidate('api:getPeriodConfigurations')
  }

  const openModal = (key: string) => () => {
    sharedModal = { open: true, requirementKey: key }
  }

  async function confirmReview () {
    const periodUpdate: any = { ...period }
    delete periodUpdate.id
    delete periodUpdate.programs
    await api.updatePeriod(period.id, { ...periodUpdate, reviewed: true }, false)
    await invalidate('api:getPeriodConfigurations')
  }

</script>

<!-- Configuring Pe{program.title}riod: {period.name}{#if period.code} ({period.code}){/if} -->

{#if !period.reviewed}
  <InlineNotification kind='warning' lowContrast title='Confirm Fall 2026 period configurations:' subtitle={`Please confirm when ${period.name} configuration updatess are complete`} >
    <svelte:fragment slot="actions">
      <NotificationActionButton on:click={confirmReview}>Confirm Review</NotificationActionButton>
    </svelte:fragment>
  </InlineNotification>
{/if}

{#each programs as program (program.key)}
  <Panel title={program.title} expandable expanded>
    <Tabs>
      <Tab label={`Enabled Programs`} />
      <Tab label={`Disabled Programs`} />
      <svelte:fragment slot='content'>
        <TabContent>
          {#each program.requirements.filter(r => r.enabled) as requirement (requirement.key)}
            {@const reqDef = uiRegistry.getRequirement(requirement.key)}
            <Panel title={requirement.title} expandable noPrimaryAction actions={[{ label: 'Configure requirement', onClick: onClick('requirement', requirement), disabled: reqDef.configureComponent == null || !requirement.configuration.actions.update }, { label: 'Disable Requirement', onClick: disablePeriodProgram(requirement.key) }]}>
              <div style="display: content" slot="headerLeft">
                <TagSet tags={[{ label: 'Requirement', type: 'yellow' }]} />
              </div>
              <!-- <Button on:click={onClick('requirement', requirement)} type="primary" size="small" icon={SettingsEdit} iconDescription="Edit Configuration" disabled={reqDef.configureComponent == null || !requirement.configuration.actions.update} />  -->
            <div style="display: content" slot="headerRight">
              {@const tags = sharedProgramRequirements[requirement.key]?.length > 1  ? [{ label: 'Shared', onClick: openModal(requirement.key) }] : []}
              <TagSet tags={tags} />
            </div>

             <ul class="prompts">
                {#each requirement.prompts as prompt (prompt.key)}
                {@const promptDef = uiRegistry.getPrompt(prompt.key)}
                <li class="prompt justify-between">
                  <span>
                    <Tag type='green'>Prompt</Tag>{prompt.title}
                  </span>
                  <ActionSet
                    actions={[
                      { label: 'View', icon: View },
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
            <Panel title={requirement.title} actions={[{ label: 'Enable Requirement', onClick: enablePeriodProgram(requirement.key) }]}>
              Requirement: {requirement.title}
              <ul class="prompts">
                {#each requirement.prompts as prompt (prompt.key)}
                  <li class="prompt">
                    Prompt: {prompt.title}
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

<Modal
  passiveModal
  bind:open={sharedModal.open}
  modalHeading="Shared Requirements"
  > 
    {@const sharedPrograms = sharedProgramRequirements[sharedModal.requirementKey!]?.map(key => {
      return programs.find(p => p.key === key)
    })}
    {#each sharedPrograms as p}
      <p>{p.title}</p>
      <hr/>
    {/each}
</Modal>

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
