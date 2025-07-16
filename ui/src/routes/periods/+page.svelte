<script lang="ts">
  import { ColumnList, FieldDateTime, FieldTextInput, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { Modal } from 'carbon-components-svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import SettingsEdit from 'carbon-icons-svelte/lib/SettingsEdit.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import { isBlank } from 'txstate-utils'
  import { invalidate } from '$app/navigation'
  import { base } from '$app/paths'
  import { api, type PeriodUpdate } from '$lib'
  import type { PageData } from './$types'

  type Period = PageData['periods'][number]

  export let data: PageData
  $: ({ periods, access } = data)

  function renderDate (prop: 'openDate' | 'closeDate' | 'archiveDate') {
    return (period: Period) => {
      const date = period[prop]
      if (isBlank(date)) return ''
      return new Date(date).toLocaleDateString()
    }
  }

  let creatingPeriod = false
  let editingPeriod: Period | undefined
  let deleteDialog = false
  let deletingPeriod: Period | undefined

  async function validate (period: PeriodUpdate) {
    const response = editingPeriod ? await api.updatePeriod(editingPeriod.id, period, true) : await api.createPeriod(period, true)
    return response.messages
  }

  async function submit (period: PeriodUpdate) {
    const response = editingPeriod ? await api.updatePeriod(editingPeriod.id, period, false) : await api.createPeriod(period, false)
    return {
      ...response,
      data: period
    }
  }

  function closeDialog () {
    creatingPeriod = false
    editingPeriod = undefined
  }

  async function onSaved () {
    closeDialog()
    await invalidate('api:getPeriodList')
  }

  function closePeriodDeleteDialog () {
    deleteDialog = false
    deletingPeriod = undefined
  }
  function openPeriodDeleteDialog (period: Period) {
    deleteDialog = true
    deletingPeriod = period
  }
  async function executePeriodDelete () {
    if (!deletingPeriod) return
    const success = await api.deletePeriod(deletingPeriod.id)
    if (success) {
      closePeriodDeleteDialog()
      invalidate('api:getPeriodList').catch(console.error)
    }
  }
</script>

<ColumnList
  title="Periods"
  columns={[
    { id: 'period', label: 'Period', get: 'name' },
    { id: 'openDate', label: 'Start Date', render: renderDate('openDate') },
    { id: 'closeDate', label: 'Close Date', render: renderDate('closeDate') },
    { id: 'archiveDate', label: 'Archive Date', render: renderDate('archiveDate') },
    { id: 'status', label: 'Status', get: 'status' }
  ]}
  rows={periods}
  listActions={[
    {
      label: 'Create Period',
      disabled: !access.createPeriod,
      icon: SettingsEdit,
      onClick: () => { creatingPeriod = true; editingPeriod = undefined }
    }
  ]}
  actions={p => [
    { label: 'Configure', icon: SettingsEdit, href: `${base}/periods/${p.id}/configure` },
    { label: 'Edit', icon: Edit, onClick: () => { creatingPeriod = false; editingPeriod = p } },
    { label: 'Delete', icon: TrashCan, disabled: !p.actions.delete, onClick: () => openPeriodDeleteDialog(p) }
  ]}
/>

<PanelFormDialog open={creatingPeriod || !!editingPeriod} title={editingPeriod ? 'Edit Period' : 'Create Period'}
  preload={editingPeriod} {validate} {submit} on:saved={onSaved} on:cancel={closeDialog}>
  <FieldTextInput path="name" labelText="Period Name" required notNull />
  <FieldTextInput path="code" labelText="Code" />
  <FieldDateTime path="openDate" labelText="Open Date" required defaultValue={new Date().toISOString()} />
  <FieldDateTime path="closeDate" labelText="Close Date" />
  <FieldDateTime path="archiveDate" labelText="Archive Date" />
</PanelFormDialog>
<Modal
  bind:open={deleteDialog}
  modalHeading="Delete Period"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  size="sm"
  on:click:button--secondary={closePeriodDeleteDialog}
  on:submit={executePeriodDelete}
>
  <p>Are you sure you want to delete the period {deletingPeriod?.name}?</p>
  <p>This action cannot be undone.</p>
</Modal>
