<script lang="ts">
  import { ColumnList, FieldMultiselect, FilterUI } from '@txstate-mws/carbon-svelte'
  import type { PageData } from './$types'
  import { Pagination } from '@txstate-mws/carbon-svelte'
  import { DateTime } from 'luxon';
  import type { Groupings } from '$lib';

  export let data: PageData
  $: ({ columns, rows, filters, page, totalItems, availableApplicationRoles } = data)

  function handlePagination(event: CustomEvent<{ page: number, pageSize: number, totalItems: number, groupings: Groupings[]}>) {
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

<FilterUI
  search
  on:apply={e => { usersSearchFormData = e.detail }}
  on:mount={e => { usersSearchFormData = e.detail }}>
  <svelte:fragment slot="quickfilters">
    <FieldMultiselect path="applicationRoles" label="Application Roles" items={availableApplicationRoles} />
    {#each filters ?? [] as filter, index (filter.id)}
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

