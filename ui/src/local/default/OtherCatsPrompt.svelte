<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="hasOtherCats" labelText="Do you have other cats?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]
} />
