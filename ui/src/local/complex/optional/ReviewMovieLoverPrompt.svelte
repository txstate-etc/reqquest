<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="impressed" labelText="Are you impressed with this movie lovers knowledge?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }    
  ]
} />