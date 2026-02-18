<script lang="ts">
  import { Card, FormInlineNotification, Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import { Form } from '@txstate-mws/svelte-forms'
  import { Button, Select, SelectItem, Tooltip } from 'carbon-components-svelte'
  import DocumentExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import MachineLearning from 'carbon-icons-svelte/lib/MachineLearning.svelte'
  import WarningAltFilled from 'carbon-icons-svelte/lib/WarningAltFilled.svelte'
  import WarningFilled from 'carbon-icons-svelte/lib/WarningFilled.svelte'
  import { invalidateAll } from '$app/navigation'
  import { api, RenderDisplayComponent, applicantRequirementTypes, reviewerRequirementTypes, getApplicationStatusInfo } from '$internal'
  import { enumPromptVisibility, enumRequirementStatus, enumRequirementType } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../../local'
  import ApproveLayout from '../ApproveLayout.svelte'

  /**
   * This page is the primary reviewer screen, it will show all the prompt
   * data so far collected and allow the reviewer to navigate to (modal popup?)
   * any available prompts to fill in more data.
   */
  export let data: PageData
  $: ({ basicRequestData, appRequest, programKey } = data)
  $: application = appRequest.applications.find(a => a.programKey === programKey)!

  type ApplicationRequirement = (typeof appRequest)['applications'][number]['requirements'][number]
  const PromptIndicators = {
    AUTOMATION: 1,
    WARNING: 2,
    DISQUALIFYING: 3
  } as const

  // here we split the screen into sections based on the requirement type, but we
  // keep everything in order, so if a reviewer requirement appears between two
  // applicant requirements, it will be shown in the applicant section. We are assuming
  // that the developer put it in that order intentionally but we still want to try to break up
  // page as best we can.
  let generalReqs: ApplicationRequirement[]
  let applicantReqs: ApplicationRequirement[]
  let reviewerReqs: ApplicationRequirement[]
  let acceptanceReqs: ApplicationRequirement[]
  let blockingWorkflow: Record<string, { title: string, requirements: ApplicationRequirement[] }>
  let nonBlockingWorkflow: Record<string, { title: string, requirements: ApplicationRequirement[] }>
  // it's not enough to show an indicator for the prompt's requirement status; since we only show the prompt
  // once, we need to show the highest indicator for any requirement that uses this prompt. So if two requirements
  // share a prompt and one requirement is disqualifying while the other is just a warning, we need to show the
  // disqualifying indicator.
  let promptIndicator: Record<string, { indicator: typeof PromptIndicators[keyof typeof PromptIndicators], reason: string | undefined } | undefined>
  $: {
    generalReqs = []
    applicantReqs = []
    reviewerReqs = []
    acceptanceReqs = []
    blockingWorkflow = {}
    nonBlockingWorkflow = {}
    promptIndicator = {}
    for (const req of application.requirements) {
      for (const prompt of req.prompts) {
        if (prompt.visibility === enumPromptVisibility.UNREACHABLE) continue
        if (req.status === enumRequirementStatus.DISQUALIFYING && (promptIndicator[prompt.key]?.indicator ?? 0) < PromptIndicators.DISQUALIFYING) {
          promptIndicator[prompt.key] = { indicator: PromptIndicators.DISQUALIFYING, reason: req.statusReason ?? undefined }
        } else if (req.status === enumRequirementStatus.WARNING && (promptIndicator[prompt.key]?.indicator ?? 0) < PromptIndicators.WARNING) {
          promptIndicator[prompt.key] = { indicator: PromptIndicators.WARNING, reason: req.statusReason ?? undefined }
        } else if (uiRegistry.getPrompt(prompt.key)?.automation && (promptIndicator[prompt.key]?.indicator ?? 0) < PromptIndicators.AUTOMATION) {
          promptIndicator[prompt.key] = { indicator: PromptIndicators.AUTOMATION, reason: 'This answer will be filled in by an automation.' }
        }
      }
      if (req.type === enumRequirementType.ACCEPTANCE) acceptanceReqs.push(req)
      else if (req.workflowStage) {
        const target = req.workflowStage.blocking ? blockingWorkflow : nonBlockingWorkflow
        target[req.workflowStage.key] ??= { title: req.workflowStage.title, requirements: [] }
        target[req.workflowStage.key].requirements.push(req)
      } else if (req.type === enumRequirementType.APPROVAL || req.type === enumRequirementType.PREAPPROVAL) reviewerReqs.push(req)
      else if (req.type === enumRequirementType.QUALIFICATION || req.type === enumRequirementType.POSTQUAL) {
        if (applicantReqs.length === 0) {
          applicantReqs.push(req)
          generalReqs.push(...reviewerReqs)
          reviewerReqs = []
        } else {
          applicantReqs.push(...reviewerReqs, req)
          reviewerReqs = []
        }
      } else { // PREQUAL
        generalReqs.push(...reviewerReqs, req)
        reviewerReqs = []
      }
    }
  }
  $: blockingWorkflowStages = Object.entries(blockingWorkflow).map(([key, val]) => ({ key, ...val }))
  $: nonBlockingWorkflowStages = Object.entries(nonBlockingWorkflow).map(([key, val]) => ({ key, ...val }))
  $: sections = [
    { title: 'General Questions', requirements: generalReqs },
    { title: application.title, requirements: applicantReqs },
    { title: 'Reviewer Questions', requirements: reviewerReqs },
    { title: 'Acceptance', requirements: acceptanceReqs },
    ...blockingWorkflowStages,
    ...nonBlockingWorkflowStages
  ].filter(s => (!!s.requirements[0]?.workflowStage) || (s.requirements.length > 0 && s.requirements.some(r => r.prompts.length > 0)))
  $: applicationStatusInfo = getApplicationStatusInfo(application.status, appRequest.phase, appRequest.closedAt)

  type PromptExtraData = Awaited<ReturnType<typeof api.getPromptData>>
  type Prompt = PageData['appRequest']['applications'][0]['requirements'][0]['prompts'][0]
  type PromptWithExtra = Prompt & PromptExtraData
  let promptBeingEdited: PromptWithExtra | undefined = undefined
  let showPromptDialog = false
  let fetchingEditPrompt = false
  function editPrompt (prompt: Prompt) {
    return async () => {
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
  }

  function closePromptDialog () {
    fetchingEditPrompt = false
    showPromptDialog = false
    promptBeingEdited = undefined
  }

  function onPromptSubmit (id: string) {
    return async (data: any) => {
      const response = await api.updatePrompt(id, data, false)
      return response
    }
  }

  function onPromptValidate (id: string) {
    return async (data: any) => {
      const response = await api.updatePrompt(id, data, true)
      return response.messages
    }
  }

  async function onPromptSaved (data: any) {
    await invalidateAll()
    closePromptDialog()
  }

  let appAction: '' | 'advanceWorkflow' | 'reverseWorkflow' = ''
  async function onAppAction () {
    if (appAction === 'advanceWorkflow') {
      await advanceWorkflow()
    } else if (appAction === 'reverseWorkflow') {
      await reverseWorkflow()
    }
  }

  async function advanceWorkflow () {
    const response = await api.advanceWorkflow(application.id)
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Could not advance application',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: 'Application advanced.'
      })
    }
    await invalidateAll()
  }

  async function reverseWorkflow () {
    const response = await api.reverseWorkflow(application.id)
    if (!response.success) {
      toasts.add({
        type: 'error',
        title: 'Could not reverse application workflow',
        message: response.messages.map(m => m.message).join('\n') || 'An unknown error occurred.'
      })
    } else {
      toasts.add({
        type: 'success',
        message: 'Application workflow reversed.'
      })
    }
    await invalidateAll()
  }
