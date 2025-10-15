<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  // export let fetched: { residentOfState:  string }
  export let relatedConfigData
  $: requiredStateLegendText = `Confirm applicant is a resident of ${relatedConfigData.state_residence_req.residentOfState}?`  
  $: residenceIsHomeLegendText = `Confirm applicant address provided is a home within ${relatedConfigData.state_residence_req.residentOfState}?` 
</script>

<FieldRadio boolean path="residentOfRequiredState" legendText="{requiredStateLegendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldRadio boolean path="residenceIsHome" legendText="{residenceIsHomeLegendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<!-- Need to show ID data here in the prompt-->

