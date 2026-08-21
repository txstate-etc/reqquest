<script lang="ts">
  import { Form } from '@txstate-mws/svelte-forms'
  import MachineLearning from 'carbon-icons-svelte/lib/MachineLearning.svelte'
  import WarningFilled from 'carbon-icons-svelte/lib/WarningFilled.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import { isInlineReviewerEditPrompt, InlinePromptStore, RenderDisplayComponent, applicantRequirementTypes, reviewerRequirementTypes, api } from '$internal'
  import { PromptIndicators } from '$lib'
  import { FormInlineNotification, GeneralTextSkeleton, Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { Tooltip } from 'carbon-components-svelte'
  import { uiRegistry } from '../../local';
  import { Button } from 'carbon-components-svelte'
  import type { PageData } from '../../routes/requests/[id]/approve/[programKey]/$types'
  import { invalidate } from '$app/navigation'
  import Review from "carbon-icons-svelte/lib/Review.svelte";
  import DelayedSkeleton from '$lib/components/DelayedSkeleton.svelte';
  import WarningIconYellow from './WarningIconYellow.svelte';
  import { randomid } from 'txstate-utils'

  export let sections: any[]
  export let promptIndicator: Record<string, any>
  export let loading = false
  export let appRequest: PageData['appRequest']
  export let application: PageData['appRequest']

  type PromptExtraData = Awaited<ReturnType<typeof api.getPromptData>>
  type Prompt = PageData['appRequest']['applications'][0]['requirements'][0]['prompts'][0]
  type PromptWithExtra = Prompt & PromptExtraData
  type InlinePrompt = Prompt & Partial<PromptExtraData>
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
  // Diff issue, but needed because a bare document.querySelector('.tcbs-dialog') grabs the first
  // dialog in document order, and the page keeps note form and the notes list permanently mounted.
  // so need to be specific
  const editDialogFormId = randomid()
  function editDialogElement () {
    return document.getElementById(editDialogFormId)?.closest('.tcbs-dialog') ?? undefined
  }
  function hideEditModalPrompt () { // keep the dialog in the DOM so on:saved fires, but remove from view
    if (!showPromptDialog) return
    editDialogElement()?.classList.add('invisible')
  }
  function showEditModalPrompt () {
    editDialogElement()?.classList.remove('invisible')
  }

  function closePromptDialog () {
    fetchingEditPrompt = false
    showPromptDialog = false
    editingPromptWithData = undefined
    promptBeingEdited = undefined
  }
  function onPromptSubmit (prompt: any, modal = false) {
    return async (data: any) => {
      if (modal) { loading = true; hideEditModalPrompt() }
      try {
        const response = (!prompt.allowSaveWithoutChanges)
          ? await api.updatePrompt(prompt.id, data, false)
          : await api.updatePrompt(prompt.id, data, false, undefined, true) // triggers from review corrections edit selection, allow saving without changes to handle invalidate prompts that require no changes
        if (modal && !response.success) { loading = false; showEditModalPrompt() }
        // prev resp.data was replacing the store's data with a wrongly-shaped object and
        // re-baselines beforeUserChanges to it. Reduce to this prompt's slice like ApplicantPromptPage.onSubmit
        return { ...response, data: response.data?.[prompt.key] }
      } catch (e) {
        if (modal) { loading = false; showEditModalPrompt() }
        throw e
      }
    }
  }

  function onPromptValidate (prompt: any) {
    return async (data: any) => {
      const response = await api.updatePrompt(prompt.id, data, true)
      return response.messages
    }
  }

  async function refreshReviewData () {
    // Scoped instead of invalidateAll()
    await Promise.all([invalidate('request:approve'), invalidate('request:id')])
  }

  /** inline autoSave forms: refresh statuses/indicators only, never touch the live form */
  async function onPromptAutoSaved () {
    await refreshReviewData()
  }

  /** modal edit form: close first, so the dialog is not left hidden for the whole refresh */
  async function onPromptSaved () {
    loading = false
    closePromptDialog()
    await refreshReviewData()
  }

  // One long-lived store per inline reviewer promptto prevent refresh landing mid-typing and reverting
  // whatever the reviewer just typed. Owning the store lets us preload once at first render, and
  // afterwards only for forms the reviewer has not touched.
  const promptStores = new Map<string, InlinePromptStore<any>>()

  function promptStore (prompt: InlinePrompt) {
    let store = promptStores.get(prompt.id)
    // a discarded store has been reset by unmount() and would render blank, so rebuild instead
    if (store == null || store.discarded) {
      store = new InlinePromptStore(onPromptSubmit(prompt), onPromptValidate(prompt))
      // must precede preload so setDirtyForm takes the autoSave branch and does not show on every field's validation errors on load
      store.autoSave = true
      if (prompt.preloadData != null) void store.preload(prompt.preloadData).catch(console.error)
      promptStores.set(prompt.id, store)
    }
    return store
  }

  // An untouched inline form may still need fresh server data, because one prompt's answer can
  // change another prompt's preloadData via PromptDefinition.preload.
  function syncPromptStores (..._: any[]) {
    const live = new Set<string>()
    for (const section of sections) {
      for (const requirement of section.requirements) {
        for (const prompt of requirement.prompts) {
          if (prompt.optOut) continue
          if (!isInlineReviewerEditPrompt(uiRegistry.getPrompt(prompt.key), requirement, prompt)) continue
          live.add(prompt.id)
          const store = promptStores.get(prompt.id)
          if (store != null && !store.touched && !store.discarded && prompt.preloadData != null) {
            void store.preload(prompt.preloadData).catch(console.error)
          }
        }
      }
    }
    for (const id of [...promptStores.keys()]) if (!live.has(id)) promptStores.delete(id)
  }
  $: syncPromptStores(sections)

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
            {#snippet editButtons()}
              {#if prompt.actions.update}
                {#if prompt.invalidated && !applicantRequirementTypes.has(requirement.type)}
                  <Button kind="primary" size="field" class="prompt-edit mr-2" icon={Review} iconDescription="Review corrections" id="edit-btn-{prompt.id}" aria-labelledby="edit-btn-{prompt.id} {dtid}" on:click={editPrompt(prompt, true)} />
                {:else}
                  <Button kind="ghost" size="field" icon={Edit} iconDescription="Edit" class="prompt-edit" id="edit-btn-{prompt.id}" aria-labelledby="edit-btn-{prompt.id} {dtid}" on:click={editPrompt(prompt)} />
                {/if}
              {/if}
            {/snippet}
            <dt class:small class:large class:isReviewerQuestion class:bg-tagyellow-200={isAutomation}>
            {#if promptIndicator[prompt.key]?.indicator}
                <div class="indicator-tooltip">
                <Tooltip align="start" direction="bottom">
                    <svelte:fragment slot="icon">
                    {#if promptIndicator[prompt.key]?.indicator === PromptIndicators.AUTOMATION}
                        <MachineLearning size={20} />
                    {:else if promptIndicator[prompt.key]?.indicator === PromptIndicators.WARNING}
                        <WarningIconYellow />
                    {:else if promptIndicator[prompt.key]?.indicator === PromptIndicators.DISQUALIFYING}
                        <WarningFilled size={20} class="disqualifying-icon" style="fill: var(--cds-support-01, #da1e28)" />
                    {/if}
                    </svelte:fragment>
                    {promptIndicator[prompt.key]?.reason}
                </Tooltip>
                </div>
            {/if}
            <div id={dtid}>
                {prompt.title}
            </div>
            {#if large && !editMode}
              {@render editButtons()}
            {/if}
            </dt>
            <dd class="flow" class:small class:large class:isReviewerQuestion class:bg-tagyellow-200={isAutomation} role={editMode ? 'group' : undefined} aria-labelledby={dtid}>
              {#if editMode}
                <Form store={promptStore(prompt)} submit={onPromptSubmit(prompt)} validate={onPromptValidate(prompt)} autoSave on:autosaved={onPromptAutoSaved} let:data let:messages>
                    <svelte:component this={def.formComponent} {data} appRequestData={appRequest.data} prestageData={{latest: prompt.prestageData, current: appRequest.data[prompt.key]?.__prestage}} fetched={prompt.fetchedData} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData}  invalidated={prompt.invalidated} invalidatedReason={prompt.invalidatedReason}  />
                    {#each messages as message (message.message, message.type)}
                      <FormInlineNotification {message} />
                    {/each}
                  </Form>
              {:else}
                <div class="pr-4">
                  {#if prompt.actions.update && prompt.invalidated && !applicantRequirementTypes.has(requirement.type)}
                    <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appRequest.data} prompt={prompt} prestageData={{latest: prompt.prestageData, current: appRequest.data[prompt.key]?.__prestage}} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} showMoot showInlineReviewNotification={true} />
                  {:else}
                    <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appRequest.data} prompt={prompt} prestageData={{latest: prompt.prestageData, current: appRequest.data[prompt.key]?.__prestage}} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} showMoot />
                  {/if}
                </div>
                {#if !large}
                  {@render editButtons()}
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
{@const formMode = uiRegistry.getPrompt(promptBeingEdited.key)?.formMode === 'full' ? 'large' : undefined}
  <PanelFormDialog
    id={editDialogFormId}
    title={editingPromptWithData?.invalidated ? `Review correction "${editingPromptWithData?.title}"` : 'Edit Prompt'}
    bind:open={showPromptDialog}
    on:cancel={closePromptDialog}
    submit={onPromptSubmit(editingPromptWithData, true)}
    validate={onPromptValidate(editingPromptWithData)}
    on:saved={onPromptSaved}
    disableSaveUntilChanged={!editingPromptWithData?.allowSaveWithoutChanges} // allow saving without changes if prompt was previously invalidated ...accomodates reviewer saying no changes required on correction check
    centered={!formMode}
    size={formMode}
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
      <div class='font-medium text-center mt-2'>
        <p class="text-xl font-medium ">{promptBeingEdited.title}</p>
      </div>
      {#if loader}
        <DelayedSkeleton {loader} />
      {/if}
    {/if}
  </PanelFormDialog>
{/if}

<style>
  dl.prompts {
    display: grid;
    grid-template-columns: fit-content(50%) minmax(0, 1fr);
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
  /* When a display component's root is a PromptDisplayGrid — directly, or through the
     <form> of an inline edit (formMode 'large') — hand it our column tracks via subgrid
     so its challenge/response rows align with the real prompt rows. */
  .prompts dd.large:has(> :global(.prompt-display-grid)),
  .prompts dd.large:has(> :global(form > .prompt-display-grid)) {
    display: grid;
    grid-template-columns: subgrid;
    align-content: start;
    padding: 0;
    border-bottom: none;
    --prompt-display-subgrid: subgrid;
    --prompt-display-row-padding: 1rem 15px;
    --prompt-display-challenge-padding-left: 32px;
  }
  .prompts dd.large:has(> :global(.prompt-display-grid)) > :global(*),
  .prompts dd.large:has(> :global(form > .prompt-display-grid)) > :global(*) {
    grid-column: 1 / -1;
  }
  .prompts dd.large > :global(form:has(> .prompt-display-grid)) {
    display: grid;
    grid-template-columns: subgrid;
  }
  .prompts dd.large > :global(form:has(> .prompt-display-grid) > *) {
    grid-column: 1 / -1;
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
  .prompts dt :global(.bx--btn.prompt-edit),
  .prompts dd :global(.bx--btn.prompt-edit) {
    position: absolute;
    top: 0.35rem;
    right: 0;
    margin: 0;
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
  :global(.disqualifying-icon) {
    fill: var(--cds-support-01, #da1e28);
  }
</style>
