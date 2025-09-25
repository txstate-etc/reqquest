<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let fetched: { residentOfState:  string }
  $: requiredStateLegendText = `Confirm applicant is a resident of ${fetched.residentOfState}?`  
  $: residenceIsHomeLegendText = `Confirm applicant address provided is a home within ${fetched.residentOfState}?` 
</script>

<FieldRadio boolean path="residentOfRequiredState" legendText="{requiredStateLegendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldRadio boolean path="residenceIsHome" legendText="{residenceIsHomeLegendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<!-- Need to show ID data here in the prompt-->

