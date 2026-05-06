<script lang="ts">
  import { FieldRadio, FieldTextArea } from '@txstate-mws/carbon-svelte'
  import type { EvidenceWrittenAutomation } from './types.js'
  export let gatheredConfigData
  export let data: Partial<EvidenceWrittenAutomation>
</script>

<FieldRadio boolean path="appropriateAutomation" legendText="Did the applicant select an appropriate task(s) for automation?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldTextArea path='comments' labelText='Add any notable comments about their script' />
