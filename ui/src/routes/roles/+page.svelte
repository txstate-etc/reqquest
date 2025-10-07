<script lang="ts">
  import { ActionSet, Card, CardGrid, ColumnList, FieldMore, FieldMultiselect, FieldTextArea, FieldTextInput, PanelFormDialog, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
  import { Modal } from 'carbon-components-svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import Settings from 'carbon-icons-svelte/lib/Settings.svelte'
  // Edit is using Settings icon
  // import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import Copy from 'carbon-icons-svelte/lib/Copy.svelte'
  import { omit, pick } from 'txstate-utils'
  import { invalidate } from '$app/navigation'
  import { api, type AccessRole, type AccessRoleGroup, type AccessRoleInput } from '$lib'
  import type { PageData } from './$types'
  import { DateTime } from 'luxon';

  export let data: PageData
  export let rolenames = new Set()
  $: ({ roles, access } = data)
  $: for (const role of roles ?? []) rolenames.add(role.name)

  // Group updates to Roles accept only the group name and not a group object.
  type AccessRoleUpdateForm = Omit<AccessRoleInput, 'groups'> & { groups: string[], id?: string }
  function transformFromAPI (data: PageData['roles'][number]): AccessRoleUpdateForm {
    return {
      ...pick(data, 'id', 'name', 'description'),
      groups: data.groups.map(group => group.groupName)
    }
  }

  let createDialog = false
  let editingRole: AccessRoleUpdateForm | undefined

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
</script>

<!-- maxRowActionButton={1} -->
<!-- title={role.name + '<br>' + role.description} -->
<ActionSet includeLabels actions={[
  {
    label: 'Create Role',
    icon: Add,
    disabled: !access.createRole,
    onClick: () => {
      createDialog = true
      editingRole = undefined
    }
  }
]}/>

{#each roles ?? [] as role, index (role.id)}
<div class="admin-settings">
  <h2 class="text-lg">{role.name}</h2>
  <p>{role.description}</p>
<ColumnList
  title={role.name}
  listActionsMaxButtons={2}
  listActionsIncludeLabels={false}
  listActions={[
    { label: 'Edit', icon: Settings, onClick: () => {
        createDialog = true;
        editingRole = transformFromAPI(role)
      }
    },
    { label: 'View', icon: View, href: `/roles/${role.id}`,  },
    { label: 'Duplicate', icon: Copy, onClick: () => {
        createDialog = true;
        const duplicateRole = transformFromAPI(role)
        let name = duplicateRole.name
        while (rolenames.has(name)) {
          let s = name.search(/[0-9]+$/g);
          if (s !== -1) {
            let count = parseInt(name.slice(s))
            name = name.slice(0, s) + (count + 1).toString()
          } else {
            name = name + '-1'
          }
        }
        // rolenames.add(name)
        editingRole = { ...omit(duplicateRole, 'name', 'id'), name }
      }
    },
    { label: 'Delete', icon: TrashCan, onClick: () => openRoleDeleteDialog(role) }
  ]}
  noItemsTitle='There are no groups associated with this Role'
  noItemsSubtitle=''
  columns={[
    { id: 'group', label: 'Group', get: 'groupName' },
    { id: 'manager', label: 'Manager', render: row => (Array.isArray(row.managers) && row.managers.length > 0) ? row.managers[0].fullname + '<br/>' + row.managers[0].email : 'no manager information' },
    { id: 'added', label: 'Added Date', render: row => (row.dateAdded) ? (row.dateAdded as DateTime).toFormat('MM/dd/yyyy') : '--/--/----' }
  ]}
  rows={role.groups.map(g => ({...g, id: g.roleId + g.groupName}))}/>
</div>
{/each}

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

<style>
  :global(div.admin-settings) {
    margin: 0 0 20px 0;
    background: var(--cds-layer);
  }
  :global(div.admin-settings h2) {
    padding: 8px 8px 0 8px;
  }
  :global(div.admin-settings p) {
    padding: 0 8px 8px 8px;
    line-height: calc(2rem - 10px);
  }
</style>