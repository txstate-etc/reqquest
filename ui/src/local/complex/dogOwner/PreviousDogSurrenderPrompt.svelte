<script lang="ts">
  import { FieldRadio, FieldTextInput } from '@txstate-mws/carbon-svelte'
  export let data
</script>
<FieldRadio boolean path="surrendered" legendText="Have you ever surrendered a dog?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldTextInput path="details" labelText="Please provide more details?" placeholder="Reason dog was surrendered" conditional={ data.surrendered === true } />


