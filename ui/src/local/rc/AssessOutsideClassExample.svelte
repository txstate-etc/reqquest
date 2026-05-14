<script lang="ts">
  import { FieldRadio, FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { AssessOutsideClassExample } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessOutsideClassExample>
</script>

<FieldRadio boolean path="showCriticalThinking" legendText="Does the applicant show interest in building or creating technical solutions?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

<FieldTextArea path='explanation' labelText='Explain your score' />
