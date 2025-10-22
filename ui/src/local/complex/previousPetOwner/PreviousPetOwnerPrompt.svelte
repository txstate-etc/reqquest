<script lang="ts">
  import { FieldRadio, FieldCheckbox, FieldSelect, FieldTextInput, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let data
  $: console.log(`JSON Data: ${JSON.stringify(data)}`)
</script>
<FieldRadio boolean path="previousPetOwnership.owned" legendText="Have you previously owned a pet?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldNumber path="previousPetOwnership.count" labelText="How many pets total previously?" conditional={data.previousPetOwnership?.owned === true} />
<FieldRadio boolean path="currentPetOwnership.owned" legendText="Do you have any pets currently?" conditional={data.previousPerOwnership?.count > 0} items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldNumber path="currentPetOwnership.count" labelText="How many pets total currently?" conditional={data.currentPetOwnership?.owned === true} />
<FieldTextInput path="currentPetOwnership.details" labelText="Any additional details you wish to provide?" conditional={data.previousPerOwnership?.count > 0} />


