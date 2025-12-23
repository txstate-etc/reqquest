<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let data
</script>

<FieldRadio boolean path="previousDogAcceptable" labelText="Is the previous dog history information acceptable?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]
} />

<FieldRadio boolean path="currentDogAcceptable" labelText="Is the current dog information acceptable?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]
} />

<FieldRadio boolean path="yardAcceptable" labelText="Is yard information acceptable?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]
} />

<FieldRadio boolean path="allergyAcceptable" labelText="Is the allergy information acceptable?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]
} />

<FieldRadio boolean path="surrenderedAcceptable" labelText="Is the surrendered information acceptable?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]
} />

<FieldRadio boolean path="exerciseMinMet" labelText="Is the minimum exercise agreement met?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]
} />

<FieldRadio boolean path="exerciseException" conditional={ data.exerciseMinMet === false } labelText="Grant minimum exercise agreement exception based on additional details?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]
} />
