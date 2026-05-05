<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { AssessCommunication } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessCommunication>
</script>

<FieldRadio boolean path="demonstrateCommunication" legendText="Is the applicant’s communication clear and structured?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
