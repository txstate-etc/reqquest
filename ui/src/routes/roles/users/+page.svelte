<script lang="ts">
  import { ColumnList, FieldMore, FieldMultiselect, FieldTextInput, PanelFormDialog, type ComboMenuItem } from '@txstate-mws/carbon-svelte'
  import { InlineNotification, Modal } from 'carbon-components-svelte'
  import { invalidate } from '$app/navigation'
  import { api, type AccessRole, type AccessRoleGroup } from '$lib'
  import type { PageData } from './$types'

  interface FilterState {
    search?: string
    institutionalRoles?: string[]
  }

  export let data: PageData
  $: ({ users, access } = data)

  // Reactive statements for filter options
  $: availableInstitutionalRoles = getInstitutionalRoles()

  function getInstitutionalRoles(): ComboMenuItem[] {
    return [{value: 'Faculty'}, {value: 'Staff'}, {value: 'Student'}]
  }
</script>
<!--
<FieldTextInput path="search" label="Search" />
<FieldMultiselect path="institutionalRoles" label="Institutional Roles" items={availableInstitutionalRoles} />
-->
<InlineNotification
  kind="info"
  title="No results found."
  subtitle="You may need to refine your searched terms, filters or try again."
  lowContrast/>

