<script lang="ts">
  import { FieldRadio, FieldTextInput, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let data
  export let relatedConfigData
  $: underMinAge = relatedConfigData.underMinAge ?? 'Related config data is not working'
  $: underMinAgeLegendText = `Are there any children in the home under the age of ${underMinAge}`
</script>
<FieldRadio boolean path="underMinAge" legendText={underMinAgeLegendText} items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
<FieldNumber path="count" labelText="How many?" conditional={ data.owned === true } />
<FieldTextInput path="details" labelText="Please provide more details?" conditional={ data.owned === true } />