</script>

<ApproveLayout {basicRequestData}>
  <svelte:fragment slot="sidebar">
    <Card title={application.title} tags={[{ label: applicationStatusInfo.label, type: applicationStatusInfo.color }]} tagsInBody>
      <!--
      <dl class="card">
        <dt>Status</dt>
        <dd><TagSet tags={[{ label: applicationStatusInfo.label, type: applicationStatusInfo.color }]} /></dd>
      </dl>
      -->
    </Card>
  </svelte:fragment>
  {#each sections as section (section.title)}
    <Panel title={section.title} expandable expanded>
      {#if section.requirements.some(r => r.prompts.length > 0)}
        <dl class="prompts">
          {#each section.requirements as requirement (requirement.id)}
            {#each requirement.prompts as prompt (prompt.id)}
              {@const def = uiRegistry.getPrompt(prompt.key)}
              {@const isReviewerQuestion = reviewerRequirementTypes.has(requirement.type) && !def?.automation}
              {@const isAutomation = !!def?.automation}
              {@const editMode = def != null && isReviewerQuestion && prompt.actions.update && def.formMode !== 'full' && !(prompt.invalidated && prompt.preloadData)}
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
                  <Form preload={prompt.preloadData} submit={onPromptSubmit(prompt.id)} validate={onPromptValidate(prompt.id)} autoSave on:autosaved={onPromptSaved} let:data let:messages>
                    <svelte:component this={def.formComponent} {data} appRequestData={appRequest.data} fetched={prompt.fetchedData} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} />
                    {#each messages as message (message.message, message.type)}
                      <FormInlineNotification {message} />
                    {/each}
                  </Form>
                {:else}
                  <RenderDisplayComponent {def} appRequestId={appRequest.id} appData={appRequest.data} prompt={prompt} configData={prompt.configurationData} gatheredConfigData={prompt.gatheredConfigData} showMoot />
                  {#if prompt.actions.update}
                    {#if prompt.invalidated && !applicantRequirementTypes.has(requirement.type)}
                      <Button kind="primary" size="field" class="prompt-edit" on:click={editPrompt(prompt)}>Review correction</Button>
                    {:else}
                      <Button kind="ghost" size="field" icon={Edit} iconDescription="Edit Prompt" class="prompt-edit" on:click={editPrompt(prompt)} />
                    {/if}
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
  <div class="app-actions [ flex items-end ]">
    {#if application.actions.advanceWorkflow || application.actions.reverseWorkflow}
      <Select bind:selected={appAction} labelText="Next step" size="sm">
        <SelectItem value="" text="Choose one" />
        {#if application.actions.advanceWorkflow}
          <SelectItem value="advanceWorkflow" text={'Send to ' + (application.nextWorkflowStage?.title ?? (!application.workflowStage?.blocking ? 'Complete' : 'Review Complete'))} />
        {/if}
        {#if application.actions.reverseWorkflow}
          <SelectItem value="reverseWorkflow" text={'Return to ' + (application.previousWorkflowStage?.title ?? 'Review')} />
        {/if}
      </Select>
      <Button on:click={onAppAction} size="small" class="ml-[4px]">Confirm</Button>
    {/if}
    <Button href={`/requests/${appRequest.id}/approve/export`} kind="secondary" size="small" icon={DocumentExport} class="ml-[32px]">Export</Button>
  </div>
</ApproveLayout>

{#if showPromptDialog && promptBeingEdited}
  <PanelFormDialog
    title={promptBeingEdited.invalidated ? `Review correction "${promptBeingEdited.title}"` : 'Edit Prompt'}
    bind:open={showPromptDialog}
    on:cancel={closePromptDialog}
    submit={onPromptSubmit(promptBeingEdited.id)}
    validate={onPromptValidate(promptBeingEdited.id)}
    on:saved={onPromptSaved}
    centered
    preload={promptBeingEdited.preloadData}
    let:data
  >
    {@const def = uiRegistry.getPrompt(promptBeingEdited.key)}
    <svelte:component this={def!.formComponent} appRequestId={appRequest.id} {data} appRequestData={promptBeingEdited.data} fetched={promptBeingEdited.fetchedData} configData={promptBeingEdited.configurationData} gatheredConfigData={promptBeingEdited.gatheredConfigData} />
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
  /*
  dl.card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px;
  }
  .card dt {
    font-weight: bold;
  }
  */
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

  .app-actions {
    width: fit-content;
  }
  .app-actions :global(.bx--select) {
    width: auto;
  }
</style>
