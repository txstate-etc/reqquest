<script lang="ts">
  import { FieldRadio, FieldTextInput } from '@txstate-mws/carbon-svelte'
  export let data
</script>
<FieldRadio boolean path="allergic" legendText="Do you or anyone you live with have any known cat allergies?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldTextInput path="details" labelText="Please provide more details?" conditional={ data.allergic === true } />


