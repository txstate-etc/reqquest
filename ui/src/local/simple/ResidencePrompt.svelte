<script lang="ts">
  import { FieldRadio, FieldUpload } from '@txstate-mws/carbon-svelte'
  import type { StateResidencePromptData } from './types.js'
  export let configData
  export let data: Partial<StateResidencePromptData>
  $: legendText = `Are you a resident of ${configData.state_residence_req.residentOfState}?`  
</script>

<FieldRadio boolean path="residentOfRequiredState" legendText="{legendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldUpload path="residentIdDoc" conditional={!!data.residentOfRequiredState} labelText="Residence identification document" />
