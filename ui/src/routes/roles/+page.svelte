<script lang="ts">
  import { ActionSet, Card, CardGrid, ColumnList, FieldMore, FieldMultiselect, FieldTextArea, FieldTextInput, PanelFormDialog, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
  import { Modal } from 'carbon-components-svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import View from 'carbon-icons-svelte/lib/View.svelte'
  import { pick } from 'txstate-utils'
  import { invalidate } from '$app/navigation'
  import { api, type AccessRole, type AccessRoleGroup, type AccessRoleInput } from '$lib'
  import type { PageData } from './$types'
  import { DateTime } from 'luxon';

  export let data: PageData
  $: ({ roles, access } = data)
  // console.log(`Datat-ROLES-svelte: ${JSON.stringify(data)}`)

  // Group updates to Roles accept only the group name and not a group object.
  type AccessRoleUpdateForm = Omit<AccessRoleInput, 'groups'> & { groups: string[] }
  function transformFromAPI (data: PageData['roles'][number]): AccessRoleUpdateForm {
    return {
      ...pick(data, 'id', 'name', 'description'),
      groups: data.groups.map(group => group.groupName)
    }
  }

  let createDialog = false
  let editingRole: AccessRoleInput | undefined

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

<CardGrid cardSize="100">
{#each roles ?? [] as role, index (role.id)}
<Card
  title={role.name}
  subhead={role.description ?? 'no descritpion is available'}
  forceOverflow={false}
  actions={[
    { label: 'View', icon: View, href: `/roles/${role.id}` },
    { label: 'Edit', icon: Edit, onClick: () => {
        createDialog = true;
        editingRole = transformFromAPI(role)
      }
    },
    { label: 'Delete', icon: TrashCan, onClick: () => openRoleDeleteDialog(role) }
  ]}
  >
  <ColumnList
    title='Groups'
    columns={[
      { id: 'group', label: 'Group', get: 'groupName'},
      { id: 'manager', label: 'Manager', render: row => (Array.isArray(row.managers) && row.managers.length > 0) ? row.managers[0].fullname + '<br/>' + row.managers[0].email : 'no manager information' },
      { id: 'added', label: 'Added Date', render: row => (row.dateAdded) ? (row.dateAdded as DateTime).toFormat('MM/dd/yyyy') : '--/--/----' }
    ]}
    noItemsTitle='There are no groups associated with this Role'
    rows={role.groups.map(g => ({...g, id: g.roleId + g.groupName}))}/>
</Card>
{/each}
</CardGrid>
<div id="role-menu"></div>
<ActionSet includeLabels menuAlign="bottomleft" actions={[
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
