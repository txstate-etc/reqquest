<script lang="ts">
  import { FieldRadio, FieldTextInput, FieldNumber } from '@txstate-mws/carbon-svelte'
  export let relatedConfigData
  $: tAndCText = relatedConfigData.text
  console.log(JSON.stringify(relatedConfigData))
</script>

<FieldRadio boolean path="agree" legendText={tAndCText} items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
