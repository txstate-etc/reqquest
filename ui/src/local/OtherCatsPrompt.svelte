<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="hasOtherCats" labelText="Do you have other cats?" items={
  [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ]
} />
