<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let relatedConfigData
  $: requiredStateLegendText = (relatedConfigData?.state_residence_req) ? `Confirm applicant is a resident of ${relatedConfigData.state_residence_req.residentOfState}?` : 'Confirm applicant is a resident of: No accessible applicant state residence requirement config data'  
  $: residenceIsHomeLegendText = (relatedConfigData?.state_residence_req) ? `Confirm applicant address provided is a home within ${relatedConfigData.state_residence_req.residentOfState}?` : 'Confirm applicant address provided is a home within: No accessible applicant state residence requirement config data'
</script>

<FieldRadio boolean path="residentOfRequiredState" legendText="{requiredStateLegendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldRadio boolean path="residenceIsHome" legendText="{residenceIsHomeLegendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<!-- Need to show ID data here in the prompt-->

