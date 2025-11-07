<script lang="ts">
  import { FieldRadio } from '@txstate-mws/carbon-svelte'
  export let data
</script>

<FieldRadio boolean path="previousCatAcceptable" labelText="Is the previous cat history information acceptable?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }    
  ]
} />

<FieldRadio boolean path="currentCatAcceptable" labelText="Is the current cat information acceptable?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }    
  ]
} />

<FieldRadio boolean path="livingSpaceAcceptable" labelText="Is living space information acceptable?" items={
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

<FieldRadio boolean path="microchipAgree" labelText="Is the microchip service agreement met?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }    
  ]
} />
