<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let configData
  $: legendText = `Are you a resident of ${configData.state_residence_req.residentOfState}?`  
</script>
<FieldRadio boolean path="residentOfRequiredState" legendText="{legendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />