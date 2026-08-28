<script lang="ts">
  import { BadgeNumber, FieldTextArea, PanelDialog, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import { ReviewerQuestions, AppRequestActions } from '$internal/components'
  import { Button, InlineNotification, Select, SelectItem } from 'carbon-components-svelte'
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


  /**
   * This page is the primary reviewer screen, it will show all the prompt
   * data so far collected and allow the reviewer to navigate to (modal popup?)
   * any available prompts to fill in more data.
   */
  export let data: PageData
  $: ({ basicRequestData, appRequest, programKey, requestId } = data)
  $: application = appRequest.applications.find(a => a.programKey === programKey)!
  $: notes = appRequest?.notes ?? []
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
      // automation indicator is about the prompt itself not requirement's status, so only applies to the requirements own prompts
      for (const prompt of req.prompts) {
        if (prompt.visibility === enumPromptVisibility.UNREACHABLE) continue
        if (uiRegistry.getPrompt(prompt.key)?.automation && (promptIndicator[prompt.key]?.indicator ?? 0) < PromptIndicators.AUTOMATION) {
          promptIndicator[prompt.key] = { indicator: PromptIndicators.AUTOMATION, reason: 'This answer will be filled in by an automation.' }
        }
      }
      const faulted = req.blame?.length
        ? req.blame
        : req.prompts.filter(p => p.visibility !== enumPromptVisibility.UNREACHABLE).map(p => p.key)
      for (const key of faulted) {
        if (req.status === enumRequirementStatus.DISQUALIFYING && (promptIndicator[key]?.indicator ?? 0) < PromptIndicators.DISQUALIFYING) {
          promptIndicator[key] = { indicator: PromptIndicators.DISQUALIFYING, reason: req.statusReason ?? undefined }
        } else if (req.status === enumRequirementStatus.WARNING && (promptIndicator[key]?.indicator ?? 0) < PromptIndicators.WARNING) {
          promptIndicator[key] = { indicator: PromptIndicators.WARNING, reason: req.statusReason ?? undefined }
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
  $: applicationStatusTags = getApplicationStatusInfo(application.status, appRequest.phase, appRequest.closedAt, application.rescindedStatus).map(info => ({ label: info.label, type: info.color }))
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
  // open rescind and restore panelformdialog
  let reasonAction: 'rescind' | 'restore' | undefined = undefined
  $: reasonActionInfo = reasonAction === 'restore'
    ? { title: `Restore ${application.navTitle} benefit`, instructions: 'You will need to provide a reason why this benefit should be restored. The benefit will be restored to the state it was in before it was rescinded.', submitText: 'Restore benefit', successMessage: 'Benefit restored.' }
    : { title: `Rescind ${application.navTitle} benefit`, instructions: 'You will need to provide a reason why this benefit should be rescinded. The applicant will no longer be able to use this benefit after rescinding.', submitText: 'Rescind benefit', successMessage: 'Benefit rescinded.' }

  async function onReasonValidate (data: { reason: string }) {
    const response = reasonAction === 'restore'
      ? await api.restore(application.id, data.reason, true)
      : await api.rescind(application.id, data.reason, true)
    return response.messages
  }

  async function onReasonSubmit (data: { reason: string }) {
    const response = reasonAction === 'restore'
      ? await api.restore(application.id, data.reason, false)
      : await api.rescind(application.id, data.reason, false)
    return { ...response, data }
  }

  async function onReasonSaved () {
    const message = reasonActionInfo.successMessage
    onReasonCancel()
    await invalidateAll()
    toasts.add({ type: 'success', message })
  }

  function onReasonCancel () {
    reasonAction = undefined
  }
</script>

<ApproveLayout {basicRequestData} {appRequest}>
  <svelte:fragment slot="sidebar">
    <InfoCard title={application.title} tags={applicationStatusTags} tagsInBody />
    <AppRequestActions {application} {basicRequestData} {requestId} />
    <!-- <InfoCard title={application.title} tags={applicationStatusTags} tagsInBody> -->
      <!--
      <dl class="card">
        <dt>Status</dt>
        <dd><TagSet tags={applicationStatusTags} /></dd>
      </dl>
      -->
    <!-- </InfoCard> -->
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

    {#if application.actions.rescindApplication || application.actions.restoreApplication}
      <InfoCard title="Rescind / Restore Benefit">
        <div class="flow">
          {#if application.actions.rescindApplication}
            <Button size="small" class="[ w-full ]" kind="danger" on:click={() => { reasonAction = 'rescind' }}>Rescind benefit</Button>
          {/if}
          {#if application.actions.restoreApplication}
            <Button size="small" class="[ w-full ]" kind="danger-ghost" on:click={() => { reasonAction = 'restore' }}>Restore benefit</Button>
          {/if}
        </div>
      </InfoCard>
    {/if}
  </svelte:fragment>
  <ReviewerQuestions {sections} {appRequest} {application} {promptIndicator} {basicRequestData} bind:loading/>
</ApproveLayout>


{#if reasonAction}
  <PanelFormDialog
    title={reasonActionInfo.title}
    open
    on:cancel={onReasonCancel}
    on:saved={onReasonSaved}
    validate={onReasonValidate}
    submit={onReasonSubmit}
    submitText={reasonActionInfo.submitText}
    centered
  >
    <div>{reasonActionInfo.instructions}</div>
    <FieldTextArea path="reason" labelText={`Reason to ${reasonAction} this benefit.`} required notNull rows={4} />
    <div class="bx--form__helper-text">This reason will be recorded in the request activity and included in the email sent to the applicant.</div>
  </PanelFormDialog>
{/if}

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