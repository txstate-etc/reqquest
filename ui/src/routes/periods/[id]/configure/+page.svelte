<script lang="ts">
  import { PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { InlineNotification, Modal, NotificationActionButton, Tab, TabContent, Tabs } from 'carbon-components-svelte'
  import { keyby } from 'txstate-utils'
  import { invalidate } from '$app/navigation'
  import { page } from '$app/stores'
  import { api } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../local'
  import PeriodPanel from '$lib/components/PeriodPanel.svelte'

  export let data: PageData
  $: ({ programs, period } = data)

  $: programsByKey = keyby(programs, 'key')
  $: sharedProgramRequirements = programs.reduce<Record<string, string[] | undefined>>((acc, curr) => {
    curr.requirements.forEach(r => {
      acc[r.key] ??= []
      acc[r.key]!.push(curr.key)
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
    const { success, messages } = await api.updateConfiguration($page.params.id, editingConfigurationDef!.key, data, false)
    return {
      success,
      messages,
      data
    }
  }

  async function onValidate (data: any) {
    const { messages } = await api.updateConfiguration($page.params.id, editingConfigurationDef!.key, data, true)
    return messages
  }

  async function onSaved () {
    await invalidate('api:getPeriodConfigurations')
    closeConfigurationDialog()
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

  $:enabledPrograms = programs.filter(p => p.enabled)
  $:disabledPrograms = programs.filter(p => !p.enabled)

</script>

<!-- Configuring Period: {period.name}{#if period.code} ({period.code}){/if} -->

{#if !period.reviewed}
  <InlineNotification kind='warning' lowContrast title='Confirm Fall 2026 period configurations:' subtitle={`Please confirm when ${period.name} configuration updates are complete`} >
    <svelte:fragment slot="actions">
      <NotificationActionButton on:click={confirmReview}>Confirm Review</NotificationActionButton>
    </svelte:fragment>
  </InlineNotification>
{/if}

<Tabs autoWidth>
  <Tab label={`Enabled Programs (${enabledPrograms.length})`} />
  <Tab label={`Disabled Programs (${disabledPrograms.length})`} />
  <svelte:fragment slot='content'>
    <TabContent>
      {#each enabledPrograms as program (program.key)}
        <PeriodPanel {program} {sharedProgramRequirements} {openModal} {onClick} />
      {/each}
    </TabContent>
    <TabContent>
      {#each disabledPrograms as program (program.key)}
        <PeriodPanel {program} {sharedProgramRequirements} {openModal} {onClick} />
      {/each}
    </TabContent>
  </svelte:fragment>
</Tabs>

{#if editingConfiguration && editingConfigurationDef != null}
  {#if editingConfigurationType === 'prompt'}
    {@const def = uiRegistry.getPrompt(editingConfigurationDef.key)}
    <PanelFormDialog open submit={onSubmit} validate={onValidate} title="Edit Configuration" on:cancel={closeConfigurationDialog} on:saved={onSaved} preload={editingConfigurationDef.configuration.data} let:data>
      <svelte:component this={def!.configureComponent} {data} />
    </PanelFormDialog>
  {:else}
    {@const def = uiRegistry.getRequirement(editingConfigurationDef.key)}
    <PanelFormDialog open submit={onSubmit} validate={onValidate} title="Edit Configuration" on:cancel={closeConfigurationDialog} on:saved={onSaved} preload={editingConfigurationDef.configuration.data} let:data>
      <svelte:component this={def!.configureComponent} {data} />
    </PanelFormDialog>
  {/if}
{/if}

<Modal
  passiveModal
  bind:open={sharedModal.open}
  modalHeading="Shared Requirements"
  >
    {@const sharedPrograms = sharedProgramRequirements[sharedModal.requirementKey!]?.map(key => programsByKey[key]) ?? []}
    {#each sharedPrograms as p (p.key)}
      <p>{p.title}</p>
      <hr/>
    {/each}
</Modal>
