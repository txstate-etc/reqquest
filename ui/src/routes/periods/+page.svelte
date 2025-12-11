<script lang="ts">
  import { ColumnList, FieldDateTime, FieldSelect, FieldTextInput, Panel, PanelFormDialog, TagSet } from '@txstate-mws/carbon-svelte'
  import { InlineNotification, Modal, Tag } from 'carbon-components-svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import SettingsEdit from 'carbon-icons-svelte/lib/SettingsEdit.svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import { isBlank } from 'txstate-utils'
  import { invalidate } from '$app/navigation'
  import { base } from '$app/paths'
  import { api, type PeriodUpdate } from '$lib'
  import type { PageData } from './$types'
    import { DateTime } from 'luxon'

  type Period = PageData['periods'][number] & { copyPeriodId?: string }

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

  async function validate (period: Period) {
    const response = editingPeriod ? await api.updatePeriod(editingPeriod.id, periodToPeriodUpdate(period), true) : await api.createPeriod(periodToPeriodUpdate(period), true)
    return response.messages
  }

  async function submit (period: Period) {
    const response = editingPeriod ? await api.updatePeriod(editingPeriod.id, periodToPeriodUpdate(period), false) : await api.createPeriod(periodToPeriodUpdate(period), false, period.copyPeriodId)
    return {
      ...response,
      data: period
    }
  }

  function periodToPeriodUpdate (period: Period): PeriodUpdate {
    return { name: period.name, code: period.code, openDate: period.openDate, closeDate: period.closeDate, archiveDate: period.archiveDate }
  }

  function closeDialog () {
    creatingPeriod = false
    editingPeriod = undefined
  }

  function displayPhase (period: Period) {
    let { openDate: oDate, closeDate: cDate, archiveDate: aDate } = period
    const now = Date.now()
    const openDate = DateTime.now().toMillis()

    if (now < openDate) {
      return [{ label: 'Start pending' }]
    } else if (cDate) {
      const closeDate = DateTime.fromISO(cDate).toMillis()
      if (now < closeDate) return [{ label: 'OPEN' }]
      else if (now > closeDate) return [{ label: 'CLOSED' }]
      else if (aDate && now > DateTime.fromISO(aDate).toMillis()) return [{ label: 'ARCHIVED' }]
    }
    
    return []
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

<Panel
  title='Period'
  actions={[
    {
      label: 'Add Period',
      disabled: !access.createPeriod,
      icon: Add,
      onClick: () => { creatingPeriod = true; editingPeriod = undefined }
    }
]}>
  <ColumnList
  title="Periods"
  columns={[
    { id: 'period', label: 'Period', get: 'name' },
    { id: 'code', label: 'Code', tags: (row) => row.code ? [{ label: row.code, type: 'green' }] : [] },
    { id: 'phase', label: 'Phase', tags: displayPhase },
    { id: 'openDate', label: 'Start Date', render: renderDate('openDate') },
    { id: 'closeDate', label: 'Close Date', render: renderDate('closeDate') },
    { id: 'archiveDate', label: 'Archive Date', render: renderDate('archiveDate') },
  ]}
  rows={periods}
  actions={p => [
    { label: 'Configure', icon: SettingsEdit, href: `${base}/periods/${p.id}/configure`, disabled: !p.actions.update },
    { label: 'Edit', icon: Edit, onClick: () => { creatingPeriod = false; editingPeriod = p }, disabled: !p.actions.update },
    { label: 'Delete', icon: TrashCan, disabled: !p.actions.delete, onClick: () => openPeriodDeleteDialog(p) }
  ]}
  actionsMaxButtons={1}
/>
</Panel>

<PanelFormDialog open={creatingPeriod || !!editingPeriod} title={editingPeriod ? 'Edit Period' : 'Create Period'}
  preload={editingPeriod} {validate} {submit} on:saved={onSaved} on:cancel={closeDialog}>
  <InlineNotification
    kind='info'
    title="Configuration Updated"
    subtitle="You can update configurations once the new period is added."
    lowContrast
  />
  <FieldSelect
    labelText='Period configurations copied from'
    helpText='Help Text'
    items={periods.map(p => ({ value: p.id, label: p.name }))}
    path='copyPeriod'
  />
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
