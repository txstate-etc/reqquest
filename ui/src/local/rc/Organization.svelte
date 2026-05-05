<script lang="ts">
  import { FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { Organization } from './types.js'
  export let gatheredConfigData
  export let data: Partial<Organization>
</script>

<FieldTextArea path='describeOrganization' labelText=" Describe a time you had to organize tasks or coordinate something (school, event, group project, etc.)" />
