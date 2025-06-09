<script lang="ts">
  import { ColumnList, FieldCheckboxList, FieldHidden, FieldMultiselect, FieldSelect, Panel, PanelFormDialog } from '@txstate-mws/carbon-svelte'
  import { Modal, TooltipDefinition } from 'carbon-components-svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import { setContext } from 'svelte'
  import { groupby, pick } from 'txstate-utils'
  import { invalidate } from '$app/navigation'
  import { api, type AccessRoleGrantCreate, type AccessRoleGrantUpdate, type AccessTagInput } from '$lib'
  import type { PageData } from './$types'
  import ControlWithTooltip from './ControlWithTooltip.svelte'

  export let data: PageData
  $: ({ role, subjectTypes, subjectTypeLookup } = data)

  $: grants = role.grants.filter(g => g.allow)
  $: exceptions = role.grants.filter(g => !g.allow)

  setContext('subjectTypeLookup', () => subjectTypeLookup)
  function tagsRender (tags: { categoryLabel: string, label: string }[]) {
    const categories = groupby(tags, 'categoryLabel')
    return Object.entries(categories).map(([category, tags]) => `<strong>${tags[0].categoryLabel}</strong><br>${tags.map(t => t.label).join(', ')}`).join('<br>')
  }

  type AccessRoleGrantCreateForm = Omit<AccessRoleGrantCreate, 'tags'> & { tags: Record<string, string[]> }
  type AccessRoleGrantUpdateForm = Omit<AccessRoleGrantUpdate, 'tags'> & { tags: Record<string, string[]> }
  function transformFromAPI (data: PageData['role']['grants'][number]): AccessRoleGrantUpdateForm {
    return {
      ...pick(data, 'controls', 'allow'),
      subjectType: data.subjectType.name,
      tags: data.tags.reduce((acc: Record<string, string[]>, curr) => ({ ...acc, [curr.category]: [...(acc[curr.category] ?? []), curr.tag] }), {})
    }
  }
  function transformToAPI<T extends { tags?: Record<string, string[]> }> (data: T): Omit<T, 'tags'> & { tags: AccessTagInput[] } {
    return {
      ...data,
      tags: Object.entries(data.tags ?? {}).flatMap(([category, tags]) => tags.map(tag => ({ category, tag })))
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
      grantToDelete = row
    }
  }
  function onCloseEdit () {
    showGrantCreate = false
    showGrantEdit = false
    grantToEdit = undefined
    grantToEditInput = undefined
  }
  async function onSaveGrant () {
    await invalidate('api:getRoleDetails')
    onCloseEdit()
  }
  async function onEditSubmit (data: AccessRoleGrantUpdateForm) {
    const response = await api.updateGrant(grantToEdit!.id, transformToAPI(data), false)
    return { ...response, data }
  }
  async function onEditValidate (data: AccessRoleGrantUpdateForm) {
    const response = await api.updateGrant(grantToEdit!.id, transformToAPI(data), true)
    return response.messages
  }

  let showGrantCreate = false
  let grantCreateAllow = true
  async function onCreateSubmit (data: AccessRoleGrantCreateForm) {
    const response = await api.createGrant(role.id, transformToAPI(data), false)
    return { ...response, data }
  }
  async function onCreateValidate (data: AccessRoleGrantCreateForm) {
    const response = await api.createGrant(role.id, transformToAPI(data), true)
    return response.messages
  }

  let grantToDelete: PageData['role']['grants'][number] | undefined
  function closeDeleteConfirmation () {
    grantToDelete = undefined
  }
  async function executeDelete () {
    try {
      await api.deleteGrant(grantToDelete!.id)
      await invalidate('api:getRoleDetails')
    } finally {
      closeDeleteConfirmation()
    }
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
  listActions={[
    {
      label: 'Add Grant',
      icon: Add,
      onClick: () => {
        showGrantCreate = true
        grantCreateAllow = true
      }
    }
  ]}
  columns={[
    { id: 'subjectType', label: 'Grants', render: grant => grant.subjectType.title },
    { id: 'controls', label: 'Controls', component: ControlWithTooltip },
    { id: 'tags', label: 'Restrictions', render: grant => tagsRender(grant.tags) }
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
<br><br>
<ColumnList
  title="Exceptions for Role: {role.name}"
  columns={[
    { id: 'subjectType', label: 'Exceptions', render: grant => grant.subjectType.title },
    { id: 'controls', label: 'Controls', render: grant => grant.controls.join(', ') },
    { id: 'tags', label: 'Restrictions', render: grant => grant.tags.map(t => t.label).join(', ') }
  ]}
  noItemsKind='info'
  noItemsTitle=''
  noItemsSubtitle='No exceptions on this role.'
  rows={exceptions}
  listActions={[
    {
      label: 'Add Exception',
      icon: Add,
      onClick: () => {
        showGrantCreate = true
        grantCreateAllow = false
      }
    }
  ]}
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

{#if showGrantEdit && grantToEdit}
  {@const subjectType = subjectTypeLookup[grantToEdit.subjectType.name]}
  <PanelFormDialog open title="Edit {grantToEdit.allow ? 'Grant' : 'Exception'}" submit={onEditSubmit} validate={onEditValidate} on:cancel={onCloseEdit} on:saved={onSaveGrant} preload={grantToEditInput} let:data>
    <FieldHidden path="allow" value={grantToEdit.allow} />
    <FieldHidden path="subjectType" value={grantToEdit.subjectType.name} />
    <FieldCheckboxList
      path="controls"
      legendText="Controls"
      items={subjectType.controls.map(c => ({ value: c.name }))}
    >
      <svelte:fragment slot="labelText" let:item>
        {@const control = subjectType.controls.find(c => c.name === item.value)}
        {#if control}
          <TooltipDefinition tooltipText={control.description} direction="bottom" align="start">
            {control.name}
          </TooltipDefinition>
        {:else}
          {item.value}
        {/if}
      </svelte:fragment>
    </FieldCheckboxList>
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
{:else if showGrantCreate}
  <PanelFormDialog open title="New {grantCreateAllow ? 'Grant' : 'Exception'}" submit={onCreateSubmit} validate={onCreateValidate} on:cancel={onCloseEdit} on:saved={onSaveGrant} let:data>
    <FieldHidden path="allow" value={grantCreateAllow} />
    {@const subjectType = data.subjectType ? subjectTypeLookup[data.subjectType] : undefined}
    <FieldSelect
      path="subjectType"
      labelText="Subject Type"
      items={subjectTypes.map(st => ({ value: st.name, label: st.title }))}
      helperText={subjectType?.description}
    />
    {#if subjectType}
      <FieldCheckboxList
        path="controls"
        legendText="Controls"
        items={subjectType.controls.map(c => ({ value: c.name }))}
      >
        <svelte:fragment slot="labelText" let:item>
          {@const control = subjectType.controls.find(c => c.name === item.value)}
          {#if control}
            <TooltipDefinition tooltipText={control.description} direction="bottom" align="start">
              {control.name}
            </TooltipDefinition>
          {:else}
            {item.value}
          {/if}
        </svelte:fragment>
      </FieldCheckboxList>

      {#each subjectType.tags as category (category.category)}
        <FieldMultiselect
          path="tags.{category.category}"
          titleText={category.label}
          helperText={category.description}
          label="Restrict to {category.label}"
          items={category.tags}
        />
      {/each}
    {/if}
  </PanelFormDialog>
{:else if grantToDelete}
  <Modal
    open
    modalHeading="Delete {grantToDelete.allow ? 'Grant' : 'Exception'}"
    primaryButtonText="Delete"
    secondaryButtonText="Cancel"
    size="sm"
    on:click:button--primary={executeDelete}
    on:click:button--secondary={closeDeleteConfirmation}
    on:submit={executeDelete}
    on:close={closeDeleteConfirmation}
  >
    <p>Are you sure you want to delete this {grantToDelete.allow ? 'grant' : 'exception'}?<br><em>{subjectTypeLookup[grantToDelete.subjectType.name].title}</em></p>
    <p>This action cannot be undone.</p>
  </Modal>
{/if}
