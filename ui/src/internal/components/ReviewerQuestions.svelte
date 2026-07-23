<script lang="ts">
  import { Form } from '@txstate-mws/svelte-forms'
  import MachineLearning from 'carbon-icons-svelte/lib/MachineLearning.svelte'
  import WarningAltFilled from 'carbon-icons-svelte/lib/WarningAltFilled.svelte'
  import WarningFilled from 'carbon-icons-svelte/lib/WarningFilled.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import { isInlineReviewerEditPrompt, RenderDisplayComponent, applicantRequirementTypes, reviewerRequirementTypes, api } from '$internal'
  import { PromptIndicators } from '$lib'
  import { FormInlineNotification, GeneralTextSkeleton, Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { Tooltip } from 'carbon-components-svelte'
  import { uiRegistry } from '../../local';
  import { Button } from 'carbon-components-svelte'
  import type { PageData } from '../../routes/requests/[id]/approve/[programKey]/$types'
  import { invalidateAll } from '$app/navigation'
  import Review from "carbon-icons-svelte/lib/Review.svelte";
    import DelayedSkeleton from '$lib/components/DelayedSkeleton.svelte';

  export let sections: any[]
  export let promptIndicator: Record<string, any>
  export let loading = false
  export let appRequest: PageData['appRequest']
  export let application: PageData['appRequest']

  type PromptExtraData = Awaited<ReturnType<typeof api.getPromptData>>
  type Prompt = PageData['appRequest']['applications'][0]['requirements'][0]['prompts'][0]
  type PromptWithExtra = Prompt & PromptExtraData
  let editingPromptWithData: PromptWithExtra | undefined = undefined
  let promptBeingEdited: Prompt | undefined = undefined
  let showPromptDialog = false
  let fetchingEditPrompt = false
  function editPrompt (prompt: Prompt, allowSaveWithoutChanges: boolean = false) {
    return async () => {
      if (fetchingEditPrompt) return
      promptBeingEdited = prompt
      fetchingEditPrompt = true
      showPromptDialog = true
      try {
        const extra = await api.getPromptData(appRequest.id, prompt.id)
        editingPromptWithData = { ...prompt, ...extra, allowSaveWithoutChanges }
      } finally {
        fetchingEditPrompt = false
      }
    }
  }
  function hideEditModalPromptOnLoading() { // keep the dialog in the DOM so onSave fires, but remove from view
    if (!showPromptDialog) return
    const editModalDialog = document.querySelector('.tcbs-dialog')
    editModalDialog?.classList.add('invisible')   
  }

  function closePromptDialog () {
    fetchingEditPrompt = false
    showPromptDialog = false
    editingPromptWithData = undefined
    promptBeingEdited = undefined
  }

  function onPromptSubmit (prompt: any) {
    return async (data: any) => {   
      loading = true      
      hideEditModalPromptOnLoading()  
      const response = (!prompt.allowSaveWithoutChanges)
        ? await api.updatePrompt(prompt.id, data, false)
        : await api.updatePrompt(prompt.id, data, false, undefined, true) // triggers from review corrections edit selection, allow saving without changes to handle invalidate prompts that require no changes
      return response
    }
  }

  function onPromptValidate (prompt: any) {
    return async (data: any) => {
      const response = await api.updatePrompt(prompt.id, data, true)
      return response.messages
    }
  }

  async function onPromptSaved (data: any) {        
    await invalidateAll()     
    closePromptDialog ()
    loading = false
  }


</script>
{#each sections as section (section.title)}
  <Panel title={section.title} expandable expanded>
    {#if section.requirements.some(r => r.prompts.length > 0)}
      <dl class="prompts">
        {#each section.requirements as requirement (requirement.id)}
          {#each requirement.prompts.filter(p => !p.optOut) as prompt (prompt.id)}
            {@const def = uiRegistry.getPrompt(prompt.key)}
            {@const isReviewerQuestion = reviewerRequirementTypes.has(requirement.type) && !def?.automation}
            {@const isAutomation = !!def?.automation}
            {@const editMode = isInlineReviewerEditPrompt(def, requirement, prompt)}
            {@const small = editMode && def.formMode !== 'full' ? def.formMode !== 'large' : def!.displayMode !== 'large'}
            {@const large = editMode && def.formMode !== 'full' ? def.formMode === 'large' : def!.displayMode === 'large'}
            {@const dtid = `dt-title-${prompt.id}`}
            <dt class:small class:large class:isReviewerQuestion class:bg-tagyellow-200={isAutomation}>
            {#if promptIndicator[prompt.key]?.indicator}
                <div class="indicator-tooltip">
                <Tooltip align="start" direction="bottom">
                    <svelte:fragment slot="icon">
                    {#if promptIndicator[prompt.key]?.indicator === PromptIndicators.AUTOMATION}
                        <MachineLearning size={20} />
                    {:else if promptIndicator[prompt.key]?.indicator === PromptIndicators.WARNING}
                        <WarningAltFilled size={20} class="warning-icon" />
                    {:else if promptIndicator[prompt.key]?.indicator === PromptIndicators.DISQUALIFYING}
                        <WarningFilled size={20} class="disqualifying-icon" />
                    {/if}
                    </svelte:fragment>
                    {promptIndicator[prompt.key]?.reason}
                </Tooltip>
                </div>
            {/if}
            <div id={dtid}>
                {prompt.title}
            </div>
            </dt>
            <dd class="flow" class:small class:large class:isReviewerQuestion class:bg-tagyellow-200={isAutomation} role={editMode ? 'group' : undefined} aria-labelledby={dtid}>
            {#if editMode}
               <Form preload={prompt.preloadData} submit={onPromptSubmit(prompt)} validate={onPromptValidate(prompt)} autoSave on:autosaved={onPromptSaved} let:data let:messages>
                  <svelte:component this={def.formComponent} {data} appRequestData={appRequest.data} prestageData={{latest: prompt.prestageData, current: appRequest.data[prompt.key]?.__prestage}} fetched={prompt.fetchedData} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData}  invalidated={prompt.invalidated} invalidatedReason={prompt.invalidatedReason}  />
                  {#each messages as message (message.message, message.type)}
                    <FormInlineNotification {message} />
                  {/each}
                </Form>
              {:else} 
                {#if prompt.actions.update}
                  {#if prompt.invalidated && !applicantRequirementTypes.has(requirement.type)}
                    <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appRequest.data} prompt={prompt} prestageData={{latest: prompt.prestageData, current: appRequest.data[prompt.key]?.__prestage}} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} showMoot showInlineReviewNotification={true} />
                    <Button kind="primary" size="field" class="prompt-edit mr-2" icon={Review} iconDescription="Review corrections" on:click={editPrompt(prompt, true)} />
                  {:else}
                    <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appRequest.data} prompt={prompt} prestageData={{latest: prompt.prestageData, current: appRequest.data[prompt.key]?.__prestage}} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} showMoot />
                    <Button kind="ghost" size="field" icon={Edit} iconDescription="Edit Prompt" class="prompt-edit" on:click={editPrompt(prompt)} />
                  {/if}     
                  {:else}
                    <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appRequest.data} prompt={prompt} prestageData={{latest: prompt.prestageData, current: appRequest.data[prompt.key]?.__prestage}} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} showMoot />
                {/if}
              {/if}
            </dd>
          {/each}
        {/each}
      </dl>
    {:else if section.requirements[0]?.workflowStage && section.requirements[0]?.workflowStage.key === application.workflowStage?.key}
      No questions need to be answered in this section. You may advance to the next step.
    {:else}
      No questions in this section.
    {/if}
  </Panel>
{/each}

{#if showPromptDialog && promptBeingEdited}
  <PanelFormDialog
    title={editingPromptWithData?.invalidated ? `Review correction "${editingPromptWithData?.title}"` : 'Edit Prompt'}
    bind:open={showPromptDialog}
    on:cancel={closePromptDialog}
    submit={onPromptSubmit(editingPromptWithData)}
    validate={onPromptValidate(editingPromptWithData)}
    on:saved={onPromptSaved}
    disableSaveUntilChanged={!editingPromptWithData?.allowSaveWithoutChanges} // allow saving without changes if prompt was previously invalidated ...accomodates reviewer saying no changes required on correction check
    centered
    size={uiRegistry.getPrompt(editingPromptWithData?.key)?.formMode === 'full' ? 'large' : undefined}
    preload={editingPromptWithData?.preloadData}
    let:data
  >
    {#if editingPromptWithData}
      {@const def = uiRegistry.getPrompt(editingPromptWithData.key)}
      <div class='font-medium text-center mt-2'>
        <p class="text-xl font-medium ">{editingPromptWithData.title}</p>
      </div>
      <svelte:component
        this={def!.formComponent}
        appRequestId={appRequest.id}
        {data}
        appRequestData={editingPromptWithData.data}
        prestageData={{
          latest: editingPromptWithData.prestageData,
          current: appRequest.data[editingPromptWithData.key]?.__prestage
        }}
        fetched={editingPromptWithData.fetchedData}
        configData={editingPromptWithData.configurationData}
        gatheredConfigData={editingPromptWithData.gatheredConfigData}
        invalidated={editingPromptWithData.invalidated}
        invalidatedReason={editingPromptWithData.invalidatedReason}
      />
    {:else if fetchingEditPrompt}
      {@const loader = uiRegistry.getPrompt(promptBeingEdited.key)?.loader}
      {#if loader}
        <DelayedSkeleton {loader} />
      {/if}
    {/if}
  </PanelFormDialog>
{/if}

<style>
  dl.prompts {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: stretch;
    gap: 0;
    margin: -16px;
  }
  .prompts dt, .prompts dd {
    position: relative;
    border-bottom: 1px solid var(--cds-border-subtle);
    padding: 1rem 15px;
  }
  .prompts dt.small {
    padding-right: 15px;
  }
  .prompts dt.large, .prompts dd.large {
    grid-column: span 2;
  }
  .prompts dt.isReviewerQuestion, .prompts dd.isReviewerQuestion {
    background-color: var(--cds-tag-background-cyan);
  }
  .prompts dt {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-left: 32px;
  }
  .prompts dd :global(.bx--btn.prompt-edit) {
    position: absolute;
    top: 0;
    right: 0;
  }
  .prompts dt .indicator-tooltip {
    display: inline-block;
    margin-left: -24px;
  }
  .prompts dt .indicator-tooltip :global(> div) {
    line-height: 0;
  }
  .prompts dt .indicator-tooltip :global(> div .bx--tooltip--shown) {
    line-height: 1.2;
  }
  .prompts dt :global(.warning-icon) {
    fill: var(--cds-inverse-support-03, #f1c21b);
  }
  .prompts dt :global(.disqualifying-icon) {
    fill: var(--cds-support-01, #da1e28);
  }
</style>
