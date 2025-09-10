<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'

  export let fetched: { residentOfState: string }
  console.log('Residence UI prompt')
  console.log(fetched)
  $: legendText = `GO Are you a resident of ${fetched.residentOfState}?`  
</script>

<FieldRadio boolean path="residentOfRequiredState" legendText="{legendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />