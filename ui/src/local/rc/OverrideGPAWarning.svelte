<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="override" legendText="Override the minimum GPA requirement?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />

