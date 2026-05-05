<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { AssessTechnicalTroubleshooting } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessTechnicalTroubleshooting>
</script>

<FieldRadio boolean path="demonstrateTechincalTroubleshooting" legendText="Did the applicant demonstrate a structured methodology for troubleshooting?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldRadio boolean path="complexity" legendText="Rate the complexity of the problem solved Help text: 1 being the worst, 5 being the best" items={[{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 },]} />
