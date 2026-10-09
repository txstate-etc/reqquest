<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { HelpDeskWeekendAvailability } from './types.js'
  export let gatheredConfigData
  export let data: Partial<HelpDeskWeekendAvailability>
</script>

<FieldRadio boolean path="weekendAvailable" legendText="Can you work at least one weekend shift per month?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
