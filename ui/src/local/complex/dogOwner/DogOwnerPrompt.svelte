<script lang="ts">
  import { FieldRadio, FieldCheckbox, FieldSelect, FieldTextInput, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let data
</script>
<FieldRadio boolean path="everOwnedADog" legendText="Have you ever onwed a dog?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldTextInput path="details" labelText="Please provide more details?" placeholder="Breed, age, type, start, end" conditional={ data.everOwnedADog === true } />


