<script lang="ts">
  import { Card, Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { Form } from '@txstate-mws/svelte-forms'
  import { Button } from 'carbon-components-svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import { invalidate } from '$app/navigation'
  import { api, enumRequirementType } from '$lib'
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

  // here we split the screen into sections based on the requirement type, but we
  // keep everything in order, so if a reviewer requirement appears between two
  // applicant requirements, it will be shown in the applicant section. We are assuming
  // that the developer put it in that order intentionally but we still want to try to break up
  // page as best we can.
  let generalReqs: ApplicationRequirement[]
  let applicantReqs: ApplicationRequirement[]
  let reviewerReqs: ApplicationRequirement[]
  let acceptanceReqs: ApplicationRequirement[]
  let blockingWorkflow: Record<string, { title: string, requirements: ApplicationRequirement[] }> = {}
  let nonBlockingWorkflow: Record<string, { title: string, requirements: ApplicationRequirement[] }> = {}
  $: {
    generalReqs = []
    applicantReqs = []
    reviewerReqs = []
    acceptanceReqs = []
    blockingWorkflow = {}
    nonBlockingWorkflow = {}
    for (const req of application.requirements) {
      if (req.type === enumRequirementType.ACCEPTANCE) acceptanceReqs.push(req)
      else if (req.workflowStage) {
        const target = req.workflowStage.blocking ? blockingWorkflow : nonBlockingWorkflow
        target[req.workflowStage.key] ??= { title: req.workflowStage.title, requirements: [] }
        target[req.workflowStage.key].requirements.push(req)
      } else if (req.type === enumRequirementType.APPROVAL || req.type === enumRequirementType.PREAPPROVAL) reviewerReqs.push(req)
      else if (req.type === enumRequirementType.QUALIFICATION || req.type === enumRequirementType.POSTQUAL) {
        if (applicantReqs.length > 0) {
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
  ].filter(s => s.requirements.length > 0 && s.requirements.some(r => r.prompts.length > 0))

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
      console.log('onPromptSubmit', data)
      const response = await api.updatePrompt(id, data, false)
      console.log('onPromptSubmit response', response)
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
    await invalidate('request:approve')
    closePromptDialog()
  }
</script>

<ApproveLayout {basicRequestData}>
  <svelte:fragment slot="sidebar">
    <Card title={application.title}>
      <dl class="card">
        <dt>Status</dt>
        <dd>{application.status}</dd>
      </dl>
    </Card>
  </svelte:fragment>
  {#each sections as section (section.title)}
    <Panel title={section.title} expandable expanded>
      <dl class="prompts">
        {#each section.requirements as requirement (requirement.id)}
          {#each requirement.prompts as prompt (prompt.id)}
            {@const def = uiRegistry.getPrompt(prompt.key)}
            {@const isReviewerQuestion = requirement.type === enumRequirementType.APPROVAL}
            {@const editMode = isReviewerQuestion && prompt.actions.update && def.formMode !== 'full'}
            {@const small = editMode && def.formMode !== 'full' ? def.formMode !== 'large' : def.displayMode !== 'large'}
            {@const large = editMode && def.formMode !== 'full' ? def.formMode === 'large' : def.displayMode === 'large'}
            {@const dtid = `dt-title-${prompt.id}`}
            <dt class:small class:large class:isReviewerQuestion><div id={dtid}>{prompt.title}</div></dt>
            <dd class:small class:large class:isReviewerQuestion role={editMode ? 'group' : undefined} aria-labelledby={dtid}>
              {#if editMode}
                <Form preload={appRequest.data[prompt.key]} submit={onPromptSubmit(prompt.id)} validate={onPromptValidate(prompt.id)} autoSave on:autosaved={onPromptSaved} let:data>
                  <svelte:component this={def.formComponent} {data} appRequestData={appRequest.data} fetched={prompt.fetchedData} configData={prompt.configurationRelatedData} />
                </Form>
              {:else}
                {#if prompt.answered}
                  <svelte:component this={def.displayComponent} data={appRequest.data[prompt.key] ?? {}}/>
                {:else}
                  Not fully answered yet.
                {/if}
                {#if prompt.actions.update}
                  <Button kind="ghost" size="field" icon={Edit} iconDescription="Edit Prompt" class="prompt-edit" on:click={editPrompt(prompt)} />
                {/if}
              {/if}
            </dd>
          {/each}
        {/each}
      </dl>
    </Panel>
  {/each}
</ApproveLayout>

{#if showPromptDialog && promptBeingEdited}
  <PanelFormDialog
    title="Edit Prompt"
    bind:open={showPromptDialog}
    on:cancel={closePromptDialog}
    submit={onPromptSubmit(promptBeingEdited.id)}
    validate={onPromptValidate(promptBeingEdited.id)}
    on:saved={onPromptSaved}
    centered
    preload={appRequest.data[promptBeingEdited.key]}
    let:data
  >
    {@const def = uiRegistry.getPrompt(promptBeingEdited.key)}
    <svelte:component this={def.formComponent} {data} appRequestData={promptBeingEdited.data} fetched={promptBeingEdited.fetchedData} configData={promptBeingEdited.configurationRelatedData} />
  </PanelFormDialog>
{/if}

<style>
  dl.prompts {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: stretch;
    gap: 0;
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
  }
  .prompts dd :global(.bx--btn.prompt-edit) {
    position: absolute;
    top: 0;
    right: 0;
  }

  dl.card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px;
  }
  .card dt {
    font-weight: bold;
  }
</style>
