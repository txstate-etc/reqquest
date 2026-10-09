<script lang="ts">
  import { FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { HelpDeskCustomerService } from './types.js'
  export let gatheredConfigData
  export let data: Partial<HelpDeskCustomerService>
</script>

<FieldTextArea path='describeCustomerService' labelText="Describe a time you helped someone solve a technical problem." />
