<script lang="ts">
  import { ColumnList, FieldMultiselect, FilterUI, Pagination } from '@txstate-mws/carbon-svelte'
  import type { PageData } from './$types'
  import { IntroPanel } from '$internal'

  export let data: PageData
  $: ({ columns, rows, filters, page, totalItems, availableApplicationRoles, roleUsersAttributeDescription } = data)

  function handlePagination (event: CustomEvent<{ page: number, pageSize: number, totalItems: number }>) {
    // event: {"isTrusted": false}
    console.debug(`handlePagination event: ${JSON.stringify(event)}`)
  }

  // TODO: Dynamically add groupings
  interface UsersSearchForm {
    search?: string
    applicationRoles?: string[]
    // institutionalRoles?: string[]
    [key: string]: string | string[] | undefined
  }
  let usersSearchFormData: UsersSearchForm | undefined

</script>
<IntroPanel
  title="Manage Users"
  subtitle={roleUsersAttributeDescription ?? 'This is where you should describe what kind of attributes app users will be able to search users by'}
/>
<FilterUI
  search
  on:apply={e => { usersSearchFormData = e.detail }}
  on:mount={e => { usersSearchFormData = e.detail }}>
  <svelte:fragment slot="quickfilters">
    <FieldMultiselect path="applicationRoles" label="Application Roles" items={availableApplicationRoles} />
    {#each filters as filter (filter.id)}
    <FieldMultiselect path={filter.id} label={filter.label} items={filter.items} />
    {/each}
  </svelte:fragment>
</FilterUI>
<ColumnList
  title='Users'
  columns={columns}
  rows={rows}
>
</ColumnList>
<Pagination {page} {totalItems} on:update={handlePagination} on:mount={handlePagination} noun="user" nounPlural="users" />
