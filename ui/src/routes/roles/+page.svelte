<script lang="ts">
  import { ActionSet, ColumnList, FieldMore, FieldTextArea, FieldTextInput, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { toasts } from '@txstate-mws/svelte-components'
  import { Button, Modal } from 'carbon-components-svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import SettingsEdit from 'carbon-icons-svelte/lib/SettingsEdit.svelte'
  import { invalidate } from '$app/navigation'
  import { api, type AccessRoleInput } from '$lib'
  import Copy from 'carbon-icons-svelte/lib/Copy.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import type { DateTime } from 'luxon'
  import { omit, pick } from 'txstate-utils'
  import type { PageData } from './$types'

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
  let isDuplicating = false
  let duplicateSourceId: string | undefined // Source role ID when duplicating (to copy grants)
  let duplicateSourceName: string | undefined // Source role name for success message

  async function validate (role: AccessRoleUpdateForm) {
    const response = await api.upsertRole(editingRole?.id, role, true, isDuplicating ? duplicateSourceId : undefined)
    return response.messages
  }

  async function onSubmit (role: AccessRoleUpdateForm) {
    const response = await api.upsertRole(editingRole?.id, role, false, isDuplicating ? duplicateSourceId : undefined)
    return {
      ...response,
      data: role
    }
  }

  function onSaved (event: CustomEvent<AccessRoleUpdateForm>) {
    const roleName = event.detail.name
    let title: string
    let message: string
    if (editingRole?.id) {
      title = 'Role edited'
      message = `The role ${roleName} was successfully edited.`
    } else if (isDuplicating) {
      title = 'Role duplicated'
      message = `The role ${duplicateSourceName} was successfully duplicated as ${roleName}.`
    } else {
      title = 'New role created'
      message = `The role ${roleName} was successfully created.`
    }
    toasts.add({ type: 'success', title, message })
    closeDialog()
    invalidate('api:getRoleList').catch(console.error)
  }

  function closeDialog () {
    createDialog = false
    editingRole = undefined
    isDuplicating = false
    duplicateSourceId = undefined
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
      toasts.add({
        type: 'success',
        title: 'Role deleted',
        message: `The role ${deleteDialogRole.name} was successfully deleted.`
      })
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
      isDuplicating = false
    }
  }
]}/>

{#each roles ?? [] as role, index (role.id)}
<div class="admin-settings">
  <h2 class="text-lg">{role.name}</h2>
  <p>{role.description}</p>
<div class="role-list">
  <ColumnList
    title={role.name}
    listActionsMaxButtons={2}
    listActionsIncludeLabels={false}
    listActions={[
      { label: 'Edit', icon: SettingsEdit, onClick: () => {
        createDialog = true
        editingRole = transformFromAPI(role)
        isDuplicating = false
      }
      },
      { label: 'View permissions', icon: View, href: `/roles/${role.id}` },
      { label: 'Duplicate role', icon: Copy, onClick: () => {
        createDialog = true
        isDuplicating = true
        duplicateSourceId = role.id
        duplicateSourceName = role.name
        const duplicateRole = transformFromAPI(role)
        let name = duplicateRole.name
        while (rolenames.has(name)) {
          const s = name.search(/[0-9]+$/g)
          if (s !== -1) {
            const count = parseInt(name.slice(s))
            name = name.slice(0, s) + (count + 1).toString()
          } else {
            name = name + '-1'
          }
        }
        editingRole = { ...omit(duplicateRole, 'name', 'id'), name }
      }
      },
      { label: 'Delete role', icon: TrashCan, onClick: () => openRoleDeleteDialog(role) }
    ]}
    noItemsTitle='There are no groups associated with this Role'
    noItemsSubtitle=''
    columns={[
      { id: 'group', label: 'Group', get: 'groupName' },
      { id: 'manager', label: 'Manager', render: row => (Array.isArray(row.managers) && row.managers.length > 0) ? row.managers[0].fullname + '<br/>' + row.managers[0].email : 'no manager information' },
      { id: 'added', label: 'Added Date', render: row => (row.dateAdded) ? (row.dateAdded as DateTime).toFormat('MM/dd/yyyy') : '--/--/----' }
    ]}
    rows={role.groups.map(g => ({ ...g, id: g.roleId + g.groupName }))}/>
  </div>
</div>
{/each}

{#if createDialog}
  <PanelFormDialog open title={editingRole?.id ? 'Edit role' : 'Create Role'} preload={editingRole ? pick(editingRole, 'name', 'description', 'groups') : undefined} submit={onSubmit} {validate} on:saved={onSaved} on:cancel={closeDialog} unsavedWarning >
    <p class="panel-description [ text-sm ] ">You can grant or restrict access to various features and data after creating the role.</p>
    <FieldTextInput path="name" labelText="Role Name" required notNull />
    <FieldTextArea path="description" labelText="Description" helperText="This will help other admins understand what the role does." />
    <FieldMore path="groups" legendText="Groups" required>
      <FieldTextInput path="" labelText="Group Name" placeholder="Enter group name"/>
    </FieldMore>
    <svelte:fragment slot="afterform">
      {#if editingRole?.id && !isDuplicating}
        <div class="[ -mt-8 ]">
          <Button kind="secondary" icon={Add} href="/roles/{editingRole.id}">
            Edit permissions
          </Button>
        </div>
      {/if}
    </svelte:fragment>
  </PanelFormDialog>
{/if}
<Modal
  bind:open={deleteDialog}
  modalHeading="Delete Role"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  danger
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

  .panel-description {
    margin-bottom: 1rem;
    color: var(--cds-text-01);
  }

  .role-list :global(.column-list-head) {
    background: var(--cds-ui-03);
  }
</style>
