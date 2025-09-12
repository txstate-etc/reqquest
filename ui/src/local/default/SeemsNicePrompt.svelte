<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="seemsNice" labelText="This applicant seems like a nice person." items={
  [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ]
} />
