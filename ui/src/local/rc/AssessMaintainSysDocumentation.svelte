<script lang="ts">
  import { FieldRadio, FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { AssessMaintainSysDocumentation } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessMaintainSysDocumentation>
</script>

<FieldRadio boolean path="clarity" legendText="s the documentation clear enough that a new team member could follow it without additional help?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldTextArea path='comments' labelText='Add any notable comments about the quality of their documentation' />
