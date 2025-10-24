<script lang="ts">
  import { FieldRadio, FieldCheckbox, FieldSelect, FieldTextInput, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let data
</script>
<FieldRadio boolean path="owned" legendText="Have you ever owned a dog?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldTextInput path="details" labelText="Please provide more details?" placeholder="Breed, age, type, start, end" conditional={ data.owned === true } />


