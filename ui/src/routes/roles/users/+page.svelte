<script lang="ts">
  import { ColumnList, FieldMultiselect, FilterUI } from '@txstate-mws/carbon-svelte'
  import { InlineNotification, Modal, Row } from 'carbon-components-svelte'
  import { invalidate } from '$app/navigation'
  import type { PageData } from './$types'
  import { DateTime } from 'luxon';

  interface UsersSearchForm {
    search?: string
    institutionalRoles?: string[]
    applicationRoles?: string[]
  }

  export let data: PageData
  $: ({ users, availableApplicationRoles, availableInstitutionalRoles } = data)

  let usersSearchFormData: UsersSearchForm | undefined

  type UsersSearchDisplay = {
    // Local data
    id: string
    fullname: string
//    applicationRoles: string[]
    groups: string[]
    // External data
    email?: string
    otherId?: string
    institutionalRoles?: string[]
    lastLogin?: string
  }
  function transformFromAPI (users: PageData['users']): UsersSearchDisplay[] {
    return users.map(u => ({
      id: u.login,
      fullname: u.fullname,
      // Technically a person may belong to multiple rows
      // However the API schema shows single role.
      // and is returning undefined causing API to return 500
      // if applicaton roles field is requested.
//      applicationRoles: [u.roles.name],
      groups: u.groups,
      // External Data
      email: u.otherInfo?.email,
      otherId: u.otherInfo?.otherId,
      institutionalRoles: u.otherInfo?.institutionalRoles ?? [],
      lastLogin: u.otherInfo?.lastLogin ? DateTime.fromISO(u.otherInfo?.lastLogin).toFormat('MM/dd/yyyy') : 'unknown'
    }))
  }
</script>

<FilterUI
  search
  on:apply={e => { usersSearchFormData = e.detail }}
  on:mount={e => { usersSearchFormData = e.detail }}>
  <svelte:fragment slot="quickfilters">
    <FieldMultiselect path="applicationRoles" label="Application Roles" items={availableApplicationRoles} />
    <FieldMultiselect path="institutionalRoles" label="Institutional Roles" items={availableInstitutionalRoles} />
  </svelte:fragment>
</FilterUI>
<ColumnList
  title='Users'
  columns= {[
    { id: 'contact', label: 'Name', render: user => user['email'] ? user['fullname'] + '<br>' + user['email'] : user['fullname'] },
    { id: 'otherId', label: 'ID', get: 'otherId' },
//    { id: 'applicationRoles', label: 'Application Roles', render: user => user['applicationRoles'].join(', ') },
    { id: 'groups', label: 'Groups', render: user => user['groups'].join(', ') },
    { id: 'institutionalRoles', label: 'Institutional Roles', render: user => user['institutionalRoles'].join(', ') },
    { id: 'lastLogin', label: 'Last Login', get: 'lastLogin' }
  ]}
  rows={transformFromAPI(users)}
  noItemsTitle='Please enter search query to retrieve data'
>
</ColumnList>
