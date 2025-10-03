<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="allergicToTuna" legendText="Are you allergic to airborne tuna?" items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
