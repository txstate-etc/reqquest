<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="ok" legendText="Does the software development review seem alright during the regular non blocking workflow phase?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

