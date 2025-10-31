<script lang="ts">
  import { FieldRadio, FieldCheckbox, FieldSelect, FieldTextInput, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let data
</script>
<FieldRadio boolean path="owned" legendText="Are there any cats in the home currently?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldNumber path="count" labelText="How many?" conditional={ data.owned === true } />
<FieldTextInput path="details" labelText="Please provide more details?" conditional={ data.owned === true } />


