<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
</script>

<FieldRadio boolean path="distemper.satisfactory" labelText="Is the proof of distemper vaccination satisfactory?" items={
  [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ]
} />

<FieldRadio boolean path="rabies.satisfactory" labelText="Is the proof of rabies vaccination satisfactory?" items={
  [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ]
} />

<FieldRadio boolean path="felineLeukemia.satisfactory" labelText="Is the proof of feline leukemia vaccination satisfactory?" items={
  [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ]
} />

<FieldRadio boolean path="felineHIV.satisfactory" labelText="Is the proof of feline HIV vaccination satisfactory?" items={
  [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ]
} />
