<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { AssessCriticalThinking } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessCriticalThinking>
</script>

<FieldRadio boolean path="realIssue" legendText="Is the issue real?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

<FieldRadio boolean path="feasable" legendText="Is the proposed feature/change technologically feasible?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

