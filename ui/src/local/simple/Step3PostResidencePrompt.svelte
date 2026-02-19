<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  $: legendText = 'Should we allow the flow to continue?'
</script>
<FieldRadio boolean path="allow" legendText="{legendText}" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

