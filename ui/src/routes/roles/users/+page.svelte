<script lang="ts">
  import { ColumnList, FieldMultiselect, FilterUI, type ColumnDefinition } from '@txstate-mws/carbon-svelte'
  import type { PageData } from './$types'
  import { DateTime } from 'luxon';


  export let data: PageData
  $: ({ users, availableApplicationRoles } = data)

  // TODO: Dynamically add groupings
  interface UsersSearchForm {
    search?: string
    applicationRoles?: string[]
    // institutionalRoles?: string[]
  }
  let usersSearchFormData: UsersSearchForm | undefined

  // TODO: Dynamically add groupings
  type UsersSearchDisplay = {
    // Local data
    id: string
    fullname: string
    applicationRoles: string[]
    groups: string[]
    // Remote data
    email?: string
    otherId?: string
    // institutionalRoles?: string[]
    // lastLogin?: string
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
