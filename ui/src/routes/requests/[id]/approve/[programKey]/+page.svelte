<script lang="ts">
  import { BadgeNumber, FieldTextArea, PanelDialog, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import ReviewerQuestions from '$internal/components/ReviewerQuestions.svelte'
  import { Button, InlineNotification, Select, SelectItem } from 'carbon-components-svelte'
  import DocumentExport from 'carbon-icons-svelte/lib/DocumentExport.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import Pen from 'carbon-icons-svelte/lib/Pen.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { invalidateAll } from '$app/navigation'
  import { api, getApplicationStatusInfo } from '$internal'
  import { CommentCard, enumPromptVisibility, enumRequirementStatus, enumRequirementType, InfoCard, PromptIndicators } from '$lib'
  import type { PageData } from './$types'
  import { uiRegistry } from '../../../../../local'
  import ApproveLayout from '../ApproveLayout.svelte'
  import { Loading } from "carbon-components-svelte";


  /**
   * This page is the primary reviewer screen, it will show all the prompt
   * data so far collected and allow the reviewer to navigate to (modal popup?)
   * any available prompts to fill in more data.
   */
  export let data: PageData
  $: ({ basicRequestData, appRequest, programKey } = data)
  $: application = appRequest.applications.find(a => a.programKey === programKey)!
  $: notes = appRequest.notes
  $: latestNote = notes[0]

  let showNotesDialog = false
  let showAddNoteDialog = false
  let showUpdateNoteDialog = false
  let noteBeingEdited: { id: string, content: string, persistent: boolean } | undefined = undefined

  async function onAddNoteValidate (data: { content: string, persistent?: boolean }) {
    const response = await api.addNote(appRequest.id, data.content, data.persistent, true)
    return response.messages
  }

  async function onAddNoteSubmit (data: { content: string, persistent?: boolean }) {
    const response = await api.addNote(appRequest.id, data.content, data.persistent, false)
    return { ...response, data }
  }

  async function onAddNoteSaved () {
    showAddNoteDialog = false
    await invalidateAll()
  }

  // NOTE: addNote and updateNote should always share validation rules.
  // As long as we do not set persistent flag, then we can reuse addNote
  // to validate.
  async function onUpdateNoteValidate (data: { content: string }) {
    const response = await api.addNote(appRequest.id, data.content, undefined, true)
    return response.messages
  }

  async function onUpdateNoteSubmit (data: { content: string, persistent: boolean }) {
    if (!noteBeingEdited) return { success: false, messages: [], data }
    if (data.persistent !== noteBeingEdited.persistent) {
      const response = await api.togglePersistence(noteBeingEdited.id)
      if (!response.success) return { ...response, data }
    }
    if (data.content !== noteBeingEdited.content) {
      const response = await api.updateNote(noteBeingEdited.id, data.content)
      return { ...response, data }
    }
    return { success: true, messages: [], data }
  }

  async function onUpdateNoteSaved () {
    showUpdateNoteDialog = false
    noteBeingEdited = undefined
    await invalidateAll()
  }

  function editNote (note: { id: string, content: string, persistent?: boolean | null }) {
    noteBeingEdited = {
      id: note.id,
      content: note.content,
      persistent: note.persistent ?? false
    }
    showNotesDialog = false
    showUpdateNoteDialog = true
  }

  async function deleteNote (noteId: string) {
    const success = await api.deleteNote(noteId)
    if (success) {
      toasts.add({ type: 'success', message: 'Note deleted.' })
      await invalidateAll()
    }
  }

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
  $: loading = false
  let showLoading = false
  let loadingTimer: NodeJS.Timeout | undefined
  $: {
    if (loading) {
      if (!loadingTimer) {
        loadingTimer = setTimeout(() => {
          showLoading = true
        }, 500)
      }
    } else {
      clearTimeout(loadingTimer)
      loadingTimer = undefined
      showLoading = false
    }
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
    loading = true
    const response = await api.advanceWorkflow(application.id)     
    await invalidateAll()    
    loading = false   
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
  }

  async function reverseWorkflow () {
    loading = true
    const response = await api.reverseWorkflow(application.id)     
    await invalidateAll()    
    loading = false   
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
  }
</script>
{#if showLoading}  
    <Loading />    
{/if}

<ApproveLayout {basicRequestData} {appRequest}>
  <svelte:fragment slot="sidebar">
    <InfoCard title={application.title} tags={[{ label: applicationStatusInfo.label, type: applicationStatusInfo.color }]} tagsInBody>
      <!--
      <dl class="card">
        <dt>Status</dt>
        <dd><TagSet tags={[{ label: applicationStatusInfo.label, type: applicationStatusInfo.color }]} /></dd>
      </dl>
      -->
    </InfoCard>
    <InfoCard
      title="Application Notes"
      actions={[
        ...(appRequest.actions.createNote ? [{ label: 'Add Note', icon: Pen, onClick: () => { showAddNoteDialog = true } }] : []),
        ...(notes.length > 0 ? [{ label: 'See All Notes', icon: View, onClick: () => { showNotesDialog = true } }] : [])
      ]}
    >
      <BadgeNumber slot="header-right" value={notes.length} style="--badge-bg: var(--cds-ui-04)" />
      <div class="active-note">
        {#if latestNote}
          <CommentCard
          authorName={latestNote.author.fullname}
          authorLogin={latestNote.author.login}
          content={latestNote.content}
          createdAt={latestNote.createdAt}
          noborder
          />
        {:else}
          <InlineNotification kind="info" lowContrast hideCloseButton title="No application notes." subtitle="Add a note to see it here."></InlineNotification>
        {/if}
      </div>
    </InfoCard>
  </svelte:fragment>
  <ReviewerQuestions {sections} {appRequest} {application} {promptIndicator} />
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


{#if showUpdateNoteDialog && noteBeingEdited}
  <PanelFormDialog
    title="Update Note"
    bind:open={showUpdateNoteDialog}
    on:cancel={() => { showUpdateNoteDialog = false; noteBeingEdited = undefined }}
    on:saved={onUpdateNoteSaved}
    validate={onUpdateNoteValidate}
    submit={onUpdateNoteSubmit}
    submitText="Save"
    disableSaveUntilChanged={true}
    centered
    preload={{
      content: noteBeingEdited.content,
      persistent: noteBeingEdited.persistent
    }}
  >
    <FieldTextArea path="content" labelText="Note" required notNull rows={6} />
    <!--
    {#if appRequest.actions.createPersistentNote}
      <FieldCheckbox path="persistent" labelText="Persistent (show on the applicant's profile)" />
    {/if}
    -->
  </PanelFormDialog>
{/if}

<PanelFormDialog
  title="New application note"
  bind:open={showAddNoteDialog}
  on:cancel={() => { showAddNoteDialog = false }}
  on:saved={onAddNoteSaved}
  validate={onAddNoteValidate}
  submit={onAddNoteSubmit}
  submitText="Save note"
  centered
>
  <div>Write a note for this application.</div>
  <FieldTextArea path="content" labelText="Note" required notNull rows={6} placeholder="Enter your note here." />
  <div class="bx--form__helper-text">This note will only be visible to other reviewers who access this application.</div>
  <!-- {#if appRequest.actions.createPersistentNote}
    <FieldCheckbox path="persistent" labelText="Persistent (show on the applicant's profile)" />
  {/if}
  -->
</PanelFormDialog>

<PanelDialog
  title="Application Notes"
  bind:open={showNotesDialog}
  on:cancel={() => { showNotesDialog = false }}
  cancelText="Close"
  on:submit={() => { showNotesDialog = false; showAddNoteDialog = true }}
  submitText="Add a note"
  centered
  size="large"
>
  <div class="notes-list flow">
    {#each notes as note (note.id)}
      <CommentCard
        content={note.content}
        authorName={note.author.fullname}
        authorLogin={note.author.login}
        createdAt={note.createdAt}
        actions={[
          { label: 'Edit', icon: Edit, onClick: () => editNote(note) },
          { label: 'Delete', icon: TrashCan, onClick: () => deleteNote(note.id) }
        ]}
      />
    {:else}
      <p>No application notes. Add note to see it here.</p>
    {/each}
  </div>
</PanelDialog>

<style>
  .active-note {
    padding: 4px 8px;
  }

  :global(.content):has(.notes-list) {
    max-height: calc(90vh - 1.5rem - 64px);
    background-color: var(--cds-ui-01);
  }

  .app-actions {
    width: fit-content;
  }
  .app-actions :global(.bx--select) {
    width: auto;
  }
</style>