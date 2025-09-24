<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  import type { StateResidencePromptData } from './types.js'
  export let configData
  export let fetched: { residentOfState:  string }
  $: legendText = `Confirm applicant is a resident of ${fetched.residentOfState}?`  
</script>

<FieldRadio boolean path="residentOfRequiredState" legendText="{legendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<!-- Need to show ID data here in the prompt-->

