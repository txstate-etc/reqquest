<script lang="ts">
  import { ColumnList, FieldSelect, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { goto } from '$app/navigation'
  import { base } from '$app/paths'
  import { api } from '$lib'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ appRequests, access, openPeriods } = data)

  let dialog = false
  let lastInsertedId: string | undefined
  async function clickCreateAppRequest () {
    if (openPeriods.length === 1) {
      const { success } = await submitAppRequest({ periodId: openPeriods[0].id })
      if (success) await onSaved()
    } else {
      dialog = true
    }
  }

  function closeDialog () {
    dialog = false
  }

  async function onSaved () {
    closeDialog()
    await goto(`${base}/requests/${lastInsertedId}/apply`)
  }

  async function validateAppRequest (data: { periodId: string }) {
    const response = await api.createAppRequest(data.periodId, access.user!.login, true)
    return response.messages
  }

  async function submitAppRequest (data: { periodId: string }) {
    const response = await api.createAppRequest(data.periodId, access.user!.login)
    if (response.success) lastInsertedId = response.id
    return {
      ...response,
      data
    }
  }
</script>

<ColumnList
  columns={[{ id: 'period', label: 'Period', render: r => r.period.name }, { id: 'Status', label: 'Status', get: 'status' }]}
  rows={appRequests}
  title="App Requests"
  actions={r => [
    {
      label: 'View',
      icon: View,
      href: `${base}/requests/${r.id}/apply`
    }
  ]}
  listActions={[
    {
      label: 'Create App Request',
      onClick: clickCreateAppRequest,
      disabled: !access.createAppRequestSelf
    }
  ]}
/>

<PanelFormDialog open={dialog} title="Create App Request" validate={validateAppRequest} submit={submitAppRequest} on:cancel={closeDialog} on:saved={onSaved}>
  <FieldSelect
    labelText="Period"
    path="periodId"
    items={openPeriods.map(p => ({ value: p.id, label: p.name }))}
    required
    helperText="Select the period in which you want to create an app request."
  />
</PanelFormDialog>
