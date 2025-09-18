<script lang="ts">
  import { ColumnList, FieldMore, FieldMultiselect, FieldTextArea, FieldTextInput, FilterUI, PanelFormDialog, TabRadio, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
  import { InlineNotification, Modal } from 'carbon-components-svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { pick } from 'txstate-utils'
  import { invalidate } from '$app/navigation'
  import { api, type AccessRole, type AccessRoleGroup } from '$lib'
  import type { PageData } from './$types'
  import type { AdminManagementTabs } from './+page';

  interface AdminManagementState {
    tab?: AdminManagementTabs
    search?: string
    institutionalRoles?: string[]
  }

  export let data: PageData
  $: ({ roles, users, access } = data)

  // Reactive statements for filter options
  $: availableInstitutionalRoles = getInstitutionalRoles()

  let adminManagementState: AdminManagementState

  // Group updates to Roles accept only the group name and not a group object.
  type AccessRoleUpdateForm = Omit<AccessRole, 'groups'> & { groups: string[] }
  function transformFromAPI (data: PageData['roles'][number]): AccessRoleUpdateForm {
    return {
      ...pick(data, 'scope', 'name', 'id', 'grants', 'description', 'actions', '__typename'),
      groups: data.groups.map((group: AccessRoleGroup) => group.groupName)
    }
  }

  let createDialog = false
  let editingRole: PageData['roles'][number] | undefined

  async function validate (role: AccessRoleUpdateForm) {
    const response = await api.upsertRole(editingRole?.id, role, true)
    return response.messages
  }

  async function onSubmit (role: AccessRoleUpdateForm) {
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

  let deleteDialog = false
  let deleteDialogRole: PageData['roles'][number] | undefined
  function openRoleDeleteDialog (role: PageData['roles'][number]) {
    deleteDialog = true
    deleteDialogRole = role
  }
  function closeRoleDeleteDialog () {
    deleteDialog = false
    deleteDialogRole = undefined
  }
  async function executeRoleDelete () {
    try {
      if (!deleteDialogRole) throw new Error('No role selected for deletion')
      await api.deleteRole(deleteDialogRole.id)
      closeRoleDeleteDialog()
      await invalidate('api:getRoleList')
    } catch (e: any) {
      closeRoleDeleteDialog()
      console.error(e)
    }
  }

  function getInstitutionalRoles(): ComboMenuItem[] {
    return [{value: 'Faculty'}, {value: 'Staff'}, {value: 'Student'}]
  }
</script>

<div class="flow">
  <!-- Filter UI for role management, users and eventually become user applications -->
  <FilterUI
    search={adminManagementState?.tab === 'users'}
    tabs={[
      { label: 'Role Management', value: 'role_management' },
      { label: 'Users', value: 'users' }
    ]}
    on:apply={e => { adminManagementState = e.detail }}
    on:mount={e => { adminManagementState = e.detail }}>
    <svelte:fragment slot="quickfilters">
      {#if adminManagementState?.tab === 'users'}
      <FieldMultiselect path="institutionalRoles" label="Institutional Roles" items={availableInstitutionalRoles} />
      {/if}
    </svelte:fragment>
  </FilterUI>

{#if adminManagementState?.tab === 'users'}
<InlineNotification
  kind="info"
  title="No results found."
  subtitle="You may need to refine your searched terms, filters or try again."
  lowContrast/>
{:else if adminManagementState?.tab === 'role_management'}
<ColumnList
  title="Roles"
  columns={[
    { id: 'role', label: 'Role', get: 'name' },
    { id: 'groups', label: 'Groups', render: role => role.groups.map(group => group.groupName).join(', ') },
    { id: 'description', label: 'Description', get: 'description' }
  ]}
  rows={roles}
  listActions={[
    {
      label: 'Create Role',
      icon: Add,
      disabled: !access.createRole,
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
        createDialog = true
        editingRole = transformFromAPI(row)
      }
    },
    {
      label: 'Delete',
      icon: TrashCan,
      onClick: () => openRoleDeleteDialog(row)
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
<Modal
  bind:open={deleteDialog}
  modalHeading="Delete Role"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  size="sm"
  on:click:button--secondary={closeRoleDeleteDialog}
  on:submit={executeRoleDelete}>
  <p>Are you sure you want to delete the role {deleteDialogRole?.name}?</p>
  <p>This action cannot be undone.</p>
</Modal>
{/if}
</div>