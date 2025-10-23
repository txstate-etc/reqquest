<script lang="ts">
  import { FieldRadio, FieldCheckbox, FieldSelect, FieldTextInput, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let data
  $: console.log(`JSON Data: ${JSON.stringify(data)}`)
</script>
<FieldRadio boolean path="previousPetOwner" legendText="Have you previously owned a pet?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldNumber path="previousPetCount" labelText="How many pets total previously?" conditional={ data.previousPetOwner === true } />
<FieldRadio boolean path="currentPetOwner" legendText="Do you have any pets currently?" conditional={ data.previousPetOwner === true } items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldNumber path="currentPetCount" labelText="How many pets total currently?" conditional={ data.currentPetOwner === true } />
<FieldTextInput path="currentPetDetails" labelText="Any additional details you wish to provide?" conditional={ data.currentPetOwner === true } />


