<script lang="ts">
    import { FieldRadio } from "@txstate-mws/carbon-svelte"
  $: legendText = 'Would you like to see if you are eligible for this program?'
</script>
<FieldRadio boolean path="thanks" legendText="{legendText}" items={[{ label: 'Thanks', value: true }, { label: 'No Thanks', value: false }]} />

