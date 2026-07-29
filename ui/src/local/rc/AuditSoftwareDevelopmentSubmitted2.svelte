<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="ok" legendText="Does the software development review still, for the second time, seem alright during the active review phase?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

