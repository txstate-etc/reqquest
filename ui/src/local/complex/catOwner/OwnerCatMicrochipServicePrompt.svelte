<script lang="ts">
  import { FieldRadio, FieldTextInput } from '@txstate-mws/carbon-svelte'
  export let data
</script>
<FieldRadio boolean path="agreeToPay" legendText="Do you agree to cover the costs for microchipping services? " items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldTextInput path="details" labelText="Please provide more details?" conditional={ data.agreeToPay === false } />


