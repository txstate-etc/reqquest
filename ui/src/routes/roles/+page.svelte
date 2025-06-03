<script lang="ts">
  import { ColumnList, FieldMore, FieldTextArea, FieldTextInput, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { pick } from 'txstate-utils'
  import { invalidate } from '$app/navigation'
  import { api, type AccessRoleInput } from '$lib'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ roles } = data)

  let createDialog = false
  let editingRole: PageData['roles'][number] | undefined

  async function validate (role: AccessRoleInput) {
    const response = await api.upsertRole(editingRole?.id, role, true)
    return response.messages
  }

  async function onSubmit (role: AccessRoleInput) {
    const response = await api.upsertRole(editingRole?.id, role, false)
    return {
      ...response,
      data: role
    }
  }

  function onSaved () {
    closeDialog()
    invalidate('api:getRoleList').catch(console.error)
  }

  function closeDialog () {
    createDialog = false
    editingRole = undefined
  }
</script>

<ColumnList
  title="Roles"
  columns={[
    { id: 'role', label: 'Role', get: 'name' },
    { id: 'groups', label: 'Groups', render: role => role.groups.join(', ') },
    { id: 'description', label: 'Description', get: 'description' }
  ]}
  rows={roles}
  listActions={[
    {
      label: 'Create Role',
      icon: Add,
      onClick: () => {
        createDialog = true
        editingRole = undefined
      }
    }
  ]}
  actions={row => [
    {
      label: 'View',
      icon: View,
      href: `/roles/${row.id}`
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: () => {
        editingRole = row
        createDialog = true
      }
    }
  ]}
/>

{#if createDialog}
  <PanelFormDialog open title="Create Role" preload={editingRole ? pick(editingRole, 'name', 'description', 'groups') : undefined} submit={onSubmit} {validate} on:saved={onSaved} on:cancel={closeDialog}>
    <FieldTextInput path="name" labelText="Role Name" required notNull />
    <FieldTextArea path="description" labelText="Description" />
    <FieldMore path="groups" legendText="Groups" required>
      <FieldTextInput path="" labelText="Group Name" placeholder="Enter group name"/>
    </FieldMore>
  </PanelFormDialog>
{/if}
