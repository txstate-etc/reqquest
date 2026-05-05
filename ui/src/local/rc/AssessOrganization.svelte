<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { AssessOrganization } from './types.js'
  export let gatheredConfigData
  export let data: Partial<AssessOrganization>
</script>

<FieldRadio boolean path="demonstrateOrganization" legendText="Does the applicant demonstrate organization and task management?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
