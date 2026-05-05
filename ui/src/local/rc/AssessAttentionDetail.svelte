<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { AssessAttentionDetail } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessAttentionDetail>
</script>

<FieldRadio boolean path="demonstrateAttentionDetail" legendText="Does the applicant follow instructions?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldRadio boolean path="grammarErrors" legendText="Do their materials have frequent spelling or grammar errors?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
 