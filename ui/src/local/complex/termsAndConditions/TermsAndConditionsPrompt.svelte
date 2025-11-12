<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let configData
  $: tAndCText = configData.text
  
  console.log(JSON.stringify(configData))
  console.log(JSON.stringify($$props))
</script>

<FieldRadio boolean path="agree" legendText={tAndCText} items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
