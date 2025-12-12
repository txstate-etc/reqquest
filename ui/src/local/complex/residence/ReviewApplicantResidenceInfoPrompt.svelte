<script lang="ts">
  import { FieldRadio, FieldTextArea } from '@txstate-mws/carbon-svelte'
  export let data
</script>

<FieldRadio boolean path="residencyInfoAcceptable" labelText="Does the ID file match applicant input?" items={
  [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }    
  ]
} />

<FieldTextArea path="corrections" conditional={ data.residencyInfoAcceptable === false } labelText="Identify inaccuracies between ID file and applicant input" />
