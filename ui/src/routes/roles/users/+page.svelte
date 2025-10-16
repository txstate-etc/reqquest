<script lang="ts">
  import { ColumnList, FieldMultiselect, FilterUI, type ColumnDefinition } from '@txstate-mws/carbon-svelte'
  import type { PageData } from './$types'
  import { Pagination } from '@txstate-mws/carbon-svelte'
  import { DateTime } from 'luxon';
    import type { Groupings } from '$lib';

  export let data: PageData
  $: ({ users, availableApplicationRoles, pageInfo } = data)
  $: page = pageInfo?.currentPage
  $: totalItems = pageInfo?.totalItems
  $: groupings = pageInfo?.groupings

  function handlePagination(event: CustomEvent<{ page: number, pageSize: number, totalItems: number, groupings: Groupings[]}>) {
    page = event.detail.page
    totalItems = event.detail.totalItems
    groupings = event.detail.groupings
  }

  // TODO: Dynamically add groupings
  interface UsersSearchForm {
    search?: string
    applicationRoles?: string[]
    // institutionalRoles?: string[]
    [key: string]: string | string[] | undefined
  }
  let usersSearchFormData: UsersSearchForm | undefined

  // TODO: Dynamically add groupings
  interface UsersSearchDisplay {
    // Local data
    id: string
    fullname: string
    applicationRoles: string[]
    groups: string[]
    // Remote data
    email?: string
    otherId?: string
    otherInfo?: any
    // institutionalRoles?: string[]
    // lastLogin?: string
    // [key: string]: string | string[] | undefined
  }
  
  const columns: ColumnDefinition<UsersSearchDisplay>[] = [
    { id: 'contact', label: 'Name', render: user => user['email'] ? user['fullname'] + '<br>' + user['email'] : user['fullname'] },
    { id: 'id', label: 'IDs', render: user => [user['id'], user['otherId']].filter(id => id != null).join('<br>') },
    { id: 'applicationRoles', label: 'Application Roles', render: user => user['applicationRoles'].join(', ') },
    { id: 'groups', label: 'Groups', render: user => user['groups'].join(', ') }
    // TODO: Dynamically pull extra grouping columns
    // { id: 'institutionalRoles', label: 'Institutional Roles', render: user => user['institutionalRoles'] ? user['institutionalRoles'].join(', ') : '' },
    // { id: 'lastLogin', label: 'Last Login', get: 'lastLogin' }
  ]
  for (const group of pageInfo?.groupings ?? []) {
    if (group.useInList) columns.push({ id: group.label, label: group.displayLabel ? group.displayLabel : group.label, render: user => (!user.otherInfo || user.otherInfo[group.label] == undefined) ? '' : (Array.isArray(user.otherInfo[group.label])) ? user.otherInfo[group.label].join(', ') : user.otherInfo[group.label].toString() })
    // if (group.useInFilters) 
  }

  function transformFromAPI (users: PageData['users']): UsersSearchDisplay[] {
    return users.map(u => ({
      id: u.login,
      fullname: u.fullname,
      // Technically a person may belong to multiple rows
      // However the API schema shows single role.
      // and is returning undefined causing API to return 500
      // if applicaton roles field is requested.
      applicationRoles: u.roles.map(r => r.name),
      groups: u.groups,
      // External Data
      email: u.otherInfo?.email,
      otherId: u.otherInfo?.otherId
      // institutionalRoles: u.otherInfo?.institutionalRoles ?? [],
      // lastLogin: u.otherInfo?.lastLogin ? DateTime.fromISO(u.otherInfo?.lastLogin).toFormat('MM/dd/yyyy') : 'unknown'
    }))
  }
</script>

<FilterUI
  search
  on:apply={e => { usersSearchFormData = e.detail }}
  on:mount={e => { usersSearchFormData = e.detail }}>
  <svelte:fragment slot="quickfilters">
    <FieldMultiselect path="applicationRoles" label="Application Roles" items={availableApplicationRoles} />
    <!-- <FieldMultiselect path="institutionalRoles" label="Institutional Roles" items={availableInstitutionalRoles} /> -->
  </svelte:fragment>
</FilterUI>
<ColumnList
  title='Users'
  columns={columns}
  rows={transformFromAPI(users)}
>
</ColumnList>
<Pagination {page} {totalItems} on:update={handlePagination} noun="user" nounPlural="users" />

