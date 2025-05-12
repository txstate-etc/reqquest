<script lang="ts">
  import { ColumnList, FieldCheckboxList, FieldMultiselect, Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import { api, type AccessRoleGrantCreate, type AccessRoleGrantUpdate, type AccessTagInput } from '$lib'
  import type { PageData } from './$types'
  import { pick } from 'txstate-utils'

  export let data: PageData
  $: ({ role, subjectTypes, subjectTypeLookup } = data)

  $: grants = role.grants.filter(g => g.allow)
  $: exceptions = role.grants.filter(g => !g.allow)

  type AccessRoleGrantCreateForm = Omit<AccessRoleGrantCreate, 'tags'> & { tags: Record<string, string[]> }
  type AccessRoleGrantUpdateForm = Omit<AccessRoleGrantUpdate, 'tags'> & { tags: Record<string, string[]> }
  function transformFromAPI (data: PageData['role']['grants'][number]): AccessRoleGrantUpdateForm {
    return {
      ...pick(data, 'subjectType', 'controls', 'allow'),
      tags: data.tags.reduce((acc: Record<string, string[]>, curr) => ({ ...acc, [curr.category]: [...(acc[curr.category] ?? []), curr.tag] }), {})
    }
  }
  function transformToAPI<T extends { tags: Record<string, string[]> }> (data: T): Omit<T, 'tags'> & { tags: AccessTagInput[] } {
    return {
      ...data,
      tags: Object.entries(data.tags).flatMap(([category, tags]) => tags.map(tag => ({ category, tag })))
    }
  }

  let showGrantEdit = false
  let grantToEdit: PageData['role']['grants'][number] | undefined
  let grantToEditInput: AccessRoleGrantUpdateForm | undefined
  function onGrantEdit (row: PageData['role']['grants'][number]) {
    return () => {
      showGrantEdit = true
      grantToEdit = row
      grantToEditInput = transformFromAPI(row)
    }
  }
  function onGrantDelete (row: PageData['role']['grants'][number]) {
    return () => {
      // Handle row click event
      console.log('Row clicked:', row)
    }
  }
  function onCloseEdit () {
    showGrantEdit = false
    grantToEdit = undefined
    grantToEditInput = undefined
  }
  async function onEditSubmit (data: AccessRoleGrantUpdateForm) {
    const response = await api.updateGrant(grantToEdit!.id, transformToAPI(data), false)
    return { ...response, data }
  }
  async function onEditValidate (data: AccessRoleGrantUpdateForm) {
    const response = await api.updateGrant(grantToEdit!.id, transformToAPI(data), true)
    return response.messages
  }
  async function onCreateSubmit (data: AccessRoleGrantCreateForm) {
    const response = await api.createGrant(role.id, transformToAPI(data), false)
    return { ...response, data }
  }
  async function onCreateValidate (data: AccessRoleGrantCreateForm) {
    const response = await api.createGrant(role.id, transformToAPI(data), true)
    return response.messages
  }
</script>

<Panel title="{role.name} Details">
  <div class="description">
    {role.description ?? ''}
  </div>
  <div class="groups">
    <h3>Groups</h3>
    <ul>
      {#each role.groups as group}
        <li>{group}</li>
      {/each}
    </ul>
  </div>
</Panel>

<ColumnList
  title="Grants for Role: {role.name}"
  columns={[
    { id: 'subjectType', label: 'Grants', get: 'subjectType' },
    { id: 'controls', label: 'Controls', render: grant => grant.controls.join(', ') },
    { id: 'tags', label: 'Tags', render: grant => grant.tags.map(t => t.label).join(', ') }
  ]}
  rows={grants}
  actions={row => [
    {
      label: 'Edit',
      icon: Edit,
      onClick: onGrantEdit(row),
      disabled: !row.actions.update
    },
    {
      label: 'Delete',
      icon: TrashCan,
      onClick: onGrantDelete(row),
      disabled: !row.actions.delete
    }
  ]}
/>

{#if exceptions.length}
  <ColumnList
    title="Exceptions for Role: {role.name}"
    columns={[
      { id: 'subjectType', label: 'Exceptions', get: 'subjectType' },
      { id: 'controls', label: 'Controls', render: role => role.controls.join(', ') },
      { id: 'tags', label: 'Tags', render: role => role.tags.map(t => t.label).join(', ') }
    ]}
    rows={exceptions}
    actions={row => [
      {
        label: 'Edit',
        icon: Edit,
        onClick: onGrantEdit(row),
        disabled: !row.actions.update
      },
      {
        label: 'Delete',
        icon: TrashCan,
        onClick: onGrantDelete(row),
        disabled: !row.actions.delete
      }
    ]}
  />
{/if}

{#if showGrantEdit && grantToEdit}
  {@const subjectType = subjectTypeLookup[grantToEdit.subjectType]}
  <PanelFormDialog open title="Edit {grantToEdit.allow ? 'Grant' : 'Exception'}" centered submit={onEditSubmit} validate={onEditValidate} on:cancel={onCloseEdit} preload={grantToEditInput} let:data>
    <FieldCheckboxList
      path="controls"
      legendText="Controls"
      items={subjectType.controls.map(c => ({ value: c.name }))}
      orientation="horizontal"
    />
    {#each subjectType.tags as category}
      <FieldMultiselect
        path="tags.{category.category}"
        titleText={category.label}
        helperText={category.description}
        label="Restrict to {category.label}"
        items={category.tags}
      />
    {/each}
  </PanelFormDialog>
{/if}
